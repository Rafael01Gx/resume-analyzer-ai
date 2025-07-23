import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {PuterService} from '../services/puter.service';

@Component({
  selector: 'app-wipe',
  imports: [],
  template: `
    <div class="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover">
      <div class="mx-auto max-w-[90%] h-full">

        <div class="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Gerenciar Dados da Aplicação</h2>
              <p class="text-gray-600">Visualize e gerencie os dados armazenados em sua conta</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500 mb-1">Usuário autenticado</p>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <span class="font-medium text-gray-900">{{ auth().user?.username }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-6">

          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm">
              <div class="p-6 border-b border-gray-200">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 7l4-4 4 4"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">Currículos Existentes</h2>
                    <p class="text-sm text-gray-500">{{ filesLength() }} arquivo(s) encontrado(s)</p>
                  </div>
                </div>
              </div>

              <div class="p-6 mb-8">
                @if (!files()) {
                  <div class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum arquivo encontrado</h3>
                    <p class="text-gray-500">Não há arquivos armazenados em sua conta no momento.</p>
                  </div>
                } @else {
                  <div class="space-y-3">
                    @for (resume of resumes(); track resume.id; let i = $index) {
                      <div
                        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                          </div>
                          <div>
                            <p class="font-medium text-gray-900">Empresa : {{ resume.companyName }}</p>
                            <p class="font-medium text-gray-900">Função :{{ resume.jobTitle }}</p>
                            <p class="text-sm text-gray-500 ">{{ resume.id }}</p>
                          </div>
                        </div>
                        <a (click)="handleDelete(resume)"
                           class="secondary-gradient hover:scale-x-105 hover:cursor-pointer font-semibold rounded-full ml-auto p-2">
                          Remover
                        </a>
                      </div>
                    }
                  </div>
                  <div class="pt-2 flex flex-wrap overflow-hidden mt-6 border-t !border-t-gray-200 ">
                    <div class="w-full mb-4 p-4">
                      <h3 class="text-center text-lg font-semibold text-gray-900">Arquivos</h3>
                    </div>
                    @for(file of files(); track file) {
                      <div
                        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                          </div>
                          <div>
                            <p class="font-medium text-gray-900">{{ file.name }}</p>
                          </div>
                        </div>
                      </div>
                    }
                  </div>


                }
              </div>
            </div>
          </div>

          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm border-2 border-red-100">
              <div class="p-6 border-b border-red-100 bg-red-50">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-red-900">Zona de Perigo</h3>
                    <p class="text-sm text-red-600">Ações irreversíveis</p>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <div class="mb-4">
                  <h4 class="font-medium text-gray-900 mb-2">Limpar Todos os Dados</h4>
                  <p class="text-sm text-gray-600 mb-4">
                    Esta ação irá remover permanentemente todos os arquivos e dados da aplicação.
                    <strong class="text-red-600">Esta ação não pode ser desfeita.</strong>
                  </p>
                </div>

                <div class="space-y-3">
                  <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div class="flex items-start gap-2">
                      <svg class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                           viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                      <div class="text-sm text-red-700">
                        <p class="font-medium mb-1">Será removido:</p>
                        <ul class="list-disc list-inside space-y-1">
                          <li>Todos os arquivos ({{ filesLength() }})</li>
                          <li>Dados em cache (KV)</li>
                          <li>Configurações locais</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group"
                    (click)="handleDeleteAll()"
                  >
                    <svg class="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Limpar Todos os Dados
                  </button>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm mt-6">
              <div class="p-6">
                <h3 class="font-medium text-gray-900 mb-4">Resumo dos Dados</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Total de arquivos</span>
                    <span class="font-medium">{{ filesLength() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Usuário ativo</span>
                    <span class="font-medium text-green-600">{{ auth().user?.username }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class WipeComponent implements OnInit{
  #puterService = inject(PuterService);

  auth = signal(this.#puterService.authState());
  files = signal<FSItem[] | null>(null);
  resumes = signal<Resume[] | null>(null);
  filesLength = computed(() => this.files() ? this.files()!.length : 0);


  constructor() {
    effect(() => {
      if (this.resumes()) {
        this.loadFiles()
      }
    });
  }

ngOnInit() {
    setTimeout(()=>{
      this.loadResumes()
      this.loadFiles()
      this.auth.set(this.#puterService.authState())
    },500)
}


  async loadFiles() {
    const files = await this.#puterService.readDirectory("./") as FSItem[]
    this.files.set(files);
  };
  async loadResumes() {
    const resumes = await this.#puterService.listKV('resume:*',true) as KVItem[]
    const parsedResumes = resumes?.map(resume => { return JSON.parse(resume.value) as Resume })
    this.resumes.set(parsedResumes);

  };

  async handleDeleteAll() {
    this.files()!.forEach((file) => {
      this.#puterService.deleteFile(file.name);
    });
    await this.#puterService.flushKV();
    return this.loadFiles();
  };



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
    this.loadResumes()
    this.loadFiles()
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
