import {Component, computed, input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-score-bdg',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="badgeClasses()">
      <img
        [src]="iconSrc()"
        alt="score"
        class="size-4"
      />
      <p [class]="textClasses()">
        {{ score() }}/100
      </p>
    </div>
  `
})
export class ScoreBDGComponent {
  score = input.required<number>();

  badgeClasses = computed(() => {
    const baseClasses = 'flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]';
    const score = this.score();

    if (score > 69) return `${baseClasses} bg-badge-green`;
    if (score > 39) return `${baseClasses} bg-badge-yellow`;
    return `${baseClasses} bg-badge-red`;
  });

  textClasses = computed(() => {
    const baseClasses = 'text-sm font-medium';
    const score = this.score();

    if (score > 69) return `${baseClasses} text-badge-green-text`;
    if (score > 39) return `${baseClasses} text-badge-yellow-text`;
    return `${baseClasses} text-badge-red-text`;
  });

  iconSrc = computed(() =>
    this.score() > 69 ? '/icons/check.svg' : '/icons/warning.svg'
  );
}
