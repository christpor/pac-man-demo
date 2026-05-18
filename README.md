# Pac-Man Demo 🎮

A classic Pac-Man game built with React and TypeScript.
This project was created as a fun demo to show what we can build together.

## How to Play

- Use the **Arrow Keys** to move Pac-Man around the maze
- Eat all the dots to complete the level
- Avoid the ghosts — touching one will cost you a life!
- Eat a **Power Pellet** (the big dot in the corners) to turn ghosts blue
- While ghosts are blue, you can eat them for bonus points
- You have **3 lives** — good luck!

## Scoring

| Action | Points |
|---|---|
| Eat a dot | 10 |
| Eat a Power Pellet | 50 |
| Eat a frightened ghost | 200 |

Your best score is saved automatically and shown on the start screen.

## Run Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
```

## Deploy to GitHub Pages

```bash
npm run deploy
```

This will build the project and push it to the `gh-pages` branch automatically.

## Built With

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — fast build tool
- HTML Canvas — for rendering the game
- No game libraries — everything is built from scratch!

## Project Structure

```
src/
  App.tsx              — main screen state machine
  screens/
    StartScreen.tsx    — welcome screen
    GameOverScreen.tsx — game over screen
  components/
    GameBoard.tsx      — canvas renderer
    ScoreBar.tsx       — score and lives display
  game/
    maze.ts            — maze grid data
    pacman.ts          — Pac-Man movement logic
    ghost.ts           — ghost AI (chase, scatter, frightened)
    useGameLoop.ts     — game loop using requestAnimationFrame
```

---

Thank you for playing! We hope you enjoy this little demo. 🟡
