# Pac-Man Demo 🎮 — 2026 Edition

A modern, mobile-responsive Pac-Man game built with **React**, **TypeScript**, and **Vite**. This project demonstrates advanced browser-based game development without external game libraries.

## 🚀 Live Demo
Play the game live here: **[https://pecmann.netlify.app/](https://pecmann.netlify.app/)**

## ✨ Features
- **Mobile Responsive**: Playable on any device with intuitive swipe controls for iOS and Android.
- **Advanced Ghost AI**: Fully implemented Chase, Scatter, Frightened, and Eaten modes with intelligent pathfinding.
- **Procedural Audio**: Classic arcade sounds and background sirens generated via the Web Audio API (no heavy MP3 files).
- **Smooth Gameplay**: Throttled 10Hz game loop for that authentic retro arcade feel.
- **Modern Tech Stack**: Built with React 19, TypeScript 5, and Vite 6.

## 🕹️ How to Play
### Desktop
- **Arrow Keys**: Move Pac-Man around the maze.
- **Enter**: Start or restart the game.

### Mobile
- **Swipe**: Swipe in the direction you want Pac-Man to turn.
- **Buttons**: Use the on-screen "Play" buttons to start.

## 📜 Credits
This project is an educational tribute to the original **Pac-Man** created by **Toru Iwatani** and the team at **Namco** in 1980. This version aims to recreate the core mechanics while showcasing modern web technologies.

## 🛠️ Development

### Setup
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🏗️ Project Structure
- `src/game/`: Core logic (Maze, Ghost AI, Pac-Man movement, Audio).
- `src/components/`: Reusable React components (GameBoard, ScoreBar).
- `src/screens/`: Game state views (Start, Playing, Game Over).

---
Created with ❤️ by christpor.
