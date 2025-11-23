import { Session } from '../../domain/entities.ts';

export interface TokenStore {
  save(session: Session): void;
  get(): Session | null;
  clear(): void;
}
