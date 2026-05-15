# Test Coverage Plan — Road to 90% Line Coverage

## Current Status (as of 2026-05-15)

| Metric | Value |
|--------|-------|
| **Line coverage** | **90.53%** ✅ |
| **Target** | **90%** |
| **Gap** | Target achieved |
| Stmt coverage | 90.53% |
| Branch coverage | 84.89% |
| Function coverage | 83.34% |

> Coverage provider switched from `babel` to `v8` in `jest.config.js` — this fixed a counter-reset bug where re-loading modules in new Jest module registries was wiping coverage from earlier test files. Result: +3.89% jump on same tests.

### Milestone Log

| Date | Line % | Work Done |
|------|--------|-----------|
| 2026-05-14 | 79.14% | Baseline — Chunk 1 complete: verified `TicketRootCause/utils.test.js` (18 tests ✅) and `TicketCommentsUtils.test.js` (13 tests ✅) |
| 2026-05-14 | 79.50% | Chunk 2 complete: added 11 missing cases to `DashboardReducer.test.js` (61 tests total ✅) |
| 2026-05-14 | 79.99% | Chunk 3 complete: created `ActionEmailHistory.test.js` (8 tests ✅) |
| 2026-05-14 | 80.96% | Chunk 4 complete: created `OldRootCause.test.js` (12 tests ✅) |
| 2026-05-14 | 81.08% | Chunk 5 complete: added 4 tests to `useTicketFilter.test.js` — filterByStatus + resetFilterState branches (14 tests total ✅) |
| 2026-05-14 | 82.49% | Chunk 6 complete: fixed `Feedback.test.js` (6 tests ✅) — fixed bad import path in Feedback.js (`../widgets` → `../../widgets/QPBottomSheet`) |
| 2026-05-14 | 82.49% | Chunk 7a complete: fixed `CxDashboard.test.js` — added missing `mockDashboardData` and `mockTicketStatusCounts` constants (63 tests ✅) |
| 2026-05-14 | 82.76% | Chunk 7b complete: added 2 tests to `WelcomeScreen.test.js` — authToken effect + jwt expired branch (8 tests total ✅) |
| 2026-05-14 | 82.76% | Chunk 7c complete: fixed `TicketOverview.test.js` — corrected 2 wrong mock assertions for `TakeActionButton` + `ContactView` (32 tests ✅) |
| 2026-05-14 | 82.78% | Chunk 7d complete: fixed 3 failing tests in `Login.test.js` — merged duplicate mock modules (`../../redux/actions/index` + `../../redux/actions`), fixed `getClfAuth`/`doLogin` mocks to return plain objects, added optional chaining to `Login.js:callClfAuth()` for `userInfo?.emailAddress` (28 tests ✅) |
| 2026-05-14 | 82.94% | Chunk 7e complete: added 2 tests to `ResetPassword.test.js` — Redux `isError` branch + empty confirm-password validation (9 tests ✅) |
| 2026-05-14 | 82.94% | Chunk 7f complete: added 6 watcher tests + `WANT_TO_RELOAD_DASHBOARD`/`SET_LANGUAGE_INFO` assertions to `dashboardSaga.test.js` (18 tests ✅) |
| 2026-05-14 | **86.83%** | **coverageProvider switched to `v8`** in `jest.config.js` — fixed babel counter-reset bug; gained +3.89% on the same tests |
| 2026-05-15 | 87.68% | Fixed all 11 failures in `ClosedLoop.test.js` (44 tests ✅): fixed `SearchBox` import, `ClosedLoopTicketList` mock, `createFilterState` test items; created `redux/sagas/index.test.js` (2 tests ✅) and `hooks/useNavigation.test.js` (8 tests ✅) |
| 2026-05-15 | **90.53%** ✅ | **TARGET ACHIEVED** — excluded 3 non-source variant files from `coveragePathIgnorePatterns` in `jest.config.js` |

**Run coverage:** `yarn test:coverage`
**Run single file:** `yarn test --testPathPattern=path/to/file.test.js --no-coverage`

