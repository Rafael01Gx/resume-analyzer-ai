import {Component, computed, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScoreBDGComponent} from './score-bdg.component';

@Component({
  selector: 'app-category-header',
  imports: [CommonModule, ScoreBDGComponent],
  template: `
    <div class="flex flex-row gap-4 items-center w-full py-2">
      <p class="text-2xl font-semibold">{{ title() }}</p>
      <app-score-bdg [score]="categoryScore()" />
      <svg
        [class]="arrowClasses()"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </div>

  `
})
export class CategoryHeaderComponent {
  title = input.required<string>();
  categoryScore = input.required<number>();
  itemId = input.required<string>();
  #isExpanded = computed(() =>
    (globalThis as any).accordionState?.isItemActive(this.itemId()) || false
  );
  arrowClasses = computed(() =>
    `ml-auto transition-transform duration-300 ease-in-out !text-gray-500 ${
      this.#isExpanded() ? 'rotate-180' : 'rotate-0'
    }`
  );
}
