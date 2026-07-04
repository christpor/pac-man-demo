# 💅 Code Standards & Conventions: Pac-Man

## General Principles
- **Surgical Edits:** Modify code with target overrides to keep delta size low.
- **Canvas Isolation:** Never mix React component rendering logic inside the main Canvas drawing loops. Maintain helper draw functions separately.
- **Conventional Commits:** Enforce conventional commits prefix tags (`feat:`, `fix:`, `docs:`, `chore:`).

## React & TypeScript
- **State Partitioning:** Keep game rendering state inside useRef references to avoid React component rendering overhead during high-frequency loop ticks.
- **Explicit Typings:** Declare strict TS types for all movement vectors, grid positions, and ghost state enumerations.
- **Standard ESLint Configurations:** Follow ESList 10 configuration rules as defined in `eslint.config.js`.

## Canvas Drawing Principles
- **Grid Offset Alignment:** Always adjust rendering paths by the exact coordinate grid boundaries to prevent blurry line drawing artifacts.
- **Clean Clears:** Use clearRect coordinates precisely on every frame refresh.
