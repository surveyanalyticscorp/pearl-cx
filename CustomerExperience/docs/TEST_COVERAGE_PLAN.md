# Test Coverage Plan

## Overview

The project has ~146 test files but coverage reporting is disabled and several high-value source files have no tests. This document tracks the full effort to fix the test infrastructure and fill coverage gaps.

**Run coverage at any time:** `yarn test:coverage`

---

## Phase 1: Fix Test Infrastructure

| Task | File | Status |
|------|------|--------|
| Enable coverage reporting | `jest.config.js` — `collectCoverage: false` → `true` | [ ] |
| Remove commented-out dead block (lines 1–98) | `app/testcases/dashboard.saga.test.js` | [ ] |
| Delete stale variant | `app/redux/sagas/loginInSaga.test.old.js` | [ ] |
| Delete stale variant | `app/redux/sagas/loginInSaga.test.new.js` | [ ] |
| Delete stale variant | `app/redux/sagas/ClosedLoopSaga.test.new.js` | [ ] |

---

## Phase 2: Action Creator Tests (Trivial — pure functions, no dependencies)

| Task | File | Creators to test | Status |
|------|------|-----------------|--------|
| Create test | `app/redux/actions/notification.actions.test.js` | `getNotification`, `readNotification`, `clearNotification` | [ ] |
| Create test | `app/redux/actions/email.actions.test.js` | `CLEAR_EMAIL_DATA_ACTION`, `setEmailSubject`, `setEmailBody`, `setEmailData`, `setTemplateBottomSheetState` | [ ] |
| Create test | `app/redux/actions/login.action.test.js` | `setLoginEmail`, `setLoginPassword`, `setLoginAccessCode`, `setLoginUser`, `clearLoginUser` | [ ] |
| Create test | `app/redux/actions/login.actions.test.js` | `authenticatePanel`, `doLogin`, `getClfAuth`, `requestPasswordLink`, `updatePassword`, `validateResetPasswordLink`, `setBaseUrl`, `setAccessCode`, `updateBaseUrl`, `updateClfBaseUrl`, `doLogout`, `clearResetPasswordLinkResponse` | [ ] |

**Pattern to follow:** `app/redux/actions/feedback.actions.test.js`

---

## Phase 3: Reducer Test (Low complexity — pure switch reducer)

| Task | File | Cases to test | Status |
|------|------|--------------|--------|
| Create test | `app/redux/reducer/LoginReducer.test.js` | `LOGIN_EMAIL`, `LOGIN_PASSWORD`, `LOGIN_ACCESS_CODE`, `LOGIN_USER`, `CLEAR_LOGIN_USER`, default | [ ] |

**Pattern to follow:** `app/redux/reducer/NotificationReducer.test.js`

---

## Phase 4: Widget Tests

| Task | File | Tests to write | Status |
|------|------|---------------|--------|
| Create test | `app/testcases/widget_test/QPSpinner.test.js` | Renders correctly (snapshot), renders AnimatedDotIndicator, custom spinnerColor, spinnerText present/absent | [ ] |
| Create test | `app/testcases/widget_test/QPTransparentSpinner.test.js` | Renders correctly (snapshot), renders AnimatedDotIndicator, subText present/absent | [ ] |

**Pattern to follow:** `app/testcases/widget_test/AnimatedDotIndicator.test.js`

---

## Phase 5: Future Work (Out of Scope Now)

| Area | Files | Complexity | Notes |
|------|-------|-----------|-------|
| Dashboard saga | `app/redux/sagas/dashboardSaga.js` | Medium | Requires `WebServiceHandler` mocking — active tests already exist in `app/testcases/dashboard.saga.test.js` |
| Feedback saga | `app/redux/sagas/feedbackSaga.js` | Medium | Requires `WebServiceHandler` mocking |
| Components | `app/components/` (~54% covered) | High | Large scope; 74 of ~161 files have tests |
| Widgets (dropdowns) | `app/widgets/drop-down/` | Medium | Listed in `coveragePathIgnorePatterns` — excluded by design |

---

## Current Coverage Gaps (Snapshot)

| Category | Source Files | With Tests | Gap |
|----------|-------------|-----------|-----|
| Utils | 18 | 18 | 0 |
| API Layer | 3 | 2 | 1 (Constant.js — partial) |
| Redux Actions | 8 | 3 | **5 missing** |
| Redux Reducers | 6 | 5 | **1 missing** |
| Redux Sagas | 5 | 2 | 3 missing (1 ignored by design) |
| Components | ~161 | ~74 | ~87 missing |
| Widgets | ~30 | ~17 | ~13 missing |

---

## Key Commands

```bash
yarn test                    # Run all tests + update snapshots
yarn test:coverage           # Full suite with coverage report
yarn test:unit               # app/testcases/unit_test/ only
yarn test:widget             # app/testcases/widget_test/ only
yarn test:component          # app/testcases/component_test/ only
yarn test:watch              # Watch mode

# Run a single test file
yarn test --testPathPattern=path/to/MyFile.test.js
```

---

## Notes

- `collectCoverage` is currently `false` in `jest.config.js` — enable it to see reports
- `coveragePathIgnorePatterns` in `jest.config.js` intentionally excludes: calendars, dashboard charts, notification utils, routes, several saga files
- Test pattern: use `renderer.create().root.findAllByType()` for components using `Animated.View` — `toJSON()` returns null for animated trees in this test env
- Saga tests use `runSaga` from `redux-saga` with mocked `WebServiceHandler`
