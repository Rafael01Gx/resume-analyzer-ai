import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()">
      <ng-content />
    </div>
  `,
  providers: [{
    provide: 'accordionService',
    useFactory: () => ({
      activeItems: signal<string[]>([]),
      allowMultiple: signal(false),
      toggleItem: (id: string) => {},
      isItemActive: (id: string) => false
    })
  }]
})
export class AccordionComponent {
  defaultOpen = input<string>();
  allowMultiple = input(false);
  className = input('');

  private activeItems = signal<string[]>([]);

  containerClasses = computed(() => `space-y-2 ${this.className()}`);

  constructor() {
    const defaultOpenValue = this.defaultOpen();
    if (defaultOpenValue) {
      this.activeItems.set([defaultOpenValue]);
    }

    (globalThis as any).accordionState = {
      activeItems: this.activeItems,
      allowMultiple: this.allowMultiple,
      toggleItem: this.toggleItem.bind(this),
      isItemActive: this.isItemActive.bind(this)
    };
  }

  private toggleItem(id: string) {
    this.activeItems.update(prev => {
      if (this.allowMultiple()) {
        return prev.includes(id)
          ? prev.filter(item => item !== id)
          : [...prev, id];
      } else {
        return prev.includes(id) ? [] : [id];
      }
    });
  }

  private isItemActive(id: string): boolean {
    return this.activeItems().includes(id);
  }
}

