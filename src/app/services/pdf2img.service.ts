import {Injectable} from '@angular/core';
//import * as pdfjsLib from 'pdfjs-dist';

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Pdf2ImgService {
  pdfjsLib: any = null;
  isLoading = false;
  loadPromise: Promise<any> | null = null;

  async loadPdfJs(): Promise<any> {
    if (this.pdfjsLib) return this.pdfjsLib;
    if (this.loadPromise) return this.loadPromise;

    this.isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    this.loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      this.pdfjsLib = lib;
      this.isLoading = false;
      return lib;
    });

    return this.loadPromise;
  }

  async convertPdfToImage(
    file: File
  ): Promise<PdfConversionResult> {
    try {
      const lib = await this.loadPdfJs();

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 4 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (context) {
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
      }

      await page.render({ canvasContext: context!, viewport }).promise;

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a File from the blob with the same name as the PDF
              const originalName = file.name.replace(/\.pdf$/i, "");
              const imageFile = new File([blob], `${originalName}.png`, {
                type: "image/png",
              });

              resolve({
                imageUrl: URL.createObjectURL(blob),
                file: imageFile,
              });
            } else {
              resolve({
                imageUrl: "",
                file: null,
                error: "Failed to create image blob",
              });
            }
          },
          "image/png",
          1.0
        ); // Set quality to maximum (1.0)
      });
    } catch (err) {
      return {
        imageUrl: "",
        file: null,
        error: `Failed to convert PDF: ${err}`,
      };
    }
  }

}
