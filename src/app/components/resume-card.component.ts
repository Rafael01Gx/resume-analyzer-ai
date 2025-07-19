import {Component, input} from '@angular/core';
import {ScoreCircleComponent} from './score-circle.component';

@Component({
  selector: 'app-resume-card',
  imports: [ScoreCircleComponent],
  template: `
<a [href]="'/resume/'+resume()?.id" class="resume-card animate-in fade-in duration-1000">
  <div class="resume-card-header">
    <div class="flex flex-col gap-2">
      <h2 class="text-black font-bold break-words">{{resume()?.companyName}}</h2>
      <h3 class="text-lg text-gray-500">{{resume()?.jobTitle}}</h3>
    </div>
    <div class="flex-shrink-0">
      <app-score-circle [score]="resume()?.feedback?.overallScore" />
    </div>
  </div>
  <div class="gradient-border animate-in fade-in duration-1000">
    <div class="size-full">
      <img [src]="resume()?.imagePath" alt="resume" class="w-full h-[350px] max-sm:h-[200px] object-cover object-top" />
    </div>
  </div>
</a>
  `
})
export class ResumeCardComponent {
  key = input<number>()
  resume = input<Resume>()
}
