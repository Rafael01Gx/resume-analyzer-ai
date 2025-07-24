import {
  Component,
  computed,
  effect,
  inject, makeStateKey,
  OnInit,
  PLATFORM_ID,
  signal,
  TransferState,
  ViewChild
} from '@angular/core';
import {NavbarComponent} from '../components/navbar.component';
import {ResumeCardComponent} from '../components/resume-card.component';
import {PuterService} from '../services/puter.service';
import {resumes} from '../../constants';
import {isPlatformBrowser} from '@angular/common';

const RESUMES_STATE_KEY = makeStateKey<Resume[]>('appHomeResumes');

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, ResumeCardComponent],
  template: `
    <main class="bg-[url('/images/bg-main.svg')] bg-cover transition-['scroll'] duration-500">

      <app-navbar [btnText]="btnText() || '' " #nav/>

      <section class="main-section">
        @if (isAuthenticated()) {
          <div class="page-heading py-16">
            <h1>Acompanhe Suas Inscrições & Avaliações de Currículos</h1>
            @if (!loadingResumes() && resumes().length == 0) {
              <h2>
                Nenhum currículo encontrado. Envie seu primeiro currículo para receber feedback.
              </h2>
            } @else {
              <h2>
                Revise seus envios e verifique o feedback com tecnologia de IA
              </h2>
            }
          </div>
          @if (loadingResumes()) {
            <div class="flex flex-col items-center justify-center">
              <img src="/images/resume-scan-2.gif" class="w-[200px]" alt="scan-gif"/>
            </div>
          }

          @if (!loadingResumes() && resumes().length > 0) {
            <div class="resumes-section">
              @for (resume of resumes(); track resume.id; let i = $index) {
                <app-resume-card [key]="i" [resume]="resume"/>
              }
            </div>
          }
          @if (!loadingResumes() && resumes().length == 0) {
            <div class="flex flex-col items-center justify-center mt-10 gap-4">
              <a href="/upload" class="primary-button w-fit text-xl font-semibold ">
                Enviar Currículo
              </a>
            </div>
          }
        } @else {
          <div class="page-heading py-16 text-center">
            <h1 class="text-4xl font-bold mb-6">Transforme Seu Currículo com Inteligência Artificial</h1>
            <h2 class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Receba análises detalhadas, sugestões de melhoria e feedback personalizado para destacar seu perfil no
              mercado de trabalho.
              Nossa IA examina cada seção do seu currículo e oferece insights valiosos para potencializar suas chances
              de sucesso.
            </h2>
            <div class="grid md:grid-cols-3 gap-8 mt-12 mb-12">
              <div class="text-center">
                <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="font-semibold text-lg mb-2">Análise Completa</h3>
                <p class="text-gray-600">Avaliação profunda de estrutura, conteúdo e formatação</p>
              </div>
              <div class="text-center">
                <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 class="font-semibold text-lg mb-2">Feedback Instantâneo</h3>
                <p class="text-gray-600">Resultados rápidos com sugestões práticas e aplicáveis</p>
              </div>
              <div class="text-center">
                <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                  </svg>
                </div>
                <h3 class="font-semibold text-lg mb-2">Melhoria Contínua</h3>
                <p class="text-gray-600">Acompanhe sua evolução e otimize constantemente</p>
              </div>
            </div>
          </div>
          <div class="resumes-section">
            @for (resume of mockResumes; track resume.id; let i = $index) {
              <app-resume-card [isMock]="true" [key]="i" [resume]="resume"/>
            }
          </div>
          <div class="flex flex-col items-center justify-center mt-12 gap-6 pb-16">
            <h3 class="text-2xl font-semibold text-center">Pronto para começar?</h3>
            <p class="text-gray-600 text-center max-w-md">
              Faça login para acessar todas as funcionalidades e começar a melhorar seu currículo hoje mesmo.
            </p>
            <a href="#nav" (click)="loginClick()" class="primary-button w-fit text-xl font-semibold px-8 py-4">
              Fazer Login
            </a>
          </div>
        }
      </section>
    </main>`
})
export class HomeComponent implements OnInit {
  @ViewChild('nav') navComponent!: any;
  #platformId = inject(PLATFORM_ID);
  #transferState = inject(TransferState);
  #puterService = inject(PuterService);
  mockResumes = resumes
  isAuthenticated = this.#puterService.isAuthenticated;
  loadingResumes = signal(false);
  resumes = signal<Resume[]>([]);
  btnText = computed(() => {
    return this.isAuthenticated() ? 'Sair' : 'Entrar'
  })

  constructor() {
    effect(() => {
      if (this.isAuthenticated()) {
        this.loadResumes()
      }
    });
  }

  ngOnInit() {
    const cachedResumes = this.#transferState.get<Resume[]>(RESUMES_STATE_KEY, [])
    if (cachedResumes) {
      this.resumes.set(cachedResumes);
      this.loadingResumes.set(false);
      this.#transferState.remove(RESUMES_STATE_KEY);
    } else if (isPlatformBrowser(this.#platformId)) {
      this.loadResumes();
    }
  }

  async loadResumes() {
    if (this.loadingResumes() || (isPlatformBrowser(this.#platformId) && this.resumes().length > 0)) {
      return;
    }
    this.loadingResumes.set(true);
    const resumes = await this.#puterService.listKV('resume:*', true) as KVItem[]
    const parsedResumes = resumes?.map(resume => {
      return JSON.parse(resume.value) as Resume
    })
    this.resumes.set(parsedResumes || []);
    this.loadingResumes.set(false);
  }

  loginClick() {
    this.navComponent.signIn();
  }
}

