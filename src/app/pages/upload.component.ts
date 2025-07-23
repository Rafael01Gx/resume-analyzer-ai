import {Component, inject, signal} from '@angular/core';
import {NavbarComponent} from '../components/navbar.component';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {DecimalPipe} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {IDataAnalyze} from '../interfaces/data-analyze.interface';
import {PuterService} from '../services/puter.service';
import {Pdf2ImgService} from '../services/pdf2img.service';
import {prepareInstructions} from '../../constants';
import { v4 as uuidv4 } from 'uuid';
import {Router} from '@angular/router';

@Component({
  selector: 'app-upload',
  imports: [
    NavbarComponent,NgxDropzoneModule,DecimalPipe,FormsModule
  ],
  template: `
    <main class="bg-[url('/images/bg-main.svg')] bg-cover">

      <app-navbar />

      <section class="main-section">
        <div class="page-heading py-16">
          <h1>Feedback inteligente para o emprego dos seus sonhos</h1>
          @if (isProcessing()) {
            <h2 class="animate-pulse">{{ statusText() }}</h2>
            <img src="images/resume-scan.gif" alt="scan image" class="size-[400px]">
          } @else {
            <h2>envie seu currículo para uma pontuação ATS e dicas de melhoria</h2>
          }
          @if (!isProcessing()) {
            <form id="upload-form" #f="ngForm" (submit)="handleSubmit(f)" class="flex flex-col gap-4 mt-8">
              <div class="form-div">
                <label for="company-name">Nome da Empresa</label>
                <input type="text" id="company-name" name="companyName" [(ngModel)]="formData.companyName"
                       class="input-field" placeholder="Digite o Nome da Empresa" required/>
              </div>

              <div class="form-div">
                <label for="job-title">Função</label>
                <input type="text" id="job-title" name="jobTitle" [(ngModel)]="formData.jobTitle" class="input-field"
                       placeholder="Digite a Função" required/>
              </div>

              <div class="form-div">
                <label for="job-description">Descrição da Vaga</label>
                <textarea rows="5" id="job-description" name="jobDescription" [(ngModel)]="formData.jobDescription"
                          class="input-field" placeholder="Liste as atividades que irá desempenhar ou cole a descrição da vaga aqui.." required></textarea>
              </div>

              <div class="form-div">
                <label for="uploader">Envie seu currículo</label>
                <div class="w-full gradient-border">
                  <ngx-dropzone [multiple]="false" accept="application/pdf" [maxFileSize]="20 * 1024 * 1024"
                                (change)="onSelect($event)" class="!border-none !bg-white/0">
                    <div
                      class="size-full flex flex-col justify-center items-center space-y-4 cursor-pointer  overflow-hidden">
                      @if (file()) {
                        <ngx-dropzone-preview
                          class="!bg-[url('/images/pdf.png')] !bg-top !bg-contain !min-h-1/2 !h-1/2 !min-w-[90px] "
                          [removable]="true" (removed)="onRemove()">
                        </ngx-dropzone-preview>
                        <p class="text-lg text-gray-500 -mt-2">{{ file()?.name }}</p>
                        <p
                          class="text-lg text-gray-500 -mt-2">{{ file() ? ((file()?.size! / 1024) / 1024 | number:'1.0-2') : null }}
                          Mb</p>
                      } @else {
                        <div class="size-16 flex">
                          <img src="icons/info.svg" alt="upload-area" class="size-20">
                        </div>
                        <div>
                          <p class="text-lg text-gray-500">
                            <span class="font-semibold">
                              Clique
                            </span>
                            ou arraste o arquivo aqui para enviar
                          </p>
                          <p class="text-sm text-gray-500">PDF (max 20 MB)</p>
                        </div>
                      }
                    </div>
                  </ngx-dropzone>

                </div>
              </div>
              <button class="primary-button disabled:opacity-60 disabled:cursor-not-allowed" type="submit"
                      [disabled]="f.invalid">Analisar Currículo
              </button>
            </form>
          }
        </div>
      </section>
    </main>

  `
})
export class UploadComponent {
  #puterService = inject(PuterService);
  #pdf2ImgService = inject(Pdf2ImgService);
  #router= inject(Router);
  isAuthenticated = this.#puterService.isAuthenticated;
  prepareInstructions=prepareInstructions
  isProcessing = signal<boolean>(false);
  statusText = signal<string>('');
  file = signal<File | null>(null);
  formData = {
    companyName: '',
    jobTitle: '',
    jobDescription: ''
  };

