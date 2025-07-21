import {Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Tip} from './details.component';

@Component({
  selector: 'app-category-content',
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-4 items-center w-full">

      <div class="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4">
        @for (tip of tips(); track tip.tip) {
          <div class="flex flex-row gap-2 items-center">
            <img
              [src]="tip.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'"
              alt="score"
              class="size-5"
            />
            <p class="text-xl text-gray-500">{{ tip.tip }}</p>
          </div>
        }
      </div>

      <div class="flex flex-col gap-4 w-full">
        @for (tip of tips(); track tip.tip + tip.explanation) {
          <div [class]="getTipClasses(tip.type)">
            <div class="flex flex-row gap-2 items-center">
              <img
                [src]="tip.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'"
                alt="score"
                class="size-5"
              />
              <p class="text-xl font-semibold">{{ tip.tip }}</p>
            </div>
            <p>{{ tip.explanation }}</p>
          </div>
        }
      </div>
    </div>
  `
})
export class CategoryContentComponent {
  tips = input.required<Tip[]>();

  getTipClasses(type: 'good' | 'improve'): string {
    const baseClasses = 'flex flex-col gap-2 rounded-2xl p-4';

    return type === 'good'
      ? `${baseClasses} bg-green-50 border border-green-200 text-green-700`
      : `${baseClasses} bg-yellow-50 border border-yellow-200 text-yellow-700`;
  }
}
