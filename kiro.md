# Pac-Man Demo — Agent Guide

## Scope
Build a classic Pac-Man game. Nothing more, nothing less.

## Rules for the Agent
- Do NOT add features not listed here
- Do NOT rewrite files that already work
- Do NOT get stuck in a loop — if something fails twice, stop and report
- Complete tasks in order, one at a time

## Tech Stack
- Vite + React + TypeScript
- Plain canvas for rendering (no game libraries)
- No external UI libraries

## Features
- Pac-Man moves with arrow keys
- 4 ghosts with chase/scatter AI
- Power pellets make ghosts frightened (blue, edible)
- Score: dots = 10pts, power pellets = 50pts, eating ghost = 200pts
- 3 lives
- High score saved to localStorage
- Screens: Start → Playing → Game Over → Restart

## File Map
```
src/
  App.tsx              — screen state machine
  screens/
    StartScreen.tsx    — title + press enter
    GameOverScreen.tsx — final score + restart
  components/
    GameBoard.tsx      — canvas renderer
    ScoreBar.tsx       — score + lives display
  game/
    maze.ts            — 2D grid map
    pacman.ts          — movement logic
    ghost.ts           — ghost AI
    useGameLoop.ts     — requestAnimationFrame hook
```
