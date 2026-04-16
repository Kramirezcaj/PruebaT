# Cartelera de Hype Tecnológico

Prueba técnica para SunDevs. Una app fullstack que toma un mock de la API de YouTube, calcula un índice de hype para cada video y los muestra en una cartelera con el de mayor hype destacado como la Joya de la Corona.

Backend en NestJS, frontend en React + TypeScript.

## Estructura
backend/    → API en NestJS (GET /api/videos)
frontend/   → Interfaz en React + TypeScript

## Requisitos

- Node.js 18+
- npm 9+

## Cómo levantar

**Backend (puerto 3000)**

```bash
cd backend
npm install
npm run start:dev
```

La API queda disponible en `http://localhost:3000/api/videos`.

**Frontend (puerto 3001)**

```bash
cd frontend
npm install
npm start
```

Se abre en `http://localhost:3001`. El backend tiene que estar corriendo primero.

## Verificar que funciona

```bash
curl http://localhost:3000/api/videos
```

Devuelve un array de 50 videos, cada uno con: `thumbnail`, `title`, `author`, `publishedAt`, `hypeLevel` e `isCrown`.

## Tests

```bash
cd backend
npm run test
```

Validan el cálculo de hype, que la Joya de la Corona quede de primera en el array y los casos donde el hype debería dar 0.
