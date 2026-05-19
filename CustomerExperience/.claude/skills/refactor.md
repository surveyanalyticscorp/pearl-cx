# refactor

Analyse, plan, and execute a focused refactor of a file, feature, module, or portion of the CX app.

## Usage

`/refactor <target>`

Where `<target>` is a file path, directory path, or module name (e.g. `app/components/closedloop/sendEmail/` or `app/components/dashboard/ticketManagement/CreateTicket.js`).

---

## Instructions

You are executing a structured refactor. Follow these six phases in order. Do **not** skip ahead — each phase depends on the previous one.

---

### Phase 1 — Analysis (read-only, no file changes)

**1.1 Read the target**

- If `$ARGUMENTS` is a single file: read it in full.
- If `$ARGUMENTS` is a directory: list all `.js`/`.jsx` files inside it (recursively) and read each one.

**1.2 Read context docs**

Walk up the directory tree from the target until you find a `CLAUDE.md`. Read it. Also read:
- `/Users/mehedihasan/Documents/project/cx_app/pearl-cx/CustomerExperience/CLAUDE.md` (root conventions — always read this)
- Any module-level `CLAUDE.md` in the target path or a parent directory (e.g. `closedloop/CLAUDE.md`, `widgets/CLAUDE.md`)

**1.3 Read style constants**

Read these files so you know what constants are available for the refactored code:
- `app/styles/colors.constants.js`
- `app/styles/sizes.constants.js`
- `app/styles/textsize.constants.js`
- `app/styles/padding.constants.js`
- `app/styles/margin.constant.js`

**1.4 Find existing tests**

Search for `*.test.js` files co-located with the target files. Also grep for the component/module name in `app/testcases/` to find any external test files.

**1.5 Check for audit flags**

Read `docs/TEST_COVERAGE_PLAN.md` and note whether the target is listed under `coveragePathIgnorePatterns` or marked for deletion/audit. If flagged, note it in the plan but **still proceed** — refactor anyway.

**1.6 Analyse against this checklist**

For every file in scope, flag every violation found:

**Structure violations:**
- Sub-components defined inline in the parent file (should be in `<ComponentName>/` subdirectory)
- Custom hooks defined inside a component file (should be in `hooks/` subdirectory)
- Parent component doing more than data wiring + container shell
- Styles defined in a parent file for a sub-component (each component owns its own `StyleSheet`)

**Style violations:**
- Anonymous inline style objects (e.g. `style={{ color: 'red' }}`) instead of `StyleSheet.create()` entries
- Hardcoded colors — must use `colors.constants.js`
- Hardcoded padding values — must use `padding.constants.js`
- Hardcoded margin values — must use `margin.constant.js`
- Hardcoded font sizes — must use `textsize.constants.js`
- Hardcoded dimensions/sizes — must use `sizes.constants.js`
- Direct import from `globalStyleVariables.js` (components must not import this directly)

**Logic violations:**
- Data transforms or complex conditionals inside the render/return
- API calls or `fetch` calls outside `ApiHandler`/`WebServiceHandler`
- State or side effects that should live in a custom hook
- Business logic entangled with rendering

**React/RN violations:**
- Class components (must be functional arrow components: `const X = () => {}`)
- `TouchableOpacity` or `TouchableHighlight` (must use `Pressable`)
- `SafeAreaView` from `react-native` (must use `useSafeAreaInsets` from `react-native-safe-area-context`)
- Missing optional chaining (`?.`) where a value might be null/undefined
- Missing nullish coalescing (`??`) where a fallback is needed
- Props not destructured at the function signature level

**Export violations:**
- Default exports on non-screen components (use named exports; only screen components use `export default`)

**Redux violations (flag but do NOT fix logic):**
- Saga logic or reducer behaviour changes identified — list them in the summary under "Flagged for separate pass" but skip implementation

---

### Phase 2 — Refactor Plan (present to user, await confirmation)

Present the following structured plan. Be specific — list exact file paths, not vague descriptions.

```
## Refactor Plan: <target>

### Violations found
(bullet list of every violation from Phase 1, grouped by category)

### Files to be created
- <exact path>: <reason>

### Files to be modified
- <exact path>: <what changes and why>

### Files to be deleted
- <exact path>: <reason>

### Component split (if applicable)
- <ParentComponent>.js keeps: data wiring, container shell, Redux connect
- Sub-components extracted to <ParentComponent>/:
  - <SubA>.js — <what it renders>
  - <SubB>.js — <what it renders>
- Hooks extracted to hooks/:
  - use<X>.js — <what logic it owns>

### Tests
- Tests to fix: (list test files that will break due to import path or export changes)
- New test files to write: (list with exact paths, co-located with source files)

### Docs to update
- <doc path>: <which sections change>

---
Awaiting your confirmation to proceed with the refactor.
```

