import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class PuterService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly _isLoading = signal<boolean>(true);
  private readonly _error = signal<string | null>(null);
  private readonly _puterReady = signal<boolean>(false);
  private readonly _user = signal<PuterUser | null>(null);
  private readonly _isAuthenticated = signal<boolean>(false);

  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly puterReady = this._puterReady.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  readonly authState = computed((): AuthState => ({
    user: this._user(),
    isAuthenticated: this._isAuthenticated(),
    isLoading: this._isLoading(),
    error: this._error()
  }));

  constructor() {
    this.init();
  }

  // Utilitários
  private getPuter(): typeof window.puter | null {
    return typeof window !== 'undefined' && window.puter ? window.puter : null;
  }

  private setError(message: string): void {
    this._error.set(message);
    this._isLoading.set(false);
    this._user.set(null);
    this._isAuthenticated.set(false);
  }

  private clearError(): void {
    this._error.set(null);
  }

  // Inicialização
  init(): void {
    const puter = this.getPuter();
    if (puter) {
      this._puterReady.set(true);
      this.checkAuthStatus();
      return;
    }

    const interval = setInterval(() => {
      if (this.getPuter()) {
        clearInterval(interval);
        this._puterReady.set(true);
        this.checkAuthStatus();
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!this.getPuter()) {
        this.setError('O Puter.js falhou ao carregar.');
      }
    }, 10000);

    this.destroyRef.onDestroy(() => {
      clearInterval(interval);
      clearTimeout(timeout);
    });
  }

  // Autenticação
  async checkAuthStatus(): Promise<boolean> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return false;
    }

    this._isLoading.set(true);
    this.clearError();

    try {
      const isSignedIn = await puter.auth.isSignedIn();
      if (isSignedIn) {
        const user = await puter.auth.getUser();
        this._user.set(user);
        this._isAuthenticated.set(true);
      } else {
        this._user.set(null);
        this._isAuthenticated.set(false);
      }
      this._isLoading.set(false);
      return isSignedIn;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to check auth status';
      this.setError(message);
      return false;
    }
  }

  async signIn(): Promise<void> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }

    this._isLoading.set(true);
    this.clearError();

    try {
      await puter.auth.signIn();
      await this.checkAuthStatus();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      this.setError(message);
    }
  }

  async signOut(): Promise<void> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }

    this._isLoading.set(true);
    this.clearError();

    try {
      await puter.auth.signOut();
      this._user.set(null);
      this._isAuthenticated.set(false);
      this._isLoading.set(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      this.setError(message);
    }
  }

  async refreshUser(): Promise<void> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }

    this._isLoading.set(true);
    this.clearError();

    try {
      const user = await puter.auth.getUser();
      this._user.set(user);
      this._isAuthenticated.set(true);
      this._isLoading.set(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh user';
      this.setError(message);
    }
  }

  // Arquivos

  async writeFile(path: string, data: string | File | Blob): Promise<File | undefined> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }
    return puter.fs.write(path, data);
  }

  async readFile(path: string): Promise<Blob | undefined> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }
    return puter.fs.read(path);
  }

  async readDirectory(path: string): Promise<FSItem[] | undefined> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }
    return puter.fs.readdir(path);
  }

  async uploadFiles(files: File[] | Blob[]): Promise<FSItem | undefined> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }
    return puter.fs.upload(files);
  }

  async deleteFile(path: string): Promise<void> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }
    return puter.fs.delete(path);
  }

  // IA
  async chat(
    prompt: string | ChatMessage[],
    imageURL?: string | PuterChatOptions,
    testMode?: boolean,
    options?: PuterChatOptions
  ): Promise<AIResponse | undefined> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }
    return puter.ai.chat(prompt, imageURL, testMode, options) as Promise<AIResponse | undefined>;
  }

  async provideFeedback(path: string, message: string): Promise<AIResponse | undefined> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }

    return puter.ai.chat(
      [
        {
          role: 'user',
          content: [
            {
              type: 'file',
              puter_path: path,
            },
            {
              type: 'text',
              text: message,
            },
          ],
        },
      ],
      { model: 'claude-sonnet-4' }
    ) as Promise<AIResponse | undefined>;
  }

  async imageToText(image: string | File | Blob, testMode?: boolean): Promise<string | undefined> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }
    return puter.ai.img2txt(image, testMode);
  }

  // Key-Value
  async getKV(key: string): Promise<string | null | undefined> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }
    return puter.kv.get(key);
  }

  async setKV(key: string, value: string): Promise<boolean | undefined> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }
    return puter.kv.set(key, value);
  }

  async deleteKV(key: string): Promise<boolean | undefined> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }
    return puter.kv.delete(key);
  }

  async listKV(pattern: string, returnValues: boolean = false): Promise<string[] | KVItem[] | undefined> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }
    return puter.kv.list(pattern, returnValues);
  }

  async flushKV(): Promise<boolean | undefined> {
    const puter = this.getPuter();
    if (!puter) {
      this.setError('Puter.js not available');
      return;
    }
    return puter.kv.flush();
  }

  // limpar erros
  clearErrorState(): void {
    this.clearError();
  }
}
