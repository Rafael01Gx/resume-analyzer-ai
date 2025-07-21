import {Component, computed, input} from '@angular/core';
import {ScoreBadgeComponent} from './score-badge.component';

@Component({
  selector: 'app-category',
  imports: [ScoreBadgeComponent],
  template: `
    <div class="resume-summary">
      <div class="category">
        <div class="flex flex-row gap-2 items-center justify-center">
          <p class="text-2xl">{{ title() }}</p>
          <app-score-badge [score]="score()" />
        </div>
        <p class="text-2xl">
          <span class={textColor}>{{ score() }}</span>/100
        </p>
      </div>
    </div>
  `
})
export class CategoryComponent {
  title = input<string>()
  score = input<number>(0)

  textColor = computed(() => this.score() > 70 ? 'text-green-500' : 'text-red-500')
}
