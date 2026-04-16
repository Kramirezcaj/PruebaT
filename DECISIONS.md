# Decisiones técnicas

## Enfoque general

Separé la solución en dos apps independientes: el backend en NestJS se encarga de leer el JSON mock, aplicar las reglas de negocio y exponer un endpoint limpio. El frontend en React consume ese endpoint y renderiza la cartelera.

Los dos proyectos viven como carpetas hermanas (`backend/` y `frontend/`), cada uno con su propio `package.json`.

## Decisiones principales

### Backend

**Lectura del JSON:** Uso `fs.readFileSync` para leer el mock en cada request. En un caso real esto sería una llamada HTTP a la API de YouTube, pero para el ejercicio leer del disco es lo más directo.

**Cálculo del hype:**
```
hypeLevel = (likes + comentarios) / vistas
```
- Si `commentCount` no existe como propiedad en `statistics`, el hype es 0 (comentarios desactivados).
- Si el título contiene "tutorial" (sin importar mayúsculas/minúsculas), el hype se multiplica por 2. Usé una regex `/tutorial/i` para cubrirlo.
- Si las vistas son 0, el hype es 0 para evitar dividir entre cero.
- Redondeo a 4 decimales.

**Fecha relativa:** Implementada con JS puro, sin librerías. Calculo la diferencia en milisegundos y voy comparando contra cada unidad de tiempo (minutos, horas, días, meses, años). Devuelve strings como "Hace 2 meses" o "Hace 5 días".

**Orden de respuesta:** El video corona va primero, después el resto ordenado de mayor a menor hype. Así el frontend no necesita reordenar.

**CORS:** Habilitado para `http://localhost:3001` que es donde corre el dev server de React.

### Frontend

Usé TypeScript en todo el frontend. El estado lo manejo con `useState` y `useEffect` directamente, sin Redux ni nada externo porque solo es un fetch y mostrar datos.

La Joya de la Corona se renderiza aparte del grid con su propio componente y sección visual destacada. El resto de videos se muestra en tarjetas tipo statement con numeración, organizados en secciones (Top Trending, Rising, Todos los videos).

Para los estados de carga y error: un spinner CSS para loading y un mensaje con el código de error si falla la conexión.

Todo el CSS está hecho a mano, sin librerías de UI. Tema claro con acentos de color y animaciones de entrada al hacer scroll con IntersectionObserver.

## Organización del proyecto

```
backend/src/
  videos/
    videos.controller.ts   → Definición de la ruta GET /api/videos
    videos.service.ts      → Lógica de negocio (hype, fechas, ordenamiento)
    videos.module.ts       → Módulo de NestJS
  app.module.ts            → Módulo raíz
  main.ts                  → Bootstrap y config de CORS
  mock-youtube-api.json    → Mock de la API de YouTube

frontend/src/
  App.tsx                  → Componente principal con fetch, estados y render
  App.css                  → Estilos completos
```

## Supuestos

- El mock JSON es el dataset completo, no hay paginación.
- "Comentarios desactivados" = la propiedad `commentCount` no existe en `statistics` (no es que valga "0").
- Si hay empate en hype, gana el primero que aparezca en el array.
- La fecha se calcula contra la fecha actual, así que los textos relativos cambian con el tiempo.
- No hay caché ni base de datos, el JSON se lee en cada request.


