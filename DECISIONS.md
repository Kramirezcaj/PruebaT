# Decisiones técnicas

## Enfoque general

La estructura es: backend en NestJS que procesa el JSON y expone el endpoint, frontend en React que lo consume y renderiza. Los separé en dos carpetas (`backend/` y `frontend/`) cada una con su propio `package.json`, principalmente porque así es más fácil de levantar por partes mientras desarrollaba y lo veo más ordenado.

## Backend

Para leer el mock usé `fs.readFileSync` directo en cada request.

El cálculo del hype fue con la fórmula `(likes + comentarios) / vistas`, pero hay tres casos que tuve que manejar:

- Si `commentCount` no existe en `statistics` (no es que valga `"0"`, sino que directamente no está), el hype es 0. Asumí que eso significa comentarios desactivados.
- Si el título tiene "tutorial" en cualquier combinación de mayúsculas, el hype se duplica. Lo resolví con una regex `/tutorial/i`, que es lo más limpio para ese caso.
- Si las vistas son 0, el hype queda en 0 también para no dividir entre cero y explotar.

El resultado lo redondeo a 4 decimales.

La fecha la calculé con la diferencia en milisegundos contra `Date.now()` y fui comparando contra cada unidad (minutos, horas, días, meses, años) de mayor a menor.

El orden lo resuelvo en el backend: la Joya de la Corona va primero, el resto ordenado de mayor a menor hype. Así el frontend recibe el array listo y no tiene que hacer nada extra.

CORS lo habilité solo para `http://localhost:3001` que es donde corre React en dev.

## Frontend

Usé TypeScript en todo. Para el estado, `useState` + `useEffect` fueron suficientes — consideré si valía meterle algún state manager pero para un solo fetch y renderizar datos sería matar una mosca con un cañón.

La Joya de la Corona tiene su propio componente y sección separada visualmente del grid. El resto de videos los organicé en secciones (Top Trending, Rising, el resto) porque me pareció más interesante que una grilla plana.

Los estados de carga y error los manejo con un spinner CSS y un mensaje con el código de error respectivamente. Las animaciones de entrada las hice con `IntersectionObserver` para que los elementos aparezcan al hacer scroll.

## Organización
backend/src/
videos/
videos.controller.ts   → Ruta GET /api/videos
videos.service.ts      → Lógica de hype, fechas y ordenamiento
videos.module.ts       → Módulo NestJS
app.module.ts
main.ts                  → Bootstrap y CORS
mock-youtube-api.json
frontend/src/
App.tsx                  → Fetch, estados y render principal
App.css                  → Estilos

## Supuestos

- El mock es el dataset completo, no hay paginación.
- Comentarios desactivados = `commentCount` no existe en `statistics`, no que valga `"0"`.
- Si hay empate en hype gana el primero en el array.
- Las fechas relativas se calculan contra el momento actual, así que van a cambiar con el tiempo.
- Sin caché ni base de datos, el JSON se lee en cada request.
