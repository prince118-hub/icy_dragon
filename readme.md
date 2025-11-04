# Icy Dragon

Icy Dragon is a student-built, hands-on demo that illustrates how to create an interactive 3D web scene using Three.js and Vite. The repository provides a compact example that is easy to run and modify, aimed at teaching key WebGL concepts without overwhelming detail.

What you'll find in this project:

- A GLTF/GLB dragon model loaded from `public/` and placed into a simple scene.
- A lightweight particle-based snow system and subtle atmospheric lighting to add depth.
- Camera modes and simple controls for cinematic presentation and focused "hero" views.
- Raycasting-enabled interactions (hover and click) plus basic keyboard toggles.

Design goals:

- Be educational: clear code and a small surface area for learners to explore.
- Be portable: run on typical student laptops without heavy GPU requirements.
- Be extensible: provide a foundation you can fork and build upon for experiments or assignments.

Intended audience: students learning Three.js, instructors looking for a demo to demonstrate concepts, or hobbyists exploring web 3D basics.

## Table of Contents

- [Quick Start](#quick-start)
- [Development](#development)
- [Project Structure](#project-structure)
- [Authors](#authors)
- [License](#license)

## Quick Start

Prerequisites: Node.js (v14+) and npm.

Install dependencies and start the dev server:

```powershell
npm install
npm run dev
```

Build for production:

```powershell
npm run build
```

## Development

- Source files are in `src/`.
- Static assets (models, images) are in `public/`.
- Edit `src/script.js` and `src/style.css` to modify the scene and styles.

## Project Structure

```
Icy_Dragon/
├─ public/           # static assets (models, images)
├─ src/              # source files (html, js, css)
├─ package.json      # project scripts and dependencies
└─ readme.md         # this file
```

## Authors

- Jay Anit
- Kent Harvey Savedra
- Prince Charles Aniñon

## License

This project is provided under the MIT License. See the `LICENSE` file for details (or ask and I can add one).

## Acknowledgments

- Built using Three.js and Vite.

Enjoy!
