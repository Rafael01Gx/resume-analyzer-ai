import { Component, effect, inject, input, signal} from '@angular/core';
import {ScoreCircleComponent} from './score-circle.component';
import {PuterService} from '../services/puter.service';

@Component({
  selector: 'app-resume-card',
  imports: [ScoreCircleComponent],
  template: `
    @if (isMock() || resume()?.feedback) {
      <a [href]="'/resume/'+resume()?.id" class="resume-card animate-in fade-in duration-1000"
         [class.pointer-events-none]="isMock()">
        <div class="resume-card-header">
          <div class="flex flex-col gap-2">
            @if (resume()?.companyName) {
              <h2 class="text-black font-bold break-words">{{ resume()?.companyName }}</h2>
            }
            @if (resume()?.jobTitle) {
              <h3 class="text-lg text-gray-500">{{ resume()?.jobTitle }}</h3>
            }
            @if (!resume()?.companyName && !resume()?.jobTitle) {
              <h2 class="text-black font-bold">Currículo</h2>
            }
          </div>
          <div class="flex-shrink-0">
            <app-score-circle [score]="resume()?.feedback?.overallScore"/>
          </div>
        </div>
        @if (resumeUrl()) {
          <div class="gradient-border animate-in fade-in duration-1000">
            <div class="size-full">
              <img async [src]="resumeUrl()" alt="resume"
                   class="w-full h-[350px] max-sm:h-[200px] object-cover object-top"/>
            </div>
          </div>
        }
      </a>
    }
  `
})
export class ResumeCardComponent {
  isMock = input<boolean>(false)
  key = input<number>()
  resume = input<Resume>()
  #puterService = inject(PuterService);
  #authState = this.#puterService.authState();
  resumeUrl = signal<string>('');

  constructor() {
    effect(() => {
      if(this.resume()){
        this.loadResume();
      }
    });
  }

  async loadResume(){
    if(this.isMock()) return this.resumeUrl.set(this.resume()?.imagePath!)
    const blob = await this.#puterService.readFile(this.resume()?.imagePath!)
    if(!blob) return;
    let url = URL.createObjectURL(blob);
    this.resumeUrl.set(url);
  }

}
