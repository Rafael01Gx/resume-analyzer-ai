import {Component, input} from '@angular/core';

@Component({
  selector: 'app-summary',
  imports: [],
  template: ``
})
export class SummaryComponent {
  feedBack = input<Feedback>()
}
