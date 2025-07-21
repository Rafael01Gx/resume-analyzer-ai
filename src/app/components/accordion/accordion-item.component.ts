import {Component, computed, input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-accordion-item',
  imports: [CommonModule],
  template: `
    <div [class]="itemClasses()">
      <ng-content />
    </div>
  `
})
export class AccordionItemComponent {
  id = input.required<string>();
  className = input('');

  itemClasses = computed(() =>
    `overflow-hidden border my-4 rounded-xl border-gray-300 ${this.className()}`
  );
}