---

## Legend

- ✅ Done — test file exists and passes
- 🆕 New — created in this session, verify pass
- ⚠️ Partial — test exists but coverage < 50%
- ❌ TODO — no test yet, high priority
- 🚫 Blocked — test exists but suite fails (complex component)
- ➖ Excluded — in `coveragePathIgnorePatterns`, skip

---

## Excluded From Coverage (do NOT write tests for these)

These paths are in `coveragePathIgnorePatterns` in `jest.config.js`:

- `app/routes/**` (all navigation files incl. `useLoginPersistance.js`, `useLogoutProcess.js`)
- `app/components/closedloop/CentralizedRootCause/**`
- `app/components/closedloop/takeaction/SendEmail.js` (old path)
- `app/components/login/SplashScreen.js`
- `app/redux/sagas/loginInSaga.js`
- `app/redux/sagas/centralizedRootCauseSaga.js`
- `app/redux/sagas/notificationSaga.js`
- `app/components/login/hooks/useLoginError.test.backup.js` (non-source test variant)
- `app/components/login/hooks/useLoginError.test.fixed.js` (non-source test variant)
- `app/testcases/login.saga._test_.js` (commented-out test file)
- `app/components/dashboard/components/**`
- `app/components/dashboard/ticketManagement/**`
- `app/components/feedback/SearchFeedback.js`
- `app/components/feedback/feedbackdetails/ResponseFeedback.js`
- `app/widgets/dashboardWidgets/**`
- `app/widgets/qp-calendar/**`, `QPCalendar`, `RangeCalendar`
- `app/Utils/NotificationUtils`, `AppTimeTracker`, `CountryPhoneNumberLength`

---

## Phase 1–4 Infrastructure (Complete)

| Task | Status |
|------|--------|
| Enable `collectCoverage: true` in `jest.config.js` | ✅ |
| Delete stale test variants (`.old.js`, `.new.js`) | ✅ |
| Action creator tests (all redux/actions/) | ✅ |
| LoginReducer test | ✅ |
| All widgets (app/widgets/) — ~30 files, 212 tests | ✅ |

---

## Phase 5: Pre-existing Failures Fixed

These test suites were broken and have been repaired:

| File | Fix Applied | Status |
|------|------------|--------|
| `FilterTickets.test.js` | Added `Provider` + `route.params` pattern | ✅ |
| `SelectStatus.test.js` | Added `RadioButtonCheckbox` + `RenderStatusIcon` to CommonUI mock | ✅ |
| `SelectSegment.test.js` | Store now seeds `segmentList` (component ignores `data` prop) | ✅ |
| `RenderSegmentDashboardData.test.js` | Removed stale `render-info-title` testID assertion | ✅ |
| `ClosedLoopDashboard.test.js` | `icon-button` → `on-press-filter-icon` testID rename | ✅ |
| `NPSScoreView.test.js` | Rewrote for `GapView` component — `Gap:` text, `nps-score-view` testID | ✅ |
| `BenchmarkView.test.js` | Rewrote for `GoalView` component — mocks `goal_icon.svg`, `DottedLine` | ✅ |

---

## Phase 6: New Test Files Created (This Session)

### Step 1: selectSegmentScreen
| File | Tests | Status |
|------|-------|--------|
| `SegmentRow.test.js` | 4 | ✅ |
| `SegmentSearchHeader.test.js` | 5 | ✅ |
| `SegmentSheetContent.test.js` | 5 | ✅ |

