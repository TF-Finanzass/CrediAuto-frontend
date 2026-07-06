# Finanzas Frontend

Aplicación web del simulador de crédito vehicular Compra Inteligente.

Repositorio: https://github.com/FInanzas-Grupo/finanzas-frontend

## Stack

- Angular 21
- Angular Material / CDK
- ngx-translate (i18n)
- RxJS
- TypeScript 5.9
- Vitest (testing)

## Requisitos

- Node.js 18+

## Variables de entorno

Copiar `.env.example` a `.env` y configurar:

| Variable       | Descripción                                              |
|----------------|-----------------------------------------------------------|
| VITE_API_URL   | URL base de la API (default: http://localhost:3000/api)   |

## Instalación

```bash
npm install
npm start       # Desarrollo (ng serve)
npm run build   # Build producción (ng build)
npm run watch   # Build en modo watch (desarrollo)
npm test        # Tests (vitest)
```

## Deploy en Vercel

El proyecto se despliega como sitio estático en Vercel. Conectar el repositorio desde el dashboard de Vercel e importar el proyecto.

Configurar la variable de entorno `VITE_API_URL` apuntando a la URL del backend desplegado en Render.
