# CLAUDE.md

## What This Project Is

React Native app for CX managers on Android and iOS. Shows NPS, CSAT scores, Survey Responses, and Tickets — all filterable by date, status, priority, tags, and ticket type. Managers can manage tickets, view survey responses, post comments, and contact customers via email.

## React Native Version & Platform Status

- **React Native:** 0.77.2
- **Android:** ✅ Builds and runs on emulator
- **iOS:** ✅ Builds and runs on simulator
- **Hermes:** ON — `hermesEnabled=true` / `hermes_enabled: true`
- **New Architecture (Fabric):** OFF — both `fabric_enabled` and `new_arch_enabled` must be `false`
- **Minimum iOS deployment target:** 15.1 (RN 0.76 hard minimum)
- **Node requirement:** Node >= 18
- **Xcode tested on:** Xcode 26.3 / iOS 26.2 SDK

**Stack:** Redux + Redux-Saga · React Navigation v6 · RN Paper · Jest · Yarn

---

## Commands

```bash
# Development
yarn start                    # Start Metro bundler
yarn start:resetCache         # Reset Metro cache
yarn android                  # Run Android emulator
nvm use 18.20.4 && yarn ios   # Run iOS simulator (Node 18 required)

# Android builds
yarn android:cleanBuildAssemble  # Full clean build
yarn android:debug-bundle        # Create debug bundle

# iOS
yarn ios:pod-reinstall        # Full pod clean and reinstall (always after dep changes)
                              # If that fails, run manually:
                              # cd ios && rm -rf Pods Podfile.lock && pod install --repo-update && cd ..

# Testing
yarn test                     # Run all tests (includes -u snapshot update)
yarn test:unit                # app/testcases/unit_test/
yarn test:component           # app/testcases/component_test/
yarn test:widget              # app/testcases/widget_test/
yarn test:watch               # Watch mode
yarn test:coverage            # Full coverage report

# Run a single test file
yarn test --testPathPattern=path/to/MyFile.test.js

# Cache / reset
yarn watchman:clean           # Fix file watching issues
yarn reset_                   # Full node_modules reset + cache clean
```

---

## Architecture

All application code lives in `app/` — there is no `src/` directory. Never create a `src/` folder.

### Project Structure

```
app/
  api/              # Network layer (ApiHandler.js, WebServiceHandler.js)
  components/       # Reusable UI components
  config/           # Constants and configuration (Constant.js)
  redux/
    actions/        # Domain-specific action creators
    reducer/        # Domain-specific reducers
    sagas/          # Async logic and API calls
    store/          # Store setup
  routes/           # Navigation stacks and appRouter.js
  screens/          # Screen-level components
  styles/           # Global style variables
  testcases/
    unit_test/
    component_test/
    widget_test/
```

### State Management: Redux + Redux-Saga

- **Store**: `app/redux/store/store.js`
- **Actions**: Domain-specific files in `app/redux/actions/` (e.g. `dashboard.actions.js`)
- **Reducers**: `app/redux/reducer/` — domain-specific (Dashboard, Global, Notification, Feedback, Login, Network)
- **Sagas**: `app/redux/sagas/` — handle ALL async operations and API calls

**The standard async flow — always follow this, no exceptions:**

```
dispatch action
  → saga intercepts with takeEvery
  → saga calls API via ApiHandler
  → saga dispatches success/error action
  → reducer updates state
```

### API Layer

Two files handle ALL network communication — never use raw `fetch` anywhere else:

- **`app/api/ApiHandler.js`** — business logic layer. Exposes named methods like `getCXDetractorTicket()`, `getFeedbackResponseList()`, `generateEmailWithAI()`.
  - Use `callAPIInternal(token, url, data, successCb, errorCb)` for standard calls
  - Use `callAIRouterAPI(url, apiKey, data, successCb, errorCb)` for AI router endpoints
- **`app/api/WebServiceHandler.js`** — HTTP abstraction using native `fetch`. Auto-prepends `global.baseUrl` to relative URLs.
  - Use `static postNew()` for POST
  - Use `static get()` for GET

API endpoints and app-wide constants are in `app/config/Constant.js`. Never hardcode URLs or keys inline.

### Navigation

- Central router: `app/routes/appRouter.js` · Drawer: `app/components/view/DrawerContent.js`
- Never hardcode screen names — always use screen name constants

### Styling Rules

- Use **`StyleSheet.create()`** from React Native for ALL styles
- Use the `$rem` constant from `app/styles/globalStyleVariables.js` for sizing and spacing — never raw pixel numbers
- Colors, spacing, fonts → `app/styles/globalStyleVariables.js` — never hardcode values
- React Native Paper (`PaperProvider`) wraps the app — use Paper components where they exist before building custom ones

### Testing

Saga tests are co-located with saga files (e.g. `dashboard.saga.test.js`).

**Before writing any new mock** — check `__mocks__/` first. Pre-built mocks exist for all major RN libraries including `@react-navigation/*`, Firebase, AsyncStorage, and device info. Do not duplicate them.

**AsyncStorage keys** (from `Constant.js`, never raw strings): `ASYNC_AUTH_TOKEN` · `ASYNC_USER_INFO` · `ASYNC_LOGGED_IN_ALREADY`

---

## Critical Conventions — ALWAYS FOLLOW

- **JS only** — this is a JavaScript project. No TypeScript, no `.ts`/`.tsx` files, no type annotations
- **Functional components only** — no class components
- **Arrow function components**: `const MyComponent = () => {}`
- **Named exports** everywhere; screens use `export default` (React Navigation requirement)
- Use `optional chaining (?.)` and `nullish coalescing (??)` — never assume a value exists
- Always destructure props at the function signature level
- Use `Pressable` for touchables (not `TouchableOpacity`/`TouchableHighlight`); match existing code if already inconsistent
- Screens: `useSafeAreaInsets` from `react-native-safe-area-context` — never `SafeAreaView` from `react-native`
- Always handle loading, error, and empty states — never assume API data exists

---

## DO NOT — Hard Rules

- **Do NOT install new packages without asking me first** — RN + patch-package setup is fragile
- **Do NOT use raw `fetch` in components or sagas** — always go through `ApiHandler.js` / `WebServiceHandler.js`
- **Do NOT hardcode API URLs, keys, or endpoints** — they belong in `Constant.js`
- **Do NOT hardcode colors or spacing values** — use `globalStyleVariables.js`
- **Do NOT use `console.log`** for debugging — ask me what logger to use if needed
- **Do NOT modify `app/redux/store/store.js`** without explicit instruction
