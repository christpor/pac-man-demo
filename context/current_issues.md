# 🐞 Current Issues & Bug Logs: Pac-Man

## Known Critical Issues
*No critical issues reported.*

## Resolved Issues
- **Issue:** Bundle size concerns with retro audio files.
  - **Fix:** Switched to programmatic dynamic sound synthesis via Web Audio API, resolving network/bundling lag.

## Active Warnings
- **Warning:** Key events may suffer lag under specific high-frequency window refresh limits.
  - **Status:** Mitigation using direction input buffering added in `pacman.ts`.
