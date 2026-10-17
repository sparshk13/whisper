# 15. Phase Review Checklist

Run this at the end of every phase (the `/review-and-clean` workflow does it). The phase is not done until every box is true.

## Code is lean
- [ ] No unused imports, variables, functions, types, components, files, or dependencies
- [ ] No commented-out code, TODOs, placeholder files, or debug logs
- [ ] No abstraction used only once; no options or flags nobody uses
- [ ] No duplicated logic or types
- [ ] Functions are short and single-purpose; early returns instead of deep nesting

## Code looks hand-written
- [ ] No comments that restate the code; no banner comments
- [ ] Comments exist only for non-obvious reasoning (ordering, idempotency, reconnect, expiry)
- [ ] Names are specific, not filler (`data`, `info`, `helper`, `manager`)
- [ ] No emoji in code or logs; short human error messages
- [ ] Style and patterns match the rest of the codebase

## Correct and safe
- [ ] Matches docs 05, 06, 07, 12 exactly (events, payloads, error codes, statuses)
- [ ] Every input validated with Zod; membership and role checks in place
- [ ] No secrets committed; `.env.example` updated

## Verified
- [ ] `lint`, `typecheck`, and `test` pass in every changed package
- [ ] Manual steps for the phase work in two browsers
- [ ] Docs updated if behaviour changed

## Report to the developer
Short list of what was removed or simplified, then the build summary and 3 concepts to learn.
