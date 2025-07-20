import {Component, inject, OnInit} from '@angular/core';
import {PuterService} from '../services/puter.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  template: `
    <main class="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
        <div class="gradient-border shadow-lg">
            <section class="flex flex-col gap-8 bg-white rounded-2xl p-10">
              <div class="flex flex-col items-center gap-2 text-center">
                <h1>Bem vindo!</h1>
                <h2>Faça login para continuar ... </h2>
              </div>
                @if(isLoading()){
                  <button class="auth-button animate-pulse">
                    <p>Entrando ...</p>
                  </button>
                } @else if (isAuthenticated()) {
                    <button class="auth-button animate-pulse" (click)="signOut()"><p>Sair</p></button>
                } @else {
                   <button class="auth-button animate-pulse" (click)="signIn()" ><p>Entrar</p></button>
                }

            </section>
        </div>
    </main>
  `
})
export class LoginComponent implements OnInit{
  #puterService = inject(PuterService);
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #returnUrl: string | null = null;
  isAuthenticated = this.#puterService.isAuthenticated;

  isLoading = this.#puterService.isLoading;
  authState = this.#puterService.authState;

  async signIn () {
    return this.#puterService.signIn().then(()=>
    this.#router.navigateByUrl(this.#returnUrl || '/'));
  }
  async signOut () {
    return this.#puterService.signOut()
  }

  ngOnInit(): void {
    this.#activatedRoute.queryParams.subscribe(params => {
      this.#returnUrl = params['returnUrl'] || null;
    })}
}
