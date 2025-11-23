import React from 'react';
import ReactDOM from 'react-dom/client';
import { LoginUseCase } from './application/use-cases/login.ts';
import { AuthApiRepository } from './infrastructure/authApiRepository.ts';
import { LocalStorageTokenStore } from './infrastructure/localStorageTokenStore.ts';
import { LoginPage } from './presentation/LoginPage.tsx';
import './index.css';

const authRepository = new AuthApiRepository('/api/login');
const tokenStore = new LocalStorageTokenStore();
const loginUseCase = new LoginUseCase(authRepository, tokenStore);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoginPage loginUseCase={loginUseCase} />
  </React.StrictMode>,
);
