import {Component} from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  template: `
<nav class="navbar">
  <a href="/">
    <p class="text-2xl font-bold text-gradient">Currículos</p>
  </a>
  <a href="/upload">
    <p class="primary-button w-fit">Enviar Currículo</p>
  </a>
</nav>
  `
})
export class NavbarComponent {
}
