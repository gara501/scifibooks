# React + Vite

## Multimedia de los expedientes

Cada libro de `src/data/books.json` puede incluir un arreglo opcional `media`.
Cada elemento contiene `title`, `url` (HTTPS) y, opcionalmente, `creator`.
Asocia únicamente publicaciones cuyo libro se haya confirmado; el enlace al
perfil del creador no sirve para identificar qué libro aparece en un video.

Los enlaces completos de TikTok (`https://www.tiktok.com/@usuario/video/ID`
o `/photo/ID`) permiten cargar su reproductor oficial al pulsar el botón.
Los enlaces cortos y otras fuentes se muestran como enlaces externos.
El enlace original siempre permanece visible, incluso cuando TikTok impide
la reproducción. La sección aparece tanto en el modal como en la página del
libro, y permanece oculta si el expediente todavía no tiene multimedia.

Ejecuta `npm run validate:data` para comprobar los registros y enlaces.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
