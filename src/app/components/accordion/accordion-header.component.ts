import {Component, computed, input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-accordion-header',
  imports: [CommonModule],
  template: `
    <button
      (click)="handleClick()"
      [class]="buttonClasses()"
    >
      <div class="flex items-center w-full space-x-3">
        @if (iconPosition() === 'left') {
          <div [innerHTML]="displayIcon()"></div>
        }
        <div class="flex-1">
          <ng-content />
        </div>
      </div>
      @if (iconPosition() === 'right') {
        <div [innerHTML]="displayIcon()"></div>
      }
    </button>
  `
})
export class AccordionHeaderComponent {
  itemId = input.required<string>();
  className = input('');
  icon = input<string>();
  iconPosition = input<'left' | 'right'>('right');

  #isActive = computed(() =>
    (globalThis as any).accordionState?.isItemActive(this.itemId()) || false
  );

  buttonClasses = computed(() => `
    w-full px-4 py-3 text-left
    focus:outline-none
    transition-colors duration-200 flex items-center justify-between cursor-pointer
    ${this.className()}
  `);

  displayIcon = computed(() => {
    if (this.icon()) {
      return this.icon();
    }

    return `
      <svg
        class="w-5 h-5 transition-transform duration-200 ${this.#isActive() ? 'rotate-180' : ''}"
        fill="none"
        stroke="#98A2B3"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    `;
  });

  handleClick() {
    (globalThis as any).accordionState?.toggleItem(this.itemId());
  }
}
