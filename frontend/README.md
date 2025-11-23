# Frontend - Login con arquitectura hexagonal (React + TypeScript + Tailwind)

Este módulo implementa el flujo de inicio de sesión del cliente aplicando principios de arquitectura hexagonal y una UI en React.

- **Dominio**: entidades (`Credentials`, `Session`) y errores (`ValidationError`, `AuthenticationError`).
- **Aplicación**: caso de uso (`LoginUseCase`) y puertos (`AuthRepository`, `TokenStore`).
- **Infraestructura**: adaptadores para autenticación HTTP (`AuthApiRepository`) y persistencia en `localStorage` (`LocalStorageTokenStore`).
- **Presentación**: componente React (`LoginPage`) estilizado con Tailwind que orquesta el formulario solo mediante el caso de uso.

## Ejecutar el frontend

```bash
cd frontend
npm install
npm run dev # levanta Vite en http://localhost:5173
```

## Configurar adaptadores

- Ajusta el endpoint del login en `src/infrastructure/authApiRepository.ts` o en la instancia del adaptador creada en `src/main.tsx`.
- El formulario no depende de infraestructura; puedes reemplazar `AuthApiRepository` o `LocalStorageTokenStore` sin tocar el componente.

## Validaciones y UX

- Campos obligatorios y contraseña con longitud mínima de 8 caracteres.
- Mensajes de error por campo (`ValidationError`) y genéricos de autenticación (`AuthenticationError`).
- Manejo de estado de carga y feedback de éxito/error.
