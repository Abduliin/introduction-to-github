import { AuthRepository } from '../ports/authRepository.ts';
import { TokenStore } from '../ports/tokenStore.ts';
import { Credentials, Session } from '../../domain/entities.ts';
import { AuthenticationError, ValidationError } from '../../domain/errors.ts';

const MIN_PASSWORD_LENGTH = 8;

function assertNotEmpty(value: string, field: string) {
  if (!value || !value.trim()) {
    throw new ValidationError('Este campo es obligatorio', field);
  }
}

function assertPasswordStrength(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError(
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
      'password',
    );
  }
}

export interface LoginPayload {
  username: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenStore: TokenStore,
  ) {}

  async execute(payload: LoginPayload): Promise<Session> {
    assertNotEmpty(payload.username, 'username');
    assertNotEmpty(payload.password, 'password');
    assertPasswordStrength(payload.password);

    const credentials = new Credentials(payload.username.trim(), payload.password);

    try {
      const session = await this.authRepository.login(credentials);
      this.tokenStore.save(session);
      return session;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError('No se pudo iniciar sesión. Inténtalo de nuevo más tarde.');
    }
  }
}
