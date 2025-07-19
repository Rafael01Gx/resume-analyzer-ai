import {Component, computed, input} from '@angular/core';

@Component({
  selector: 'app-score-circle',
  imports: [],
  template: `
    <div class="relative w-[100px] h-[100px]">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        class="transform -rotate-90"
      >
        <circle
          cx="50"
          cy="50"
          [attr.r]="normalizedRadius()"
          stroke="#e5e7eb"
          [attr.stroke-width]="stroke"
          fill="transparent"
        />
        <defs>
          <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FF97AD" />
            <stop offset="100%" stop-color="#5171FF" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          [attr.r]="normalizedRadius()"
          stroke="url(#grad)"
          [attr.stroke-width]="stroke"
          fill="transparent"
          [attr.stroke-dasharray]="circumference()"
          [attr.stroke-dashoffset]="strokeDashoffset()"
          stroke-linecap="round"
        />
      </svg>

      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="font-semibold text-sm">{{ score() }}/100</span>
      </div>
    </div>
  `
})
export class ScoreCircleComponent {
score = input<number| undefined>(0);

readonly radius = 40;
readonly stroke = 8;

readonly normalizedRadius = computed(() => this.radius - this.stroke / 2);
readonly circumference = computed(() => 2 * Math.PI * this.normalizedRadius());
readonly progress = computed(() => this.score()! / 100); // Usa this.score()
readonly strokeDashoffset = computed(() => this.circumference() * (1 - this.progress()));
}
