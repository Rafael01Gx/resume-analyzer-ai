import {Component, computed, input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-accordion-content',
  imports: [CommonModule],
  template: `
    <div [class]="contentClasses()">
      <div class="px-4 py-3">
        <ng-content />
      </div>
    </div>
  `
})
export class AccordionContentComponent {
  itemId = input.required<string>();
  className = input('');

  private isActive = computed(() =>
    (globalThis as any).accordionState?.isItemActive(this.itemId()) || false
  );

  contentClasses = computed(() => `
    overflow-hidden transition-all duration-300 ease-in-out
    ${this.isActive() ? 'max-h-fit opacity-100' : 'max-h-0 opacity-0'}
    ${this.className()}
  `);
}
