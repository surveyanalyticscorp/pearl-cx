# Memory Leak Hunt — CX App

> **How to use:** Run `/hunt-mem-leak` to start the next segment. Claude will hunt it, update this file, then stop. Run it again for the next segment.
> **Rule:** Never skip a segment. Never mark complete without both static analysis and a runtime note.

---

## Tool Stack

| Tool | Platform | Purpose |
|------|----------|---------|
| Flipper → Memory Profiler | Android | Heap snapshots, GC, retained objects |
| Xcode Instruments → Allocations / Leaks | iOS | Allocation traces, leak detection |
| React DevTools Profiler | Both | Component re-render & mount tracking |
| Hermes Sampling Profiler (via Flipper) | Android | CPU + closure retention |

---

## Known Leak Patterns Cheatsheet

### Listener & Subscription Patterns
- Missing `useEffect` cleanup return for `BackHandler`, `AppState`, `Keyboard`, `Dimensions` listeners
- Firebase/messaging listeners — `onMessage`, `onNotificationOpenedApp`, `onTokenRefresh`, `setBackgroundMessageHandler` all return unsubscribe functions; discarding the return value means the listener is never removed
- Wix Notifications `events().registerX()` returns a subscription object; must call `.remove()` on it — **different API from Firebase**
- Navigation listeners not removed on screen unmount

### Timer Patterns
- `setTimeout` / `setInterval` not cleared on unmount (`clearTimeout`, `clearInterval`)
- `InteractionManager.runAfterInteractions()` — must call `.cancel()` on the returned handle in the cleanup function

### Animation Patterns
- `Animated.loop()` not stopped on unmount — call `.stop()` in `useEffect` return

### Saga Patterns
- `eventChannel` or `stdChannel` created but never closed — channels must be closed in a `finally` block; an unclosed channel keeps the saga and its closure alive
- `takeEvery` spawns unbounded child tasks; if the root watcher fork is never cancelled, tasks accumulate across logout/login cycles
- Missing `finally` block — if a saga is cancelled externally (e.g. during logout), loading state flags will never reset, causing UI to appear frozen and holding references

### Component & Closure Patterns
- Promise chains that capture component state or `dispatch` after the component unmounts (stale closures)
- `console.log()` or analytics/Sentry calls inside render paths that inadvertently capture large object graphs as arguments
- Module-level variables or `useRef` values holding stale component references after unmount

### List & State Growth Patterns
- `FlatList` / `ScrollView` without `removeClippedSubviews` — off-screen cells stay fully in memory
- Redux arrays that grow unboundedly: paginated lists that append without pruning, notification lists, activity logs with no max size

---

## Segment Registry

