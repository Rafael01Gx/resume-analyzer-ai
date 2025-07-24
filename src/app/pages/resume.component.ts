import {Component, effect, inject, makeStateKey, OnInit, PLATFORM_ID, signal, TransferState} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PuterService} from '../services/puter.service';
import {SummaryComponent} from '../components/summary.component';
import {AtsComponent} from '../components/ats.component';
import {DetailsComponent} from '../components/details/details.component';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';

const RESUME_DATA_STATE_KEY = makeStateKey<string>('appResumeData');

@Component({
  selector: 'app-resume',
  imports: [SummaryComponent, AtsComponent, DetailsComponent],
  template: `
    <main class="!pt-0">
      <nav class="resume-nav">
        <a href="/" class="back-button">
          <img src="/icons/back.svg" alt="logo" class="w-2.5 h-2.5">
          <span class="text-sm text-gray-800 font-semibold">Voltar</span>
        </a>
      </nav>
      <div class="flex flex-row w-full max-lg:flex-col-reverse">
        <section
          class="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
          @if (imageUrl() && resumeUrl()) {
            <div class="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit">
              <a [href]="resumeUrl()" target="_blank" rel="noopener noreferrer">
                <img [src]="imageUrl()" class="w-full h-full object-contain rounded-2xl" alt="resume"
                     title="curriculo"/>
              </a>
            </div>
          }
        </section>
        <section class="feedback-section">
          <h2 class="text-4xl !text-black font-bold">Revisão de Currículo</h2>
          @if (feedback()) {
            <div class="flex flex-col gap-8 animate-in fade-in duration-1000">
              <app-summary [feedBack]="feedback()!"/>
              <app-ats [score]="feedback()?.ATS?.score||0" [suggestions]="feedback()?.ATS?.tips || []"/>

              <app-details [feedback]="feedback()!"/>

            </div>
          } @else {
            <img src="/images/resume-scan-2.gif" class="w-full" alt="scan"/>
          }

        </section>
      </div>

    </main>
  `
})
export class ResumeComponent implements OnInit {

  #activatedRoute = inject(ActivatedRoute);
  #puterService = inject(PuterService);
  #platformId = inject(PLATFORM_ID);
  #transferState = inject(TransferState);

  resumeId = signal<string | null>(null);
  resumeDataJson = signal<string | null>(null);
  imageUrl = signal<string>('');
  resumeUrl = signal<string>('');
  feedback = signal<Feedback | null>(null);

  constructor() {
    effect(() => {
      const currentResumeData = this.resumeDataJson();
      if (currentResumeData) {
        this.transformResume(currentResumeData).catch(err => console.error('Erro ao transformar dados do currículo:', err));
      } else if (this.resumeId() && isPlatformBrowser(this.#platformId) && !this.#transferState.hasKey(RESUME_DATA_STATE_KEY)) {
        this.fetchResumeData(this.resumeId()!).catch(err => console.error('Erro ao obter currículo no effect:', err));
      }
    });
  }

  ngOnInit() {
    const currentResumeId = this.#activatedRoute.snapshot.params['id'];
    this.resumeId.set(currentResumeId);

    if (isPlatformServer(this.#platformId) && currentResumeId) {
      this.fetchResumeData(currentResumeId).then(data => {
        if (data) {
          this.#transferState.set(RESUME_DATA_STATE_KEY, data);
        }
      }).catch(err => console.error('Erro ao buscar e salvar resume no server:', err));

    } else if (isPlatformBrowser(this.#platformId)) {
      const cachedResumeData = this.#transferState.get<string>(RESUME_DATA_STATE_KEY, '');

      if (cachedResumeData) {
        this.resumeDataJson.set(cachedResumeData);
        this.#transferState.remove(RESUME_DATA_STATE_KEY);
      } else if (currentResumeId) {
        this.fetchResumeData(currentResumeId).catch(err => console.error('Erro ao buscar resume no browser:', err));
      }
    }
  }

  async fetchResumeData(id: string): Promise<string | null | undefined> {
    try {
      const resume = await this.#puterService.getKV(`resume:${id}`);
      this.resumeDataJson.set(resume || null);
      return resume;
    } catch (error) {
      console.error(`Erro ao obter dados para resume:${id}:`, error);
      this.resumeDataJson.set(null);
      return null;
    }
  }

  async transformResume(resumeJsonString: string) {
    try {
      const data = JSON.parse(resumeJsonString);
      this.feedback.set(data.feedback);

      this.resumeUrl.set(data.resumePath);
      this.imageUrl.set(data.imagePath);

      if (isPlatformBrowser(this.#platformId)) {
        const resumeBlob = await this.#puterService.readFile(data.resumePath);
        if (resumeBlob) {
          const pdfBlob = new Blob([resumeBlob], {type: 'application/pdf'});
          this.resumeUrl.set(URL.createObjectURL(pdfBlob));
        }

        const imageBlob = await this.#puterService.readFile(data.imagePath);
        if (imageBlob) {
          const imageUrl = URL.createObjectURL(imageBlob);
          this.imageUrl.set(imageUrl);
        }
      }
    } catch (error) {
      console.error('Erro ao transformar dados do currículo:', error);
      this.feedback.set(null);
      this.resumeUrl.set('');
      this.imageUrl.set('');
    }
  }

}
