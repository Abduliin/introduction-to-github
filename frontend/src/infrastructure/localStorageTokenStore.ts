import { TokenStore } from '../application/ports/tokenStore.ts';
import { Session } from '../domain/entities.ts';

const STORAGE_KEY = 'hexagonal-login-session';

export class LocalStorageTokenStore implements TokenStore {
  save(session: Session): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  get(): Session | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as Session;
    } catch (error) {
      console.warn('No se pudo leer la sesión almacenada', error);
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
