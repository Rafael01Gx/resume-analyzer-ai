import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-score-badge',
  imports: [],
  template: `
    <div [class]="'px-3 py-1 rounded-full ' + badgeConfig().color">
      <p class="text-sm font-medium">{{ badgeConfig().text }}</p>
    </div>
  `
})
export class ScoreBadgeComponent {
  score = input<number>(0);

  private readonly badgeThresholds = [
    { min: 71, color: 'bg-badge-green text-green-600', text: 'Forte' },
    { min: 50, color: 'bg-badge-yellow text-yellow-600', text: 'Bom começo' },
    { min: 0, color: 'bg-badge-red text-red-600', text: 'Precisa de ajustes' }
  ];

  badgeConfig = computed(() =>
    this.badgeThresholds.find(threshold => this.score() >= threshold.min)!
  );
}
