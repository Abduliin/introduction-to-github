import { AuthRepository } from '../application/ports/authRepository.ts';
import { Credentials, Session } from '../domain/entities.ts';
import { AuthenticationError } from '../domain/errors.ts';

interface ApiResponse {
  token: string;
  user: {
    username: string;
  };
  expiresAt?: string;
}

export class AuthApiRepository implements AuthRepository {
  constructor(private readonly endpoint: string) {}

  async login(credentials: Credentials): Promise<Session> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new AuthenticationError('Credenciales inválidas o servicio no disponible');
    }

    const payload = (await response.json()) as ApiResponse;

    if (!payload.token || !payload.user?.username) {
      throw new AuthenticationError('Respuesta inválida del servicio de autenticación');
    }

    return {
      token: payload.token,
      user: payload.user,
      expiresAt: payload.expiresAt,
    };
  }
}
