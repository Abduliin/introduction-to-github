export class Credentials {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}
}

export interface SessionUser {
  username: string;
}

export interface Session {
  token: string;
  user: SessionUser;
  expiresAt?: string;
}