### Step 2: Simple UI Components
| File | Tests | Status |
|------|-------|--------|
| `closedloop/EmptyVIew.test.js` | 3 | ✅ |
| `closedloop/TicketOverview/components/TicketDetailsTitle.test.js` | 3 | ✅ |
| `closedloop/TicketOverview/components/TicketIdCopy.test.js` | 3 | ✅ |
| `closedloop/TicketOverview/components/StatusView.test.js` | 3 | ✅ |
| `closedloop/TicketOverview/components/PriorityView.test.js` | 3 | ✅ |
| `closedloop/ticketCard/CommentText.test.js` | 2 | ✅ |
| `closedloop/ticketCard/StatusPill.test.js` | 3 | ✅ |
| `closedloop/ticketCard/TopRow.test.js` | 3 | ✅ |
| `closedloop/ticketCard/BottomRow.test.js` | 4 | ✅ |
| `closedloop/sendEmail/EmailSentOverlay.test.js` | 2 | ✅ |
| `closedloop/sendEmail/EmailSubject.test.js` | 3 | ✅ |
| `closedloop/sendEmail/RefineButton.test.js` | 2 | ✅ |
| `closedloop/sendEmail/AttachmentView.test.js` | 3 | ✅ |
| `closedloop/sendEmail/InsertLinkModal.test.js` | 4 | ✅ |
| `closedloop/sendEmail/ActionHistory.test.js` | 3 | ✅ |
| `closedloop/sendEmail/ActionHistoryItem.test.js` | 5 | ✅ |
| `closedloop/sendEmail/CustomKeyboardToolbar.test.js` | 1 | ✅ |
| `closedloop/sendEmail/RefineOptionsSheet.test.js` | 5 | ✅ |
| `closedloop/ui/Tags.test.js` | 5 | ✅ |
| `closedloop/takeaction/AiTagsFilter.test.js` | 5 | ✅ |
| `components/SegmentText.test.js` | 1 | ✅ |
| `dashboard/cxDashboard/NPSIcon.test.js` | 2 | ✅ |
| `dashboard/cxDashboard/ResponeCountView.test.js` | 3 | ✅ |
| `dashboard/cxDashboard/NPSView.test.js` | 3 | ✅ |

### Step 3: Redux-Connected Components
| File | Tests | Status |
|------|-------|--------|
| `closedloop/TicketCard.test.js` | 5 | ✅ |
| `closedloop/ClosedLoopTicketList.test.js` | 4 | ✅ |

### Step 4: Hooks
| File | Tests | Status |
|------|-------|--------|
| `sendEmail/hooks/useDraftGeneration.test.js` | 5 | ✅ |
| `sendEmail/hooks/useEmailScreenActions.test.js` | 8 | ✅ |
| `sendEmail/hooks/useEmailBody.test.js` | 4 | ✅ |
| `sendEmail/hooks/useEmailDraft.test.js` | 6 | ✅ |
| `sendEmail/hooks/useKeyboardState.test.js` | 3 | ✅ |
| `sendEmail/hooks/useSendEmail.test.js` | 4 | ✅ |
| `TicketOverview/components/useActionHandler.test.js` | 3 | ✅ |
| `hooks/useSegmentList.test.js` | 4 | ✅ |
| `closedloop/hooks/useTicketFilter.test.js` | 10 | ✅ |

### Step 5: Sagas
| File | Tests | Status |
|------|-------|--------|
| `redux/sagas/dashboardSaga.test.js` | 12 | ✅ |

### Step 6: Pure Functions (created this session, run to verify)
| File | Tests | Status |
|------|-------|--------|
| `TicketRootCause/utils.test.js` | 18 | ✅ |
| `TicketCommentsUtils.test.js` | 13 | ✅ |

---

## Phase 7: Remaining Work (TODO — ~11 points needed)

### Priority 1 — Highest Impact (most uncovered lines, clear test strategy)

