# 🏗 System Architecture: Pac-Man Demo

## Tech Stack (July 2026)
- **Frontend:** React 19, Vite 8, TypeScript 6.
- **Rendering:** HTML5 Canvas Context 2D.
- **Sound:** Synthesized Audio via Web Audio API.
- **State Machine:** React Context & coordinate loops.
- **Deployment:** Netlify.

## Core File Structure
- `src/App.tsx`: Central screen state router (`Start` -> `Playing` -> `GameOver`).
- `src/components/GameBoard.tsx`: Houses the Canvas rendering canvas and registers event listeners.
- `src/components/ScoreBar.tsx`: Clean UI bar indicating score, lives, and high scores.
- `src/game/maze.ts`: Standard 2D grid matrix mapping board layouts (0 = empty, 1 = wall, 2 = dot, 3 = power pellet).
- `src/game/pacman.ts`: Direction vector calculations, coordinate wraps, and input buffering.
- `src/game/ghost.ts`: Movement target vectors and Chase/Scatter behaviors based on original Pac-Man game specs.
- `src/game/useGameLoop.ts`: Custom React hook wrapping `requestAnimationFrame` for loop synchronization.

## System Invariants
- **Tickrate Constraints:** The canvas loop executes at a controlled tickrate (e.g. 10Hz grid updates) for arcade-authentic speed.
- **Grid Collision Invariant:** Pac-Man and ghosts are constrained strictly to the grid pathing specified in `maze.ts`.
- **Canvas Rendering Isolation:** React is used strictly for surrounding screen states and score layouts; all board drawing occurs directly inside the Canvas drawing thread.
