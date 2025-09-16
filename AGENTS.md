# Repository Guidelines

## Project Structure & Module Organization
Source lives in `solution.js`, where you implement the three Braille mappers. The executable harness is `braille.js`; it loads your mapper and a golden copy from `reference.js` to visualize differences. Keep shared helpers near the top of `solution.js` unless you promote them into their own module. Project metadata is in `package.json`, and the README gives challenge context. No separate test directory exists—the harness output is the verification loop.

## Build, Test, and Development Commands
Run `npm install` once to fetch `chalk`. Execute `node braille.js` (or `./braille.js` after `chmod +x braille.js`) to compare your mapper output against the reference grid. During debugging you can `node`-inspect individual values, e.g., `node -e "console.log(require('./solution').horizontalMapper(27))"`.

## Coding Style & Naming Conventions
This repository is plain Node.js; stick to ES2019 features supported by the runtime shipped with Node 18+. Use two-space indentation, `const`/`let` over `var`, and descriptive function names such as `mapColumnFirst`. Boolean helpers should read as predicates (`isBitSet`). Keep files ASCII-only and avoid hard-coding Braille glyphs; derive codepoints mathematically.

## Testing Guidelines
There is no Jest or Mocha suite—the harness is the test. Treat a full green grid from `braille.js` as the acceptance criterion. When adding utilities, write small inline assertions (e.g., `console.assert(nativeMapper(0) === '\u2800')`) and remove them before merging. If you introduce new permutations, duplicate the visualization pattern so contributors see red/green deltas immediately.

## Commit & Pull Request Guidelines
Recent history favors short imperative messages like `feat: cleanup README` alongside simple `Update README.md` commits. Prefer the `type: summary` style (`feat`, `fix`, `docs`) so automated changelog tooling will work later. PRs should explain the mapping strategy, list manual test commands run (`node braille.js`), and attach screenshots when harness output is relevant. Link tracking issues when available and request review from another solver before merging.

## Agent Workflow Tips
Break work into the three mapping functions and keep each pure; it simplifies reuse in alternative orderings. Validate edge values `0`, `27`, and `255` early so you catch off-by-one errors before scanning the full grid.
