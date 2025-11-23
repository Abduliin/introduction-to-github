import { Credentials, Session } from '../../domain/entities.ts';

export interface AuthRepository {
  login(credentials: Credentials): Promise<Session>;
}
