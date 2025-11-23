import { FormEvent, useMemo, useState } from 'react';
import { LoginUseCase } from '../application/use-cases/login.ts';
import { AuthenticationError, ValidationError } from '../domain/errors.ts';

interface LoginPageProps {
  loginUseCase: LoginUseCase;
}

interface FieldErrors {
  username?: string;
  password?: string;
}

export function LoginPage({ loginUseCase }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const isLoading = status === 'loading';

  const canSubmit = useMemo(() => username.trim().length > 0 && password.length > 0, [username, password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});
    setMessage(null);
    setStatus('loading');

    try {
      await loginUseCase.execute({ username, password });
      setStatus('success');
      setMessage('Inicio de sesión exitoso');
      setPassword('');
    } catch (error) {
      if (error instanceof ValidationError) {
        setFieldErrors({ [error.field]: error.message });
        setStatus('error');
        return;
      }

      const readableMessage =
        error instanceof AuthenticationError
          ? error.message
          : 'Error inesperado al iniciar sesión. Inténtalo más tarde.';

      setMessage(readableMessage);
      setStatus('error');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-wide text-slate-500">Arquitectura hexagonal</p>
          <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
          <p className="mt-2 text-sm text-slate-600">Frontend desacoplado de la API y el almacenamiento.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700" htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              name="username"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-400 focus:ring focus:ring-indigo-100"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={isLoading}
              required
            />
            {fieldErrors.username ? (
              <p className="text-sm text-red-600" data-error="username">
                {fieldErrors.username}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-400 focus:ring focus:ring-indigo-100"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
              required
            />
            {fieldErrors.password ? (
              <p className="text-sm text-red-600" data-error="password">
                {fieldErrors.password}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-indigo-300"
            disabled={!canSubmit || isLoading}
          >
            {isLoading ? 'Validando...' : 'Iniciar sesión'}
          </button>

          {message ? (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                status === 'success'
                  ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                  : 'bg-red-50 text-red-800 ring-1 ring-red-200'
              }`}
            >
              {message}
            </div>
          ) : null}
        </form>

        <p className="mt-6 text-xs text-slate-500">
          La UI solo conoce el caso de uso. Puedes cambiar el adaptador de API o el almacén de tokens sin tocar este
          formulario.
        </p>
      </div>
    </main>
  );
}