| # | Segment | Key Files | Risk | Status | Date | Outcome |
|---|---------|-----------|------|--------|------|---------|
| 1a | Firebase SDK Listeners | `Utils/NotificationUtils.js`, `routes/appRouter.js` | 🔴 HIGH | ⬜ Not Started | — | — |
| 1b | Wix Notifications Listeners | `Utils/NotificationUtils.js`, `components/notifications/` | 🔴 HIGH | ⬜ Not Started | — | — |
| 2 | Root & App Entry | `index.js`, `routes/appRouter.js` | 🔴 HIGH | ⬜ Not Started | — | — |
| 3 | ClosedLoop Saga | `redux/sagas/ClosedLoopSaga.js` | 🔴 HIGH | ⬜ Not Started | — | — |
| 4 | ClosedLoop Screens | `components/closedloop/ClosedLoop.js`, `TicketDetails.js`, `TakeActionScreen.js`, `takeaction/` | 🟡 MEDIUM | 🔧 Partial | 2026-04-27 | Timer leak fixed in SendEmail.js — full screen audit pending |
| 5 | Dashboard & Charts | `components/dashboard/CxDashboard.js`, `ClosedLoopDashboard.js` | 🟡 MEDIUM | ⬜ Not Started | — | — |
| 6 | Navigation & Routing | `routes/appRouter.js`, `RootNavigation.js`, `RenderDrawer.js`, `DrawerContent.js` | 🟡 MEDIUM | ⬜ Not Started | — | — |
| 7 | Sagas — Dashboard, Feedback, Login, Notification | `redux/sagas/dashboardSaga.js`, `feedbackSaga.js`, `loginInSaga.js`, `notificationSaga.js` | 🟡 MEDIUM | ⬜ Not Started | — | — |
| 8 | Login & Auth Flow | `components/login/`, `routes/drawerContent/useLogoutProcess.js`, `useLoginPersistance.js` | 🟡 MEDIUM | ⬜ Not Started | — | — |
| 9 | Feedback & Responses | `components/feedback/` | 🟡 MEDIUM | ⬜ Not Started | — | — |
| 10 | Custom Hooks | `hooks/useNavigation.js`, `hooks/useSegmentList.js`, `hooks/useTicketSync.js`, `components/dashboard/hooks/useBackHandler.js` | 🟡 MEDIUM | ⬜ Not Started | — | — |
| 11 | Widgets & Animations | `widgets/AnimatedDotIndicator.js`, `widgets/QPBottomSheet.js`, `widgets/QPLoader.js` | 🟢 LOW | ⬜ Not Started | — | — |
| 12 | Settings & Account | `components/settings/`, `components/view/` | 🟢 LOW | ⬜ Not Started | — | — |
| 13 | Redux Reducers | `redux/reducer/` (14 files) | 🟢 LOW | ⬜ Not Started | — | — |
| 14 | Utils Layer | `Utils/` — prioritized subset first (see sub-priority below) | 🟢 LOW | ⬜ Not Started | — | — |
| 15 | Styles & Constants | `styles/`, `config/Constant.js` | 🟢 LOW | ⬜ Not Started | — | — |

### Segment 7 — Full Saga Watcher Reference

> All 57 watchers use `takeLatest` exclusively. No `eventChannel` or `stdChannel` found. Root saga uses `all([fork(watcherN), ...])` — forks run for the app lifetime, never explicitly cancelled.

**dashboardSaga.js** (5 watchers)

| Watcher | Action | Finally? | Note |
|---------|--------|----------|------|
| `watchGetDashboard` | `GET_DASHBOARD` | ❌ | — |
| `watchDataCount` | `GET_WELCOME_SCREEN_DATA` | ✅ | Only saga with finally — resets isLoading |
| `watchApploginCount` | `APP_LOGIN_COUNTER` | ❌ | — |
| `watchGetCLFBaseUrl` | `GET_CLF_BASE_URL` | ❌ | — |
| `watchGetGlobalSettings` | `SET_GLOBAL_SETTINGS` | ❌ | — |

**feedbackSaga.js** (5 watchers)

| Watcher | Action | Finally? | Note |
|---------|--------|----------|------|
| `watchGetPanelMember` | `GET_PANEL_MEMBER` | ❌ | — |
| `watchGetSurveyResponseDetails` | `GET_SURVEY_RESPONSE_DETAILS` | ❌ | — |
| `watchGetResponseTickets` | `GET_RESPONSE_TICKETS` | ❌ | — |
| `watchGetResponseDetailsByResponseId` | `GET_RESPONSE_DETAILS_BY_RESPONSEID` | ❌ | — |
| `watchFetchAllResponses` | `FETCH_ALL_RESPONSES` | ❌ | Fires `action.onSuccess/onError` callbacks — stale closure risk if caller unmounts |

**loginInSaga.js** (7 watchers)

