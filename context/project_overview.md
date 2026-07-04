# 🎯 Project Overview: Pac-Man Demo

## Core Mission
Pac-Man Demo is a modern, high-performance web recreation of the classic 1980 arcade hit. It aims to build a pure browser-based execution of Pac-Man, utilizing standard HTML5 Canvas rendering and React components for state management.

## Vision
To demonstrate state-of-the-art vanilla React game loop engineering without relying on third-party physics engines or libraries. It shows how classic AI movement routines (chase, scatter, frightened) can be implemented directly on custom TS vectors.

## Core User Flows
1. **The Launch:** StartScreen initializes. Player presses Enter or clicks "Play".
2. **The Chase:** Board renders, ghosts spawn, and the custom 10Hz game loop begins.
3. **The Score:** Player eats dots and power pellets, scoring points and frightening ghosts.
4. **The Collision:** If Pac-Man hits a ghost, a life is lost. If lives reach 0, the Game Over Screen appears.
5. **The Persistence:** High scores are saved to localStorage and displayed at restart.

## Out-of-Scope Boundaries
- Multi-level selection or complex maze generation is out of scope; the game focuses strictly on the classic layout.
- External audio assets (MP3, WAV) are bypassed; all sound effects are synthesized programmatically using the browser Web Audio API.
