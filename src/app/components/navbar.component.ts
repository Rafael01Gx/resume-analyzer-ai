import {ChangeDetectorRef, Component, computed, effect, inject, input, signal} from '@angular/core';
import {PuterService} from '../services/puter.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  template: `

      <nav class="navbar">
        <div class="flex w-full justify-between items-center h-16">
          <div class="flex-shrink-0">
            <a href="/">
              <p class="text-2xl font-bold text-gradient">Currículos</p>
            </a>
          </div>


          <div class="flex items-center space-x-4">


            @if(btnText() == 'Sair') {
              <a href="/upload"
                 class="inline-flex items-center px-4 py-2 text-white primary-gradient font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 group">
                <svg class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                Enviar Currículo
              </a>
            }

            <!-- Login Button (quando não logado) -->
            @if(btnText() == 'Entrar') {
              <button (click)="signIn()"
                      class="inline-flex items-center px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                {{ btnText() }}
              </button>
            }

            <!-- User Menu (quando logado) -->
            @if(btnText() == 'Sair') {
              <div class="flex items-center space-x-1">
                <!-- Files Link -->
                <a href="/wipe" [hidden]="!showDropdown()"
                   class="inline-flex animate-in fade-in slide-in-from-right-2 duration-200 items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200 group">
                  <svg class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h2a2 2 0 012 2v0H8v0z"/>
                  </svg>
                  Arquivos
                </a>

                <!-- Logout Button -->
                <button [hidden]="!showDropdown()" (click)="signOut()"
                        class="inline-flex animate-in fade-in slide-in-from-right-2 duration-200 items-center px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200 group">
                  <svg class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Sair
                </button>

                <!-- Menu Dropdown Trigger -->
                <div  class="relative">
                  <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
                          (click)="toggleDropdown()">
                    <svg class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                    </svg>
                  </button>

                </div>
              </div>
            }
          </div>
        </div>
      </nav>


  `,
})
export class NavbarComponent {
  #puterService = inject(PuterService);
  #router = inject(Router);
  btnText = input<string>("");
  showDropdown = signal(false);

  signIn() {
    return this.#puterService.signIn();
  }

  signOut() {
    this.closeDropdown();
    return this.#puterService.signOut().then(() => this.#router.navigateByUrl('/'));
  }

  toggleDropdown() {
    this.showDropdown.update(show => !show);
  }

  closeDropdown() {
    this.showDropdown.set(false);
  }
}
