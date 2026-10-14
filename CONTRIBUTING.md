# Contributing

1. Edit sources only: `tokens/tokens.json`, `src/`, `demo/index.html`, `docs/`. Everything in `dist/` and `docs/tokens.md` is generated.
2. Run `npm run verify`. It builds, checks contrast, runs the tests and typechecks.
3. **Color changes must keep every `aa.*` set at WCAG 2.2 AA.** The contrast check fails otherwise.
4. Values for the `apple.*` sets must come from Apple's published guidance or UI kits. Cite the source in the PR.
5. New framework adapter: add `src/adapters/<name>.js` + `.d.ts`, export it in `package.json`, add a test that runs the real framework, and add a guide under `docs/frameworks/`.

Write documentation and UI copy in plain language: buttons are verbs, errors say how to fix the problem.
