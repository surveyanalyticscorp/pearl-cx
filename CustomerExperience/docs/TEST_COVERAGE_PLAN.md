# Test Coverage Plan — Road to 90% Line Coverage

## Current Status (as of 2026-05-15)

| Metric | Value |
|--------|-------|
| **Line coverage** | **95.7%** ✅ |
| **Target** | **90%** |
| **Gap** | Target achieved (+5.7%) |
| Stmt coverage | 95.7% |
| Branch coverage | 84.68% |
| Function coverage | 89.91% |
| Test suites | 239 passing |
| Tests | 1916 passing |

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
| 2026-05-15 | 92.18% | Fixed all 8 pre-existing failing test suites (TicketComments, Responses, ClosedLoopSaga, loginInSaga, TicketDetails, useForgotPasswordProcess, SplashScreen, SendEmail) |
| 2026-05-15 | **91.12%** | **Phase 0 complete** — `coveragePathIgnorePatterns` cleanup: removed 14 stale entries, narrowed `app/routes` to 11 stack exclusions (57 commonUI files now in scope), deleted dead `CentralizedRootCause.js` + `ResponseFeedback.js`. Coverage dip is expected — commonUI files entering scope have no tests yet. |
| 2026-05-15 | **92.13%** | **Phases 1–3 complete** — deleted 2 empty/dead files (`useSorting.js`, `TicketOverview/components/index.js`); added pure function tests (`redux/actions/index`, `globalStyleVariables`, `icon-native`); created 17 sendEmail component tests (RenderAILogo, RenderLoadingSpinner, TemplateIcon, TicketId, AiDraftButton, InsertButton, RegenerateButton, SendEmailTo, AttachmentItem, EmailActionBar, SendEmailButton, SelectEmailTemplate, RefineDropDown, RefineLabel, AiEmailBodyTextView, EmailOptions, CustomKeyboardToolbar). 225 suites passing, 1789 tests. |
| 2026-05-15 | **93.47%** | **Phase 4 complete** — TicketRootCause components: `TagViewItem.test.js` (3 tests), `AskWhy.test.js` (3 tests), `RootCauseNavigationButtons.test.js` (3 tests), `CustomeRootCause.test.js` (13 tests), `CentralizedRootCause.test.js` (8 tests). 231 suites passing, 1820 tests. |
| 2026-05-15 | **94.56%** | **Phases 5 & 6 complete** — Dashboard: `RenderCsatChart.test.js` (3), `BenchmarkView.test.js` (+2). Existing test updates: `DashboardReducer.test.js` (+11 cases), `closedloop.actions.test.js` (+16 action creators), `TicketCommentsUtils.test.js` (+22 — UserAvatar, CommentText, CommentBoxParentContainer, CommentInput, CommentItem, ShowNestedFlatList, CommentParentItem, CommentBox, ShowFlatList), `QPDropDownMenu.test.js` (new, 6), `AITagsChipList.test.js` (new, 6), `SegmentText.test.js` (+1 iPad branch), `SegmentSelector.test.js` (+4 NotiificationIcon), `TicketActivity.test.js` (+3 sort interactions), `useActionHandler.test.js` (+2 call/sms cases). New files: `NPSScoreComponent.test.js` (3), `TicketOverviewContainer.test.js` (2), `TopRowIcon.test.js` (2), `AIEmailDraftModal.test.js` (6). 254 suites, 1964 tests. |
| 2026-05-15 | **95.69%** | **Phase 7 complete** — `commonUIExtra.test.js` (24 tests) covering all 0%-covered commonUI files: `DismissKeyboard`, `MenuIcon`, `DrawerBackground`, `FabAddButton`, `NotificationIcon`, `HeaderBackLeft`, `SearchIcon`, `EmptyList`, `BottomSheetHeader` (PanelHandler, CloseButton, TitleAndCloseButton), `PageHeaderText`, `RenderStatusIcon`. 239 suites passing, 1916 tests. |

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

- `app/index.js` — entry point
- `app/routes/appRouter.js`, `signInStack.js`, `SettingsStack.js`, `ClosedLoopStack.js`, `DashboardStack.js`, `DashboardModalStack.js`, `ResponsesStack.js`, `RenderDrawer.js`, `DrawerContent.js`, `RootNavigation.js`, `drawerContent/` — navigation wiring
- `app/components/notifications/**` — push notification subsystem
- `app/redux/sagas/notificationSaga.js`
- `app/components/dashboard/components/**`, `app/components/dashboard/ticketManagement/**` — under audit for deletion
- `app/components/dashboard/RenderSegmentBottomSheet.js`
- `app/widgets/qp-calendar/**`, `app/widgets/drop-down/**` — under audit for deletion
- `app/components/feedback/SearchFeedback.js` — intentionally deferred
- `app/components/dashboard/highchart.html`, `highcharts.js`, `jquery.min.js` — vendor assets
- `app/components/login/hooks/useLoginError.test.backup.js` — non-source variant
- `app/components/login/hooks/useLoginError.test.fixed.js` — non-source variant
- `app/testcases/login.saga._test_.js` — commented-out test file

**Now in coverage scope (previously excluded):**
- `app/routes/CommonScreen.js` — has test ✅
- `app/routes/routes.styles.js`
- `app/routes/commonUI/**` — 57 files, partially covered by `CommonUI.test.js`
- `app/components/login/SplashScreen.js` — test fixed ✅
- `app/redux/sagas/loginInSaga.js` — test fixed ✅
- `app/components/closedloop/CentralizedRootCause/components/CollapsableView.js` — used by TicketCommentsUtils

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

## Files Still Below 90% Line Coverage (as of 2026-05-15)

All phases complete. Overall target (90%) achieved at 95.7%. These individual files remain below 90% but do not affect the overall metric significantly.

| File | Lines% | Uncov Lines | Note |
|------|--------|-------------|------|
| `Utils/AppTimeTracker.js` | 0% | 1–46 | No tests; low priority (analytics tracker) |
| `routes/routes.styles.js` | 0% | 1–37 | Style constants only; no logic to test |
| `takeaction/DropDownButton.js` | 49.3% | 13–48 | Used via `QPDropDownMenu`; direct tests deferred |
| `CentralizedRootCause/CentralizedRootCause.js` | 71.2% | 58–66, 121–201, 204–229, 246–248 | Complex Redux component; existing test covers happy path |
| `dashboard/cxDashboard/BenchmarkView.js` | 67.6% | 11–22 | GoalView branch; style-only code, low value to test |
| `CentralizedRootCause/components/CollapsableView.js` | 66.5% | 17–97 | Phase 0c deletion deferred — still in codebase |
| `components/login/Login.js` | 80.8% | 88–90, 157, 170–172, 206–270 | CLF auth + deep form branches |
| `routes/CommonScreen.js` | 77.1% | 178–369 | Navigation-only lazy imports; inherently hard to unit test |
| `components/SegmentText.js` | 80.6% | 9–17, 38–41 | iPad branch partially covered |
| `components/closedloop/ClosedloopCell.js` | 89.75% | 26–58, 107, 195–196 | Just below 90%; overdue + tag branches |

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
