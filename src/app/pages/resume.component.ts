import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PuterService} from '../services/puter.service';
import {SummaryComponent} from '../components/summary.component';
import {AtsComponent} from '../components/ats.component';
import {DetailsComponent} from '../components/details/details.component';

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
                <img [src]="imageUrl()" class="w-full h-full object-contain rounded-2xl" alt="resume" title="curriculo"/>
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

                <app-details [feedback]="feedback()!"  />

            </div>
          } @else {
            <img src="/images/resume-scan-2.gif" class="w-full" alt="scan"/>
          }

        </section>
      </div>

    </main>
  `
})
export class ResumeComponent implements OnInit{
  #activatedRoute = inject(ActivatedRoute);
  #puterService = inject(PuterService);
  resumeId= signal<string|null>(null);
  imageUrl = signal<string>('');
  resumeUrl = signal<string>('');
  feedback = signal<Feedback|null>(null);

constructor() {
  effect(() => {
    if(this.resumeId()){
      this.getResume(this.resumeId()!).catch(()=> console.log('Erro ao obter detalhes do currículo.'))
    }
  });
}

  ngOnInit() {
    this.resumeId.set(this.#activatedRoute.snapshot.params['id']);
    this.getResume(this.resumeId()!)
  }

  async getResume(id:string){
    const resume = await this.#puterService.getKV(`resume:${id}`)
    if(!resume) return;

    const data = JSON.parse(resume)
    const resumeBlob = await this.#puterService.readFile(data.resumePath)
    if(!resumeBlob) return;
    const pdfBlob = new Blob([resumeBlob], {type: 'application/pdf'});
    const resumeUrl = URL.createObjectURL(pdfBlob);
    this.resumeUrl.set(resumeUrl);

    const imageBlob = await this.#puterService.readFile(data.imagePath)
    if(!imageBlob) return;
    const imageUrl = URL.createObjectURL(imageBlob);
    this.imageUrl.set(imageUrl);
    this.feedback.set(data.feedback);
  }
}
