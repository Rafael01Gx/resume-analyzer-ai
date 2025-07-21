import {Component, input} from '@angular/core';
import {ScoreGaugeComponent} from './score-gauge.component';
import {CategoryComponent} from './category.component';

@Component({
  selector: 'app-summary',
  imports: [
    ScoreGaugeComponent,CategoryComponent
  ],
  template: `
    <div class="bg-white rounded-2xl shadow-md w-full">
      <div class="flex flex-row items-center p-4 gap-8">
        <app-score-gauge [score]="feedBack()?.overallScore || 0"/>
        <div class="flex flex-col gap-2">
          <h2 class="text-2xl font-bold">Sua pontuação de currículo</h2>
          <p class="text-sm text-gray-500">
            Esta pontuação é calculada com base nas variáveis listadas abaixo.
          </p>
        </div>
        </div>

      <app-category title="Tom e estilo" [score]="feedBack()?.toneAndStyle?.score || 0" />
      <app-category title="Conteúdo" [score]="feedBack()?.content?.score || 0" />
      <app-category title="Estrutura" [score]="feedBack()?.structure?.score || 0" />
      <app-category title="Skills" [score]="feedBack()?.skills?.score || 0" />
      </div>
  `
})
export class SummaryComponent {
  feedBack = input<Feedback>()
}
