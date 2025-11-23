export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, public readonly field: string) {
    super(message);
  }
}

export class AuthenticationError extends DomainError {}