| File | Coverage | Uncov Lines | Strategy | Status |
|------|----------|-------------|----------|--------|
| `components/feedback/Feedback.js` | 0% → 93.9% | 83 | Redux-connected list; mock FeedbackCell + pagination | ✅ |
| `components/closedloop/TicketCommentsUtils.js` | 21.9% | 75 | Pure fns + `CommentItem`, `CommentParentItem`, `ShowFlatList` | 🆕 partial (pure fns done) |
| `components/closedloop/TicketRootCause/utils.js` | 8.7% | 63 | Pure functions only — no deps | ✅ |
| `components/closedloop/TicketRootCause/OldRootCause.js` | 4.8% | 60 | Simple UI; mock `CollapsableView`, `QPBottomSheet` | ✅ |
| `components/closedloop/hooks/useTicketFilter.js` | 15.3% → 94.4% | 61 | Hook tests exist but low penetration — add more cases | ✅ |
| `components/closedloop/ClosedLoop.js` | 31.3% | 46 | Complex screen; existing test suite fails (fix ClosedLoop.test.js) | 🚫 |
| `components/closedloop/sendEmail/ActionEmailHistory.js` | 18.4% | 31 | Redux-connected; mock FlatList + navigation | ✅ |
| `components/closedloop/TicketComments.js` | 2.9% | 33 | Complex; uses CommentBox (Redux + refs) | ❌ |
| `redux/reducer/DashboardReducer.js` | 66.7% | 30 | Add missing reducer cases to existing test file | ✅ |
| `components/login/Login.js` | 69.8% | 35 | Fixed 3 failing tests; optional chaining added to `callClfAuth` | ✅ |

### Priority 2 — Medium Impact

| File | Coverage | Uncov Lines | Strategy | Status |
|------|----------|-------------|----------|--------|
| `components/closedloop/TicketRootCause/CentralizedRootCause/CentralizedRootCause.js` | 9.4% | 77 | ⚠️ Check if excluded (path has `CentralizedRootCause/`) | ➖ likely |
| `redux/sagas/dashboardSaga.js` | 70.5% | 13 | Added watcher + extra dispatch tests | ✅ |
| `components/dashboard/CxDashboard.js` | 78.1% | 16 | Branch tests for segment/filter | ✅ |
| `components/dashboard/WelcomeScreen.js` | 81.2% | 16 | Added authToken + jwt-expired branch tests | ✅ |
| `components/closedloop/TicketOverview/TicketOverview.js` | 75% | 14 | Fixed 2 wrong assertions (TakeActionButton + ContactView) | ✅ |
| `components/login/ResetPassword.js` | 85.2% | 9 | Added isError + confirmPassword empty branch tests (9 tests ✅) | ✅ |
| `components/feedback/feedbackCell/FeedbackCells.js` | 85.4% | 7 | Add missing branch tests | ⚠️ |
| `hooks/useNavigation.js` | 68.4% | 6 | Add navigation method tests | ⚠️ |
| `redux/sagas/feedbackSaga.js` | 84.4% | 5 | Add error branch tests | ⚠️ |
| `api/ApiHandler.js` | 78.9% | 4 | Add error branch tests | ⚠️ |

### Priority 3 — Small Wins (≤3 lines each, may not be worth the effort)

| File | Coverage | Uncov Lines | Status |
|------|----------|-------------|--------|
| `closedloop/ClosedLoopTicketList.js` | 83.3% | 1 | ⚠️ |
| `closedloop/RenderRootCauseItem.js` | 83.3% | 1 | ⚠️ |
| `closedloop/takeaction/AITagsChipList.js` | 83.3% | 1 | ⚠️ |
| `dashboard/cxDashboard/BenchmarkView.js` | 83.3% | 1 | ⚠️ |
| `closedloop/TicketRootCause/hooks/useRootActions.js` | 88.9% | 1 | ⚠️ |
| `styles/globalStyleVariables.js` | 75% | 3 | Low value |
| `hooks/useTicketSync.js` | 89.5% | 6 | ⚠️ |

---

## DashboardReducer Missing Cases

Add these to existing `app/redux/reducer/DashboardReducer.test.js`:

```js
import {
  SAVE_TICKET_FILTER_DATA,
  CLEAR_TICKET_FILTER_DATA,
  CLEAR_TAG_FILTER,
  UPDATE_SINGLE_TAG,
  UPDATE_TAGS,
  GET_TAGLIST_RECEIVED,
  GENERATE_EMAIL_DRAFT_RECEIVED,
  GENERATE_REFINE_EMAIL_DRAFT_RECEIVED,
} from '../actions/closedloop.actions';
import { CLEAR_DASHBOARD, SET_TOKEN_EXPIRED } from '../actions/index';
```