**STOP HERE.** Do not touch any file until the user confirms.

---

### Phase 3 — Refactoring

Execute exactly the confirmed plan. Follow these rules without exception:

**Component organisation:**
- Sub-components go in `<ComponentName>/` subdirectory alongside `<ComponentName>.js`
  - Example: extracting `TopRow` from `TicketCard.js` → create `ticketCard/TopRow.js`
- Each extracted sub-component owns its own `StyleSheet.create()` — never share style objects across files
- The parent file keeps only: Redux wiring, data fetching triggers, container `<View>`, and rendering sub-components
- Custom hooks go in `hooks/` subdirectory alongside the component
  - Example: `sendEmail/hooks/useSendEmail.js`
- Create multi-depth directory structures as needed — do not flatten

**Style rules:**
- All styles in named `StyleSheet.create()` entries — no anonymous inline objects for static values
- Colors: import from `colors.constants.js`
- Padding: import from `padding.constants.js`
- Margins: import from `margin.constant.js`
- Font sizes: import from `textsize.constants.js`
- Dimensions/sizes: import from `sizes.constants.js`
- Never import `globalStyleVariables.js` directly in a component

**Conditional styles:** `[styles.base, condition && styles.variant]` — named entries only

**Redux:**
- Reorganise only: rename, move, or restructure files as needed
- Never alter saga logic, reducer behaviour, action types, or API call patterns
- Flag any logic-level improvements in the Phase 6 summary

**Language rules:**
- JavaScript only — no TypeScript, no type annotations
- Functional arrow components: `const MyComponent = ({prop1, prop2}) => {}`
- Named exports everywhere: `export const MyComponent = ...`
- Screen components only: `export default MyScreen`
- Always use `?.` and `??` — never assume a value exists
- Props always destructured at the function signature

**Touchables:** `Pressable` only — never `TouchableOpacity` or `TouchableHighlight`

**Safe area:** `useSafeAreaInsets` from `react-native-safe-area-context` — never `SafeAreaView` from `react-native`

---

### Phase 4 — Tests

**4.1 Run existing tests first**

```bash
yarn test --testPathPattern="<target path pattern>" --no-coverage
```

Note which tests fail due to the refactor (import path changes, renamed exports, etc.).

**4.2 Fix failing tests**

Fix any broken test files — update import paths, renamed exports, restructured props. Do not change test logic unless the component behaviour changed (it shouldn't).

**4.3 Write new tests**

Write `.test.js` files co-located with every new or significantly refactored file:
- Place `MyComponent.test.js` in the **same directory** as `MyComponent.js`
- For hooks: place `useMyHook.test.js` in the same `hooks/` directory
- Create intermediate directories as needed (e.g. `ticketCard/TopRow.test.js`)
- **Before writing any mock**, check `__mocks__/` — never duplicate an existing mock

Test coverage goals per new file:
- Render path: does it render without crashing?
- Props: does it respond correctly to each prop variant?
- Interaction: does it call the right callback on user actions?
- Edge cases: null/undefined props, empty arrays, loading/error states

**4.4 Verify coverage**

```bash
yarn test:coverage
```

Overall coverage must stay at or above 95%. If it drops, identify the uncovered lines and add targeted tests before proceeding.

---

### Phase 5 — Doc Updates

Update only the docs that are directly affected by this refactor:

**Module-level CLAUDE.md** (if one exists in or above the target directory):
- Update the file map to reflect created, modified, or deleted files
- Add or update any pitfalls section if new gotchas were discovered
- Append a feature log entry: `### <date> — Refactor: <target> — <one-line summary>`

**`docs/TEST_COVERAGE_PLAN.md`** (update if tests were added):
- Update the overall coverage percentage in the status section
- Update test suite count and test count
- Append a milestone log entry for this refactor session

**Root `CLAUDE.md`** (update only if project-wide conventions or directory structure changed):
- Update architecture section or component organisation section as appropriate

---

### Phase 6 — Summary

Print this summary when everything is complete:

```
## Refactor Summary: <target>

### Files changed
Created:
- <path>

Modified:
- <path>

Deleted:
- <path>

### Key decisions
- <why a particular split was chosen>
- <why a hook was extracted>
- <any non-obvious choice made>

### Tests
- Fixed: <N> broken test(s)
- Added: <N> new test file(s), <N> new test(s)
- Coverage: <before>% → <after>%

### Docs updated
- <list each doc and what changed>

### Flagged for separate pass (not done here)
- <any Redux logic-level improvements identified but intentionally skipped>
- <any other improvements out of scope for this refactor>
```
