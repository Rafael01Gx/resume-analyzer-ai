import {Component, effect, signal} from '@angular/core';
import {NavbarComponent} from '../components/navbar.component';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {DecimalPipe} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';


@Component({
  selector: 'app-upload',
  imports: [
    NavbarComponent,NgxDropzoneModule,DecimalPipe,FormsModule
  ],
  template: `
    <main class="bg-[url('/images/bg-main.svg')] bg-cover">

      <app-navbar/>

      <section class="main-section">
        <div class="page-heading py-16">
          <h1>Feedback inteligente para o emprego dos seus sonhos</h1>
          @if (isProcessing()) {
            <h2>{{ statusText() }}</h2>
            <img src="images/resume-scan.gif" alt="scan image" class="w-full">
          } @else {
            <h2>envie seu currículo para uma pontuação ATS e dicas de melhoria</h2>
          }
          @if (!isProcessing()) {
            <form id="upload-form" #f="ngForm" (submit)="handleSubmit(f)" class="flex flex-col gap-4 mt-8">
              <div class="form-div">
                <label for="company-name">Nome da Empresa</label>
                <input type="text" id="company-name" name="company-name" [(ngModel)]="formData.companyName"
                       class="input-field" placeholder="Digite o Nome da Empresa" required/>
              </div>

              <div class="form-div">
                <label for="job-title">Função</label>
                <input type="text" id="job-title" name="job-title" [(ngModel)]="formData.jobTitle" class="input-field"
                       placeholder="Digite a Função" required/>
              </div>

              <div class="form-div">
                <label for="job-description">Descrição do Trabalho</label>
                <textarea rows="5" id="job-description" name="job-description" [(ngModel)]="formData.jobDescription"
                          class="input-field" placeholder="Descreva sobre sua função" required></textarea>
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
    if (form.invalid || !this.file()) { // Adiciona validação do arquivo
      return;
    }
  }
}
