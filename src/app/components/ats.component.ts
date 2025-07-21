import {Component, computed, input} from '@angular/core';

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSConfig {
  gradientClass: string;
  iconSrc: string;
  subtitle: string;
}

@Component({
  selector: 'app-ats',
  imports: [],
  template: `
    <div [class]="'bg-gradient-to-b ' + atsConfig().gradientClass + ' to-white rounded-2xl shadow-md w-full p-6'">

      <div class="flex items-center gap-4 mb-6">
        <img [src]="atsConfig().iconSrc" alt="ATS Score Icon" class="w-12 h-12" />
        <div>
          <h2 class="text-2xl font-bold">ATS Score - {{ score() }}/100</h2>
        </div>
      </div>

      <!-- Description section -->
      <div class="mb-6">
        <h3 class="text-xl font-semibold mb-2">{{ atsConfig().subtitle }}</h3>
        <p class="text-gray-600 mb-4">
          Essa pontuação representa o desempenho provável do seu currículo nos Sistemas de Rastreamento de Candidatos usados pelos empregadores.
        </p>

        <!-- Suggestions list -->
        <div class="space-y-3">
          @for (suggestion of suggestions(); track $index) {
            <div class="flex items-start gap-3">
              <img
                [src]="suggestion.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'"
                [alt]="suggestion.type === 'good' ? 'Check' : 'Warning'"
                class="w-5 h-5 mt-1"
              />
              <p [class]="suggestion.type === 'good' ? 'text-green-700' : 'text-amber-700'">
                {{ suggestion.tip }}
              </p>
            </div>
          }
        </div>
      </div>
      <p class="text-gray-700 italic">
        Continue refinando seu currículo para aumentar suas chances de passar pelos filtros do ATS e chegar às mãos dos recrutadores.
      </p>
    </div>
  `
})
export class AtsComponent {
  score = input<number>(0)
  suggestions = input<Suggestion[]>([])

  atsConfig = computed((): ATSConfig => {
    const scoreValue = this.score();

    if (scoreValue > 69) {
      return {
        gradientClass: 'from-green-100',
        iconSrc: '/icons/ats-good.svg',
        subtitle: 'Ótimo trabalho!'
      };
    }

    if (scoreValue > 49) {
      return {
        gradientClass: 'from-yellow-100',
        iconSrc: '/icons/ats-warning.svg',
        subtitle: 'Bom começo'
      };
    }

    return {
      gradientClass: 'from-red-100',
      iconSrc: '/icons/ats-bad.svg',
      subtitle: 'Precisa de melhorias'
    };
  });
}