| Watcher | Action | Finally? | Note |
|---------|--------|----------|------|
| `watchAuthenticatePanel` | `AUTHENTICATE_PANEL` | ❌ | — |
| `watchDoLogin` | `GET_LOGIN` | ❌ | Sets `global.baseUrl`, `global.bearerToken` — globals persist across sessions |
| `watchClfAuth` | `GET_BEARER_TOKEN` | ❌ | Sets `global.bearerToken` |
| `watchForgotPasswordLink` | `GET_RESET_PASSWORD_LINK` | ✅ | Resets isLoading in finally |
| `watchValidatePasswordLink` | `VALIDATE_RESET_PASSWORD_LINK` | ❌ | isLoading only reset in try |
| `watchUpdatePassword` | `UPDATE_PASSWORD` | ❌ | — |
| `watchLogout` | `LOGOUT` | ❌ | No finally — logout state may be inconsistent if cancelled mid-flight |

**notificationSaga.js** (2 watchers)

| Watcher | Action | Finally? |
|---------|--------|----------|
| `watchGetNotification` | `GET_NOTIFICATION` | ❌ |
| `watchReadNotification` | `READ_NOTIFICATION` | ❌ |

**ClosedLoopSaga.js** (44 watchers — ALL `takeLatest`, NO `finally` blocks)

Sub-priority audit order (most runtime-frequent first):

| Priority | Watcher | Action |
|----------|---------|--------|
| P1 | `watchGetClosedLoopTicketList` | `GET_CLOSED_LOOP_TICKET_LIST` |
| P1 | `watchGetClosedLoopTicketItem` | `GET_CLOSED_LOOP_TICKET_ITEM` |
| P1 | `watchGetDetractorTicketDetail` | `GET_CLOSED_LOOP_TICKET_DETAILS` |
| P1 | `watchSyncTickets` | `GET_TICKET_LIST_SYNC` |
| P2 | `watchGetClosedLoopTicketComments` | `GET_CLOSED_LOOP_TICKET_ITEM_COMMENTS` |
| P2 | `watchGetClosedLoopTicketActivity` | `GET_CLOSED_LOOP_TICKET_ITEM_ACTIVITY` |
| P2 | `watchPostTicketComment` | `ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS` |
| P2 | `watchPatchUpdateTicket` | `UPDATE_CLF_TICKET` |
| P2 | `watchSendEmail` | `SEND_EMAIL` |
| P2 | `watchGetEmailTemplates` | `GET_EMAIL_TEMPLATES` |
| P2 | `watchGenrateEmailDraft` | `GENERATE_EMAIL_DRAFT` |
| P2 | `watchGenerateRefinedEmailDraft` | `GENERATE_REFINE_EMAIL_DRAFT` |
| P3 | `watchGetrootCauseList` | `GET_ROOT_CASUES` |
| P3 | `watchUpdateRootCause` | `UPDATE_ROOT_CAUSE` |
| P3 | `watchGetCentralizdRootCause` | `CENTRALIZED_ROOT_CAUSE` |
| P3 | `watchUpdateCentralizedRootCause` | `UPDATE_CENTRALIZED_ROOT_CAUSE` |
| P3 | `watchPostCreateTicket` | `CREATE_CLF_TICKET` |
| P3 | `watchDeleteTickets` | `DELETE_TICKET` |
| P4 | remaining 26 watchers | less frequently triggered |

### Segment 14 — Utils Sub-Priority

| Priority | File | Reason |
|----------|------|--------|
| P1 | `NotificationUtils.js` | Known listener issues — partially covered in Segments 1a/1b |
| P1 | `AppTimeTracker.js` | AppState listener at app root |
| P2 | `ApiCallUtils.js` | Wraps network calls — stale closure risk |
| P2 | `DeviceUtil.js` | May hold device info refs |
| P3 | `TimeUtils.js` | Low risk — pure utility |
| P4 | All other files | Audit alphabetically, batch 5 per session |

---

## Regression Safety Log

> For every confirmed fix, fill in one entry below.

```
### Fix: [Short description]
- **Segment:** #N — [Segment name]
- **File(s) changed:** path/to/file.js
- **What was leaking:** [description of the pattern]
- **The fix:** [what was changed]
- **Test added:** [test file path and what the test asserts]
- **Verified on iOS:** ⬜ [date]
- **Verified on Android:** ⬜ [date]
- **Heap delta after fix:** [before retained size → after retained size]
```

