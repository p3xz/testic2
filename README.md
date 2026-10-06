# Journey Inside a Computer

A scroll-driven 3D flight inside a computer: from the motherboard into the CPU, down to the transistors, and into binary itself. Built with A-Frame.

![Tech](https://skillicons.dev/icons?i=html,css,js)

## Why this exists

Built for a hackathon bootcamp exercise: make something with [A-Frame](https://aframe.io/). Scroll is the controller, so the whole thing works on any laptop or phone with no headset and no build step. It also happens to be a BCA computer-fundamentals syllabus you can fly through.

## How it works

- The page is 700vh tall. Scroll position maps to camera waypoints along the flight path.
- A requestAnimationFrame loop lerps the camera rig toward the scroll target with smoothstep easing between stations, so the flight glides instead of jumping.
- The nearest station activates its narration card, the station counter (01/05), and the gradient progress bar.
- Five stations: a motherboard with copper traces and racing data pulses, a glowing CPU with gold pins and orbiting signal orbs, a transistor grid breathing in a traveling wave, a void of drifting binary digits, and a finale core with rotating halo rings.
- Atmosphere comes from exponential fog, colored point lights per station, additive glow sprites, and 700 drifting dust particles.

## Quick start

No dependencies, no build. Serve the folder and open it:

```bash
npx serve .
```

Or open `index.html` directly in a browser (some features like font loading prefer http).

## Controls

- Scroll down / up: fly deeper into the computer / back out
- Drag: look around (scroll still drives the flight)

## Tech stack

![Tech](https://skillicons.dev/icons?i=html,css,js)

- A-Frame 1.8.0 (WebGL scene graph, declarative entities)
- Vanilla JS for the scroll-to-camera mapping, procedural geometry, and animation loop
- Plain CSS for the loader, overlay cards, HUD, and progress bar

A-Frame was chosen because the whole scene is HTML tags, which keeps the scope manageable for a bootcamp: layout in `index.html`, behavior in `app.js`, styling in `style.css`.

## Project structure

- `index.html`: scene, lights, camera rig, HUD, overlay containers
- `app.js`: glow textures, procedural stations, scroll mapping, animation loop
- `style.css`: loader, narration cards, progress bar, responsive tweaks

## Contributing

Fork it, add a station (GPU? RAM? storage?), open a PR.

## License

MIT
