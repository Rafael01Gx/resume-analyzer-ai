import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-score-gauge',
  imports: [],
  template: `
    <div class="flex flex-col items-center">
      <div class="relative w-40 h-20">
        <svg viewBox="0 0 100 50" class="w-full h-full">
          <defs>
            <linearGradient
              id="gaugeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stop-color="#a78bfa" />
              <stop offset="100%" stop-color="#fca5a5" />
            </linearGradient>
          </defs>
          <!-- Background arc -->
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="10"
            stroke-linecap="round"
          />
          <!-- Foreground arc with rounded ends -->
          <path
            #pathRef
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="url(#gaugeGradient)"
            stroke-width="10"
            stroke-linecap="round"
            [attr.stroke-dasharray]="pathLength()"
            [attr.stroke-dashoffset]="pathLength() * (1 - percentage())"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div class="text-xl font-semibold pt-4">{{ score() }}/100</div>
        </div>
      </div>
    </div>
  `
})
export class ScoreGaugeComponent implements AfterViewInit{
 score= input<number>(0);
  @ViewChild('pathRef', { static: false }) pathRef!: ElementRef<SVGPathElement>;

  pathLength= signal(0);
  percentage= computed(()=>{
      return this.score() / 100;
  })

  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.pathRef?.nativeElement) {
        this.pathLength.set(this.pathRef.nativeElement.getTotalLength());
        this.cdr.detectChanges();
      }
    }, 0);
  }
}
