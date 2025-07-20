import {Component, input} from '@angular/core';

interface ITips{
  type: "good" | "improve";
  tip: string;
}
@Component({
  selector: 'app-ats',
  imports: [],
  template: ``
})
export class AtsComponent {
  score = input<number>(0)
  suggestions = input<ITips[]>([])
}