### Fix: clearTimeout cleanup in SendEmail success/error useEffects
- **Segment:** #4 — ClosedLoop Screens
- **File(s) changed:** `app/components/closedloop/sendEmail/SendEmail.js`
- **What was leaking:** Two `useEffect` hooks called `setTimeout` without storing the timer ID, so `clearTimeout` was never called. If the bottom sheet was dismissed while a timer was in flight, the callback still fired — calling `navigation.goBack()`, `dispatch()`, and `setOverlayStatus()` on an unmounted component.
- **The fix:** Store timer ID in `const timer = setTimeout(...)` and return `() => clearTimeout(timer)` from each `useEffect`.
- **Test added:** —
- **Verified on iOS:** ⬜
- **Verified on Android:** ⬜
- **Heap delta after fix:** not measured

---

## Daily Hunt Log

---

### Day 0 — Setup & Baseline (2026-04-22)

**Baseline Session — Do This Before Any Code Changes**

Before touching any segment, record a cold-start heap snapshot:
1. Launch app on device/simulator — no interactions
2. Wait for home screen to fully render
3. Force GC (Flipper → Memory → GC button, or Xcode Instruments)
4. Take heap snapshot — label it `baseline-cold-start`
5. Record retained object count and total heap size here:

```
Baseline heap size:     _____ MB
Retained object count:  _____
Device:                 _____
Date:                   _____
```

This is the anchor for all future before/after comparisons.

---

**Pre-Identified Findings (from initial static scan)**

#### Finding 1 — Firebase SDK Listeners Not Unsubscribed
- **File:** `app/Utils/NotificationUtils.js`
- **Pattern:** `messaging().onMessage()` and `messaging().onNotificationOpenedApp()` return unsubscribe functions. The return values are discarded — listeners are never removed. Every app re-init stacks a new listener on top of the old one.
- **Fix direction:** Store return values → call them on cleanup. Firebase API: `const unsub = messaging().onMessage(...); return () => unsub();`
- **Status:** `⬜ Not Fixed` — will be addressed in Segment 1a

#### Finding 2 — Wix Notifications Listeners Not Removed
- **File:** `app/Utils/NotificationUtils.js`
- **Pattern:** Three `Notifications.events().registerX()` calls (background received, foreground received, opened) return subscription objects. Objects are discarded, `.remove()` is never called.
- **Fix direction:** Store subscription objects → call `.remove()` on cleanup. Wix API is different from Firebase — it's `.remove()` not a plain function call.
- **Status:** `⬜ Not Fixed` — will be addressed in Segment 1b

#### Finding 3 — Recursive setTimeout Polling Loop, No Exit Guard
- **File:** `app/Utils/NotificationUtils.js` — `actionOnNotification()` function
- **Pattern:** `const checkNavigation = () => { if (ref) resolve(); else setTimeout(checkNavigation, 100); }` — if navigation ref never becomes available, this loop runs indefinitely with no exit guard, max retry count, or cleanup.
- **Fix direction:** Add a retry counter or a maximum wait time; reject the promise and stop the loop if the limit is exceeded.
- **Status:** `⬜ Not Fixed` — will be addressed in Segment 1a

#### Finding 4 — highchart.html setInterval (CLEARED)
- **File:** `app/components/dashboard/highchart.html` (~line 13–30)
- **What it does:** Polls for `WebViewBridge` availability every 200ms, sends `getData` to the bridge when found
- **clearInterval present?** YES — `clearInterval(interval)` called immediately on first success (self-terminating)
- **WebView lifecycle:** Lives for the lifetime of the Dashboard screen; unmounted when user leaves the stack
- **Decision:** No action needed. Interval is bounded; WebView is properly unmounted. Documenting here to avoid re-investigating.
- **Status:** `✅ Cleared — Not a Leak`