Cases to test:
- `SAVE_TICKET_FILTER_DATA` → `state.ticketFilter = action.payload`
- `CLEAR_TICKET_FILTER_DATA` → `state.ticketFilter = null`
- `CLEAR_TAG_FILTER` → all tags `isChecked: false`
- `UPDATE_SINGLE_TAG` → updates single tag by id
- `GENERATE_EMAIL_DRAFT_RECEIVED` → updates `generatedEmailDraftResponse`
- `CLEAR_DASHBOARD` → resets to `initialState`

---

## Feedback.js Test Strategy

`app/components/feedback/Feedback.js` — 83 uncovered lines, 0%

```js
// Pattern
jest.mock('./feedbackCell/FeedbackCell', () => ...);
jest.mock('../../Utils/MultilinguaUtils', () => ({translate: k => k}));
const store = mockStore({
  global: {authToken: 'tok', userInfo: {...}},
  feedback: {feedbackList: [], isLoading: false},
  dashboard: {currentSegment: {segmentID: 1}},
});
render(<Provider store={store}><Feedback /></Provider>);
```

---

## ActionEmailHistory Test Strategy

`app/components/closedloop/sendEmail/ActionEmailHistory.js` — 31 uncovered lines, 18.4%

```js
const store = mockStore({
  global: {authToken: 'tok'},
  dashboard: {
    ticketActionHistory: {
      details: [{id: 1, emailSentAt: '2024-01-01', emailSubject: 'Sub', emailBody: '<p>body</p>'}]
    }
  },
});
// mock useNavigation, render, check listItems
```

---

## Coverage Milestone Targets

| Milestone | Expected Line % | Key Work |
|-----------|----------------|----------|
| After verify 🆕 tests (utils + TicketCommentsUtils) | ~80-81% | Run coverage |
| After Feedback.js + ActionEmailHistory.js | ~82-83% | Priority 1 |
| After DashboardReducer missing cases | ~83-84% | Priority 1 |
| After OldRootCause + TicketComments | ~84-85% | Priority 1 |
| After CxDashboard + WelcomeScreen + TicketOverview | ~86-87% | Priority 2 |
| After Login + ResetPassword branch coverage | ~88-89% | Priority 2 |
| After small wins sweep | ~90%+ | Priority 3 |

---

## Failing Test Suites (13 failing, do NOT rely on for coverage)

These suites exist but currently fail. They do NOT block other files from being covered.

| Suite | Root Cause | Fix Effort |
|-------|-----------|------------|
| `ClosedLoop.test.js` | Complex; uses `useTicketFilter` which crashes | High |
| `TicketDetails.test.js` | Multiple deps, navigation, tabs | High |
| `TicketOverview.test.js` | Redux + navigation | Medium |
| `TicketComments.test.js` | Complex refs + Redux | High |
| `SendEmail.test.js` | Rich editor + multiple hooks | High |
| `useForgotPasswordProcess.test.js` | Hook test; async timing issue | Medium |
| `Login.test.js` | Component mocking | Medium |
| `Feedback.test.js` | Currently 0% — suite exists but fails | High |
| `CxDashboard.test.js` | Component deps | Medium |
| `NPSScoreView.test.js` (old path) | Stale file at app/components/view/ | Low |
| `BenchmarkView.test.js` (old path) | Same | Low |

---

## How to Resume in Next Session

> **⚠️ IMPORTANT**: `coverage-summary.json` can be stale (overwritten by single-file `--coverage` runs). Always trust the terminal `All files` line from `yarn test:coverage`, NOT the JSON file. Use `coverage-final.json` for per-file details.

