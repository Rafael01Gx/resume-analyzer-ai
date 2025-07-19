import {Component, inject} from '@angular/core';
import {NavbarComponent} from '../components/navbar.component';
import {resumes} from '../../constants';
import {ResumeCardComponent} from '../components/resume-card.component';
import {PuterService} from '../services/puter.service';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent,ResumeCardComponent],
  template: `
<main class="bg-[url('/images/bg-main.svg')] bg-cover">

  <app-navbar />

  <section class="main-section">
    <div class="page-heading py-16">
      <h1>Acompanhe Suas Inscrições & Avaliações de Currículos</h1>
      <h2>
        Revise seus envios e verifique o feedback com tecnologia de IA</h2>
    </div>


  @if(resumes.length > 0){ <div class="resumes-section">
    @for(resume of resumes; track resume.id; let i = $index){
      <app-resume-card [key]="i" [resume]="resume"/>
    }
  </div>}

  </section>

</main>
  `
})
export class HomeComponent {
  #puterService = inject(PuterService);
  #returnUrl: string | null = null;
  isAuthenticated = this.#puterService.isAuthenticated;

  resumes = resumes

}

