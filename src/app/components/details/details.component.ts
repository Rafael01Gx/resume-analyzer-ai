
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CategoryHeaderComponent} from './category-header.component';
import {CategoryContentComponent} from './category-content.component';
import {
  AccordionComponent,
  AccordionContentComponent,
  AccordionHeaderComponent,
  AccordionItemComponent
} from '../accordion';

export interface Tip {
  type: 'good' | 'improve';
  tip: string;
  explanation: string;
}

export interface Category {
  score: number;
  tips: Tip[];
}

@Component({
  selector: 'app-details',
  imports: [
    CommonModule,
    AccordionComponent,
    AccordionItemComponent,
    AccordionHeaderComponent,
    AccordionContentComponent,
    CategoryHeaderComponent,
    CategoryContentComponent
  ],
  template: `
    <div class="flex flex-col gap-4 w-full">
      <app-accordion>
        <!-- Tone & Style -->
        <app-accordion-item id="tone-style">
          <app-accordion-header itemId="tone-style">
            <app-category-header
              title="Tom & Estilo"
              itemId="tone-style"
              [categoryScore]="feedback()!.toneAndStyle.score"
            />
          </app-accordion-header>
          <app-accordion-content itemId="tone-style">
            <app-category-content [tips]="feedback()!.toneAndStyle.tips" />
          </app-accordion-content>
        </app-accordion-item>

        <!-- Content -->
        <app-accordion-item id="content">
          <app-accordion-header itemId="content">
            <app-category-header
              itemId="content"
              title="Conteúdo"
              [categoryScore]="feedback()!.content.score"
            />
          </app-accordion-header>
          <app-accordion-content itemId="content">
            <app-category-content [tips]="feedback()!.content.tips" />
          </app-accordion-content>
        </app-accordion-item>

        <!-- Structure -->
        <app-accordion-item id="structure">
          <app-accordion-header itemId="structure">
            <app-category-header
              itemId="structure"
              title="Estrutura"
              [categoryScore]="feedback()!.structure.score"
            />
          </app-accordion-header>
          <app-accordion-content itemId="structure">
            <app-category-content [tips]="feedback()!.structure.tips" />
          </app-accordion-content>
        </app-accordion-item>

        <!-- Skills -->
        <app-accordion-item id="skills">
          <app-accordion-header itemId="skills">
            <app-category-header
              itemId="skills"
              title="Hablidades"
              [categoryScore]="feedback()!.skills.score"
            />
          </app-accordion-header>
          <app-accordion-content itemId="skills">
            <app-category-content [tips]="feedback()!.skills.tips" />
          </app-accordion-content>
        </app-accordion-item>
      </app-accordion>
    </div>
  `
})
export class DetailsComponent {
  feedback = input<Feedback>();
}
