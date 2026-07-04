# 🛠 Workflow Rules & Constraints: Pac-Man

## Agentic Behavioral Constraints
1. **Context-First Initialization:** Ingest files in sequential order from `GEMINI.md` before making any workspace changes.
2. **Single-Minded Focus:** Refactor only one component or logic class at a time.
3. **No Speculative Engineering:** Banish speculative game configurations or additional ghost behaviors unless directly requested.
4. **Authenticity Preservation:** Keep game speeds, grid boundaries, and rendering loop cycles intact.

## Error Recovery Pattern
1. **Halt:** Stop execution immediately when compilation error triggers.
2. **Document:** Log errors inside `context/current_issues.md`.
3. **Trace:** Analyze game loop states, coordinate arrays, and canvas frames.
4. **Approve:** Wait for user confirmation before modifying code.
