# Cartelera de Hype Tecnológico

Prueba técnica para SunDevs. Es una app fullstack que toma datos de un mock de la API de YouTube, les calcula un índice de hype y los muestra en una cartelera.

El backend está hecho con NestJS y el frontend con React + TypeScript.

## Estructura

```
backend/    → API en NestJS (GET /api/videos)
frontend/   → Interfaz en React + TypeScript
```

## Requisitos

- Node.js 18+
- npm 9+

## Cómo levantar

### Backend (puerto 3000)

```bash
cd backend
npm install
npm run start:dev
```

La API queda en `http://localhost:3000/api/videos`

### Frontend (puerto 3001)

```bash
cd frontend
npm install
npm start
```

Se abre en `http://localhost:3001`. El backend tiene que estar corriendo antes.

## Verificar la API

```bash
curl http://localhost:3000/api/videos
```

Devuelve un array de 50 videos con: `thumbnail`, `title`, `author`, `publishedAt`, `hypeLevel`, `isCrown`.

## Tests

```bash
cd backend
npm run test
```

Hay tests para el servicio de videos, básicamente validan que el cálculo de hype funcione bien, que el crown quede de primero y los casos donde el hype debería dar 0.