  onSelect(event:any) {
    this.file.set(event.addedFiles[0]);
  }

  onRemove() {
    this.file.set(null);
  }

  handleSubmit(form:NgForm){
    if (form.invalid || !this.file()) {
      return;
    }
    if(this.file()?.type === 'application/pdf'){
      const data: IDataAnalyze = {
        ...form.value,
        file: this.file()
      }
      this.handleAnalize(data);
      return;
    }

  }


  async handleAnalize(data:IDataAnalyze) {
  this.isProcessing.set(true);
  this.statusText.set('Enviando o arquivo ...');
  const uuid =  uuidv4();
  try {
   const uploadedFile = await this.#puterService.uploadFiles([data.file])
     if(!uploadedFile) return this.statusText.set('Erro ao enviar o arquivo');

   this.statusText.set('Convertendo para imagem ...');

   const imageFile = await this.#pdf2ImgService.convertPdfToImage(data.file)
    if(!imageFile) return this.statusText.set('Erro ao converter a imagem');

   this.statusText.set('Enviando a imagem ...');

   const uploadedImage = await this.#puterService.uploadFiles([imageFile.file!])
    if(!uploadedImage) return  this.statusText.set('Erro ao enviar a imagem');

    this.statusText.set('Preparando os dados ...');


        const _data = {
          id: uuid,
          resumePath: uploadedFile.path,
          imagePath: uploadedImage.path,
          companyName: data.companyName,
          jobTitle: data.jobTitle,
          jobDescription: data.jobDescription,
          feedback: '',
        }


        await this.#puterService.setKV(`resume:${uuid}`,JSON.stringify(_data));
        this.statusText.set('Analisando ...')

        const feedback = await this.#puterService.provideFeedback(
          uploadedFile.path,this.prepareInstructions(data.jobTitle,data.jobDescription)
        )
        if(!feedback) {
            const imageName = this.getFileNameFromPath(uploadedImage.path);
            await this.#puterService.deleteFile(imageName);

            const resumeName = this.getFileNameFromPath(uploadedFile.path);
            await this.#puterService.deleteFile(resumeName);

          return this.statusText.set('Erro ao analisar currículo ...')
        }

        const feedbackText = typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text;

        _data.feedback= JSON.parse(feedbackText);

        await this.#puterService.setKV(`resume:${uuid}`,JSON.stringify(_data));
        this.statusText.set('Análise concluída, redirecionando ...')
        setTimeout(()=>{
          this.#router.navigateByUrl(`/resume/${uuid}`)
        },1000)

  } catch (error) {
    console.log(error)
    throw error;
  }
  }

  async handleDelete(file:Resume) {

    try {
      await this.#puterService.deleteKV(`resume:${file.id}`)
      if(file.imagePath){
        const imageName = this.getFileNameFromPath(file.imagePath);
        await this.#puterService.deleteFile(imageName);
      }
      if(file.resumePath){
        const resumeName = this.getFileNameFromPath(file.resumePath);
        await this.#puterService.deleteFile(resumeName);
      }
      return ;
    } catch (error) {
      console.log(error)
    }
  };
  private getFileNameFromPath(path: string): string {
    const lastSlashIndex = path.lastIndexOf('/');
    return lastSlashIndex !== -1 ? path.substring(lastSlashIndex + 1) : path;
  }
}
