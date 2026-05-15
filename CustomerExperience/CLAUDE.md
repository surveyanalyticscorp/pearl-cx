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

#### Segment Picker — bottom sheet, not a screen
The global segment selector (`app/components/SegmentSelector.js`) appears in the header of Dashboard, Responses, and ClosedLoop. Tapping it opens a `QPBottomSheet` inline — it is **not** a navigation screen and has **no route registration**. Do not add it back to `CommonScreen.js`.

Content lives in `app/components/selectSegmentScreen/`:
- `SegmentSheetContent.js` — FlatList wired to `useSegmentList`, owns selection logic
- `SegmentSearchHeader.js` — search input with clear button
- `SegmentRow.js` — individual segment row

### Styling Rules

- Use **`StyleSheet.create()`** from React Native for ALL styles
- Use the `$rem` constant from `app/styles/globalStyleVariables.js` for sizing and spacing — never raw pixel numbers
- Colors, spacing, fonts → `app/styles/globalStyleVariables.js` — never hardcode values
- React Native Paper (`PaperProvider`) wraps the app — use Paper components where they exist before building custom ones
- **SVG assets** — import SVGs as React components (`import MySvg from './path/to/file.svg'`) and render with `width`, `height`, and `fill` props. Never use `<Image source={require(...)} />` for `.svg` files.

### Responsive UI

**`$rem` does NOT scale with phone screen size.** All phones — iPhone SE, iPhone 14, iPhone 14 Pro Max, and equivalent Androids — produce a `tempWidth` below 300 (after dividing logical pixels by `PixelRatio`), so they all receive the platform default: `$rem = 15` (iOS) or `$rem = 14` (Android). `$rem` only steps up for tablets/iPads. Do not rely on `$rem` to distinguish phone sizes.

**For phone-size responsiveness, use a `Dimensions` check:**

```js
import {Dimensions} from 'react-native';
const isSmallScreen = Dimensions.get('window').width <= 375;
```

- `≤ 375px` covers iPhone SE 2nd/3rd gen and small Android phones (~360dp)
- Declare `isSmallScreen` at module level (outside the component) — computed once, no re-render cost

**Font scaling on small screens** — use `TextSizes.semiSecondary` (0.9 × `$rem` ≈ 13.5px) as the step-down from the default `TextSizes.secondary` (`$rem` ≈ 15px):

```js
import {TextSizes} from '../styles/textsize.constants';
const smallFontStyle = isSmallScreen ? {fontSize: TextSizes.semiSecondary} : null;

// Apply as the last style in the array so it overrides baseTextStyles
style={[baseTextStyles.secondaryRegularText, smallFontStyle]}
```

**Spacing on small screens** — `HorizontalSpaceBox` and `VerticalSpaceBox` accept a `multiplyBy` prop; halve it (`multiplyBy={1}` instead of `multiplyBy={2}`) when `isSmallScreen` is true to recover horizontal space without hardcoding pixel values.

**Button sizing on small screens** — override button geometry via named `StyleSheet` entries appended to the style array:

```js
// In StyleSheet.create():
buttonContainerSmall: {
  paddingHorizontal: PaddingConstants.halfTab,       // 4px vs default 16px
},
buttonSmall: {
  height: MarginConstants.tab1_5x,                  // 40px vs default 48px
  paddingHorizontal: MarginConstants.tab1,           // 8px vs default ~17.5px
},
buttonTextSmall: {
  fontSize: TextSizes.semiSecondary,
},

// Applied conditionally:
style={[buttonStyles.primaryButton, styles.buttonFlex, isSmallScreen && styles.buttonSmall]}
textStyle={[buttonStyles.primaryButtonText, isSmallScreen && styles.buttonTextSmall]}
```

### Bottom Sheets (QPBottomSheet)

`QPBottomSheet` (`app/components/closedloop/takeaction/QPBottomSheet.js`) uses `maxHeight: 80%` by default — content that overflows is **clipped**, not scrolled.

**When the sheet content needs to scroll** (e.g. lists, chip sections), you must do all three:

1. Pass `bottomSheetHeight="X%"` to `QPBottomSheet` — this switches it from `maxHeight` to a fixed `height`, giving child views a bounded space to flex into.
2. Add `flex: 1` to the content container inside the sheet.
3. Wrap scrollable sections in `<ScrollView>` and keep action buttons **outside** the `ScrollView` so they stay pinned at the bottom.

```jsx
// Caller (e.g. AIEmailDraftModal.js)
<QPBottomSheet bottomSheetHeight="80%" visible={...} onClose={...}>
  <MySheet ... />
</QPBottomSheet>

// Sheet component
<View style={styles.container}>           {/* flex: 1 */}
  <ScrollView contentContainerStyle={styles.scrollContent}>
    {/* scrollable body sections */}
  </ScrollView>
  <ListItemSeparator />
  <ActionButtons />                       {/* always visible, outside scroll */}
</View>
```

Without `bottomSheetHeight`, `flex: 1` on the child has no bounded parent height and the `ScrollView` has no defined scroll region — the action buttons will be clipped.

### Testing

Saga tests are co-located with saga files (e.g. `dashboard.saga.test.js`).

**Before writing any new mock** — check `__mocks__/` first. Pre-built mocks exist for all major RN libraries including `@react-navigation/*`, Firebase, AsyncStorage, and device info. Do not duplicate them.

**AsyncStorage keys** (from `Constant.js`, never raw strings): `ASYNC_AUTH_TOKEN` · `ASYNC_USER_INFO` · `ASYNC_LOGGED_IN_ALREADY`

**Coverage exclusions** — `jest.config.js` `coveragePathIgnorePatterns` lists files excluded from coverage reporting. If you create variant files (`.backup.js`, `.fixed.js`, `._test_.js`, fully-commented-out files) they will be picked up by `collectCoverageFrom: ['app/**/*.{js,jsx}']` and counted as 0%-covered source, dragging the metric down. Add them to `coveragePathIgnorePatterns` immediately. Current target: **90% line coverage** (achieved — actual **95.7%** as of 2026-05-15) — see `docs/TEST_COVERAGE_PLAN.md`.

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
- **Conditional styles** — apply state-based style variants as `[styles.base, condition && styles.variant]` referencing named `StyleSheet` entries. Never create anonymous style objects for static values inline.

---

### Component File Organisation

- Group sub-components of a complex component in a subdirectory named after the parent (e.g. `ticketCard/` alongside `TicketCard.js`)
- Each sub-component file owns only its own `StyleSheet.create()` styles
- The parent file contains only data wiring and the container shell — no inline child component definitions
- Custom hooks for a component live in a `hooks/` subdirectory alongside that component (e.g. `sendEmail/hooks/useSendEmail.js`)

---

## DO NOT — Hard Rules

- **Do NOT install new packages without asking me first** — RN + patch-package setup is fragile
- **Do NOT use raw `fetch` in components or sagas** — always go through `ApiHandler.js` / `WebServiceHandler.js`
- **Do NOT hardcode API URLs, keys, or endpoints** — they belong in `Constant.js`
- **Do NOT hardcode colors or spacing values** — use `globalStyleVariables.js`
- **Do NOT use `console.log`** for debugging — ask me what logger to use if needed
- **Do NOT modify `app/redux/store/store.js`** without explicit instruction