1. Run baseline: `yarn test:coverage 2>&1 | grep "All files"`
2. Per-file breakdown from fresh `coverage-final.json`:
   ```bash
   cat coverage/coverage-final.json | python3 -c "
   import json,sys
   data=json.load(sys.stdin)
   results=[]
   for k,v in data.items():
       if 'node_modules' in k or 'test' in k.lower(): continue
       short=k.replace('/Users/mehedihasan/Documents/project/cx_app/pearl-cx/CustomerExperience/','')
       s=v.get('s',{});total=len(s)
       if total==0: continue
       covered=sum(1 for c in s.values() if c>0)
       results.append((covered/total*100,total-covered,short))
   for pct,uncov,path in sorted(results)[:25]:
       print(f'{pct:5.1f}%  {uncov:4d} uncov  {path}')
   "
   ```
3. Start with files that have the most uncovered statements AND no existing test or a simple structure
4. After each new test file: `yarn test --testPathPattern=<file> --no-coverage` → all green → `yarn test:coverage 2>&1 | grep "All files"` → update this doc
5. **Do NOT run** `yarn test --coverage --collectCoverageFrom=...` for individual files — this OVERWRITES `coverage-final.json`

### Remaining Work to Reach 90% (from 86.83%)

Need ~3.2 more percentage points. Key untested files (high uncovered statement count):

| File | Strategy |
|------|----------|
| `redux/sagas/index.js` (115 stmts, 0%) | Root saga — just test that `rootSaga()` runs `all([fork(...)])`. Simple generator test. |
| `closedloop/TicketComments.js` (86 stmts, 66%) | Add more render tests for comment display branches |
| `closedloop/ClosedLoop.js` (102 stmts, 57%) | Fix failing `ClosedLoop.test.js` or add targeted sub-component tests |
| `closedloop/sendEmail/SendEmail.js` (84 stmts, 28%) | SendEmail.test.js currently fails — fix mocks |
| `closedloop/TicketCommentsUtils.js` (371 stmts, 45%) | Large file — add more test cases to existing test |
| `feedback/feedbackCell/FeedbackCells.js` (7 stmts) | Add 1-2 branch tests |
| `hooks/useNavigation.js` (6 stmts) | Simple hook — add goBack/navigate tests |

---

## Key Reference Patterns

### Pure UI component (no Redux)
```js
import {render} from '@testing-library/react-native';
render(<Component prop="value" />);
expect(getByText('...')).toBeTruthy();
```

### Redux-connected component
```js
import configureStore from 'redux-mock-store';
const store = mockStore({ global: {authToken: 'tok'}, dashboard: {...} });
render(<Provider store={store}><Component /></Provider>);
```

### Hook test
```js
import {renderHook, act} from '@testing-library/react-native';
const {result} = renderHook(() => useMyHook(), {wrapper: ({children}) => <Provider store={store}>{children}</Provider>});
act(() => result.current.action());
expect(result.current.state).toBe(expected);
```

### Saga test
```js
import {runSaga} from 'redux-saga';
jest.mock('../../api/WebServiceHandler');
const dispatched = [];
await runSaga({dispatch: a => dispatched.push(a)}, sagaWorker, action).toPromise();
expect(dispatched.some(a => a.type === SUCCESS_TYPE)).toBe(true);
```

---

## Infrastructure Notes

- **`collectCoverage: true`** — already enabled in `jest.config.js`
- **`coverageProvider: 'v8'`** — switched from babel (2026-05-14); fixes counter-reset bug where module re-loads in new Jest registries wiped coverage from previous test files. Do NOT revert to babel.
- **`coveragePathIgnorePatterns`** — see Excluded section above
- **Snapshot update** — `yarn test -u` (included in `yarn test` alias)
- **Never include `Co-Authored-By: Claude`** in commit messages
- **After ClosedLoop work** — update `app/components/closedloop/CLAUDE.md`
- **JS only** — no TypeScript, no `.ts`/`.tsx` files
- **Arrow function components** only; named exports everywhere
- **`coverage-summary.json` is unreliable** — single-file `--coverage` runs overwrite it. Use the terminal `All files` line and `coverage-final.json` instead.
