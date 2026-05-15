# ClosedLoop Module

Ticket management section of the CX app. Shows a filterable, paginated list of tickets. Managers can view details, update status/priority/assignee, add comments, resolve root causes, and contact customers via email.

---

## Navigation & Lifecycle

ClosedLoop is registered in **three separate stacks** — always check which entry point the user is coming from:

| Stack file | Screen name | Entry point |
|---|---|---|
| `app/routes/ClosedLoopStack.js` | `Closedloop` | Drawer menu |
| `app/routes/DashboardStack.js` | `dashboard_to_closed_loop` | Dashboard tile tap |
| `app/routes/DashboardModalStack.js` | `dashboard_to_closed_loop` | Dashboard modal flow |

**Critical lifecycle fact:** All three registrations use a stack navigator. When the user navigates back, ClosedLoop is **popped and unmounted**. On the next visit a fresh instance mounts. Every `useEffect` fires again on mount — this has caused bugs before (see Pitfalls section).

Ticket detail screen is `TicketDetails` — navigated to with `navigation.navigate('TicketDetails', { ticketItem, prevScreen })`.

---

## File Map

### Root level
| File | Purpose |
|---|---|
| `ClosedLoop.js` | Entry screen. Owns the filter trigger, search bar, ticket list, FAB. Wires `useTicketFilter` to Redux and navigation. |
| `ClosedLoopTicketList.js` | FlatList wrapper — pagination, pull-to-refresh, empty state, loading state. |
| `ClosedloopCell.js` | Individual ticket row in the list. |
| `TicketCard.js` | Card layout used inside `ClosedloopCell`. |
| `TicketDetails.js` | Full ticket detail screen — tabs for Overview, Comments, Root Cause, Activity. |
| `TakeActionScreen.js` | Bottom sheet screen for updating ticket status/priority/assignee inline. |
| `TicketComments.js` | Comment thread UI with add-comment input. |
| `TicketCommentsUtils.js` | Helpers for comment formatting and rendering. |
| `DeleteTicketModal.js` | Confirmation modal for deleting a ticket. |
| `NoTicketFound.js` | Empty state when filter returns no results (shows reset button). |
| `NoDataFound.js` | Generic empty state. |
| `EmptyVIew.js` | Alternate empty placeholder. |
| `RenderRootCauseItem.js` | Root cause chip/row renderer. |
| `RenderSegmentItem.js` | Segment picker row renderer. |
| `ResponseTicketCell.js` | Ticket cell variant used inside response detail. |
| `closeloop.style.js` | Shared StyleSheet for the module root. |

### `hooks/`
| File | Purpose |
|---|---|
| `hooks/useTicketFilter.js` | **Core filter hook.** Manages `filterState` (API params) and `filterData` (UI checkbox state). Restores from Redux on mount, saves on apply, clears on reset. See Filter System section. |

### `takeaction/`
| File | Purpose |
|---|---|
| `FilterTickets.js` | Full-screen filter sheet — status, priority, type, AI tags, "show my tickets" toggle. Navigated to as `TicketFilter`. |
| `FilterSection.js` | Reusable checkbox list section used inside `FilterTickets`. |
| `AITagsFilterSection.js` | AI tags checkbox section — reads `state.dashboard.ticketTags` from Redux. |
| `AITagsChipList.js` | Chip list display for selected AI tags. |
| `ShowMyTicketsFilter.js` | "Show only my tickets" toggle row. |
| `QPBottomSheet` / `QPBottomSheetHeader` | **Moved to `app/widgets/QPBottomSheet/`.** Import: `import {QPBottomSheet, QPBottomSheetHeader} from '../../../widgets/QPBottomSheet'`. |
| `SelectStatus.js` | Status picker bottom sheet. |
| `SelectPriority.js` | Priority picker bottom sheet. |
| `SelectSorting.js` | Sort options bottom sheet. |
| `SelectSegment.js` | Segment picker bottom sheet. |
| `SelectTicketOwner.js` | Assignee picker bottom sheet. |
| `TIcketTakeAction.js` | Orchestrates the take-action bottom sheet flow. |
| `DropDownButton.js` / `QPDropDownMenu.js` | Dropdown UI widgets. Shared with `sendEmail/`. |
| `PriorityItem.js` / `StatusItem.js` | Individual picker row items. |
| `AiTagsFilter.js` | Older AI tags filter (check if still used before modifying). |

### `sendEmail/`
All Action Email feature files. See `sendEmail/CLAUDE.md` for full details.

| File | Purpose |
|---|---|
| `SendEmail.js` | Main compose screen. Routes: `sendEmail`. |
| `ActionEmailHistory.js` | Prior email history screen. Route: `actionEmailHistory`. |
| `AIEmailDraftModal.js` | AI draft generation modal content. |
| `RefineOptionsSheet.js` | Tone/intent chip picker for refining AI drafts. |
| `SelectEmailTemplate.js` | Template list inside the template bottom sheet. |
| `InsertLinkModal.js` | Modal for inserting a hyperlink into the rich editor. |
| `EmailComposerBody.js` | `KeyboardAwareScrollView` with all compose-area sub-components. |
| `EmailTemplateSheet.js` / `AIEmailDraftSheet.js` | Bottom sheet wrappers for template picker and AI draft flow. |
| `EmailEditorContext.js` | React context providing `blurEditor` to child components. |
| `hooks/useSendEmail.js` | Handles email submission with validation. |
| `hooks/useEmailDraft.js` | Manages AI draft state and refine interactions. |
| `hooks/useDraftGeneration.js` | Dispatches AI draft/refine actions, tracks loading. |
| `hooks/useEmailBody.js` | Body state management (`subject`, `emailBody`, `attachments`). |
| `hooks/useKeyboardState.js` | Keyboard visibility and height for toolbar positioning. |
| `hooks/useEmailScreenActions.js` | Orchestrates overlays, bottom sheets, template/AI draft actions. |

### `takeaction/closedLoopCell/`
| File | Purpose |
|---|---|
| `AssigneeUI.js` | Assignee avatar + name display inside ticket cell. |
| `OverdueBar.js` | Red overdue indicator bar. |

### `TicketOverview/`
| File | Purpose |
|---|---|
| `TicketOverview.js` | Overview tab — description, status, priority, assignee, contact. |
| `ticket.overview.style.js` | Styles for the overview tab. |
| `hooks/useUpdateTicket.js` | Handles status/priority/assignee update API calls. |
| `hooks/useDeleteAlert.js` | Manages the delete confirmation alert. |
| `components/` | ~15 small sub-components (StatusView, PriorityView, AssigneeBottomSheet, ContactView, DeleteView, etc.). Each owns its own styles. |

### `TicketRootCause/`
| File | Purpose |
|---|---|
| `TicketRootCause.js` | Root cause tab — switches between old and centralized flows. |
| `CentralizedRootCause/CentralizedRootCause.js` | Centralized root cause UI with tag selection. |
| `CentralizedRootCause/AskWhy.js` | "Ask why" follow-up input. |
| `OldRootCause.js` | Legacy root cause flow (kept for backwards compat). |
| `CustomeRootCause.js` | Custom (free-text) root cause entry. |
| `hooks/useRootCauses.js` | Fetches and manages root cause list state. |
| `hooks/useRootActions.js` | Handles root cause submission. |
| `TagViewItem.js` | Tag chip in root cause selection. |
| `utils.js` | Root cause utility functions. |

### `TicketActivity/`
| File | Purpose |
|---|---|
| `TicketActivity.js` | Activity log tab — sorted list of ticket history events. |
| `hooks/useSorting.js` | Manages sort direction for the activity list. |
| `ticketActivity.style.js` | Styles. |

### `CentralizedRootCause/` (root level duplicate — verify usage)
| File | Purpose |
|---|---|
| `CentralizedRootCause.js` | May be an older version — check import graph before editing. |

### `ticketCard/`
Sub-components of `TicketCard.js`:

| File | Purpose |
|---|---|
| `TopRow.js` | Ticket ID, type icon, date. |
| `TopRowIcon.js` | Icon for ticket type. |
| `BottomRow.js` | Assignee, priority, overdue indicator. |
| `StatusPill.js` | Colored status badge. |
| `CommentText.js` | Latest comment preview. |

### `ui/`
Shared UI primitives used across the module:

| File | Purpose |
|---|---|
| `SearchBox.js` | Search input with clear button. Used in `ClosedLoop.js`. |
| `Tags.js` | Tag chip list display. |
| `IconAndTitleText.js` | Icon + label row. |
| `ShowTitleAndText.js` | Label + value display row. |
| `ShowTitleAndDropdown.js` | Label + dropdown trigger row. |
| `RenderPhoneInput.js` | Phone number input field. |

---

## Redux Layer

### Actions
| File | Covers |
|---|---|
| `app/redux/actions/dashboard.actions.js` | `getClosedLoopTicketList`, `getClosedLoopOwnerDetails`, segment/feedback actions |
| `app/redux/actions/closedloop.actions.js` | All ticket mutations, email, root cause, tags, filter persistence (`saveTicketFilterData`, `clearTicketFilterData`), delete, sync |

### Reducer
**`app/redux/reducer/DashboardReducer.js`** — all closedloop state lives here under `state.dashboard.*`

Key keys used by this module:

| Key | Type | Purpose |
|---|---|---|
| `ticketList` | `Array` | Current page of tickets shown in list |
| `ticketDetails.pagerOptions` | `Object` | Pagination — `totalCount` used for load-more check |
| `ticketFilter` | `Object \| null` | **Persisted filter UI state.** `null` = no active filter. Set by `saveTicketFilterData`, cleared by `clearTicketFilterData`. Shape: `{ status[], priority[], type[], assignToId }` |
| `ticketTags` | `Array` | AI tag list with `isChecked` flags. Persists across navigation. Cleared by `clearTagFilter`. |
| `ownerDetails.owners` | `Array` | Owner list for the assignee filter. Rebuilt each session. |
| `ticketDeleteStatus` | `Object` | `{ status: 'success' \| 'default' }` — watched in `ClosedLoop.js` to trigger refresh. |
| `createTicketResponse` | `Object` | `{ message }` — shows success flash after ticket creation. |

### Saga
**`app/redux/sagas/ClosedLoopSaga.js`** — all async ticket operations.

Key watchers:

| Watcher | Trigger action | What it does |
|---|---|---|
| `watchGetClosedLoopTicketList` | `GET_CLOSED_LOOP_TICKET_LIST` | Fetches paginated ticket list |
| `watchGetClosedLoopOwnerDetails` | `GET_CLOSED_LOOP_OWNER_DETAILS` | Fetches assignable owners for filter |
| `watchGetClosedLoopTicketItem` | `GET_CLOSED_LOOP_TICKET_ITEM` | Fetches single ticket detail |
| `watchGetClosedLoopTicketComments` | `GET_CLOSED_LOOP_TICKET_COMMENTS` | Fetches comment thread |
| `watchSyncTickets` | `GET_TICKET_LIST_SYNC` | Syncs ticket list changes |
| `watchGetDetractorTicketDetail` | `GET_CLOSED_LOOP_TICKET_DETAILS` | Fetches ticket with response context |

All sagas use `ApiHandler.js` — never use raw `fetch`.

---

## Filter System

### Two parallel representations

| Object | Where | Purpose |
|---|---|---|
| `filterData` | Hook local state + Redux `ticketFilter` | UI state — arrays of `{ title, id, isChecked }`. Drives checkbox rendering in `FilterTickets`. |
| `filterState` | Hook local state | API params — comma-separated ID strings. Sent directly to `getClosedLoopTicketList`. |

`filterState` is always derived from `filterData` via `createFilterState(filterData, getIds)` in `app/Utils/TicketUtils.js`.

### `useTicketFilter` hook (`hooks/useTicketFilter.js`)

**On mount:** Reads `state.dashboard.ticketFilter` (saved filterData). If present, restores both `filterData` (UI checkboxes) and `filterState` (API params). Also reads `state.dashboard.ticketTags` to restore the `tags` field — **required** by `createFilterState`, which calls `.filter()` on `item.tags` and will crash if it is `undefined`.

**`applyFilter(item)`:** Updates local state + dispatches `saveTicketFilterData({ status, priority, type, assignToId })` to Redux.

**`resetFilter(range?)`:** Resets local state to defaults, dispatches `clearTicketFilterData()` + `clearTagFilter()`. Accepts optional `range_` to set fresh dates (used when called from the segment-change effect).

**`resetFilterState(range)`:** Only updates dates and pageNumber in `filterState` — does NOT clear filter selections. Used by `onRefresh`.

### Filter persistence flow

```
User applies filter
  → FilterTickets calls onPressHandler(item, 'apply')
  → ClosedLoop.handleAction → applyFilter(item)
  → useTicketFilter: setFilterData + setFilterState + dispatch(saveTicketFilterData)
  → Redux: state.dashboard.ticketFilter = { status[], priority[], type[], assignToId }

User navigates away → ClosedLoop unmounts (hook state lost)
  → Redux ticketFilter remains intact

User navigates back → ClosedLoop mounts fresh
  → useTicketFilter reads savedFilterData from Redux
  → filterData and filterState initialized from saved state
  → makeAPICall fires with restored filterState ✓
```

---

## Key Data Shapes

### `filterState` (sent to API)
```js
{
  feedbackApiKey: string,
  status: '',            // comma-separated IDs e.g. "0,2"
  priority: '',          // comma-separated IDs
  assignToId: string,    // JSON.stringify(userID) or ''
  userId: string,        // JSON.stringify(userID)
  pageNumber: 1,
  perPage: 100,
  fromDate: 'YYYY-MM-DD',
  toDate: 'YYYY-MM-DD',
  type: '',              // comma-separated IDs
  search: '',
  tags: '',              // comma-separated tag names
}
```

### `filterData` (UI checkbox state)
```js
{
  status:    [{ title: 'New',    id: 0, isChecked: false }, ...],  // 4 items
  priority:  [{ title: 'Low',    id: 0, isChecked: false }, ...],  // 4 items
  type:      [{ title: 'Manual ticket', id: 0, isChecked: false }, ...],  // 2 items
  managers:  [{ ownerID, isChecked, ...ownerFields }],  // dynamic — NOT persisted
  assignToId: string,   // JSON.stringify(userID) or ''
  userId: string,       // JSON.stringify(userID) — reference copy, never changes
}
```

### `ticketFilter` (Redux — persisted across navigation)
```js
// state.dashboard.ticketFilter
{
  status:    [...],   // same shape as filterData.status
  priority:  [...],
  type:      [...],
  assignToId: string,
}
// null = no active filter
```

### `ticketTags` (Redux — separate from ticketFilter)
```js
// state.dashboard.ticketTags
[{ id, name, isChecked }]
// Cleared by clearTagFilter() — persists across navigation naturally
```

---

## API Flow

```
ClosedLoop.makeAPICall()
  → dispatch(getClosedLoopTicketList(authToken, filterState, feedbackID, segmentID))
      (dashboard.actions.js — action type GET_CLOSED_LOOP_TICKET_LIST)
  → ClosedLoopSaga.fetchClosedLoopTicketList(action)
  → ApiHandler.getCXDetractorTicket(token, param, feedbackID, segmentID)
  → WebServiceHandler.postNew(url, body)
  → DashboardReducer: CLOSED_LOOP_TICKET_LIST_RECEIVED → state.dashboard.ticketList
```

---

## Known Pitfalls / Hard-Won Lessons

### 1. `currentSegment` effect fires on every mount — use `isFirstRender` ref
```js
// ClosedLoop.js
const isFirstRender = useRef(true);

useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return;   // skip on mount — only reset when segment actually changes
  }
  resetFilter(range);
}, [currentSegment]);
```
Without this guard, every navigation back to ClosedLoop triggers `resetFilter`, wiping the persisted filter immediately after it was restored.

### 2. `createFilterState` requires a `tags` field
`createFilterState(item, getIds)` in `TicketUtils.js` calls `getNames(item.tags)` which does `items.filter(...)`. If `item.tags` is `undefined` the app crashes. Always pass `tags`:
```js
createFilterState({ ...savedFilterData, tags: ticketTags ?? [] }, getIds)
```

### 3. `managers[]` is never persisted — always rebuilt from `ownerDetails`
The owners list is dynamic per session. Do not attempt to save/restore it from Redux — it comes from `state.dashboard.ownerDetails.owners` via the `owners` useEffect in `useTicketFilter`.

### 4. Bottom sheet content clipping
`QPBottomSheet` uses `maxHeight: 80%` by default — overflowing content is **clipped**, not scrolled. For sheets with lists or chip sections, pass `bottomSheetHeight="X%"` and add `flex: 1` to the content container. Keep action buttons outside `ScrollView`.

### 5. Search text is intentionally not persisted
Only filter selections persist across navigation. Search text always resets to empty on remount.

---

## Feature Log

| Date | Change |
|---|---|
| 2026-05-15 | **Comprehensive test suite expansion — 95.69% line coverage** — Phases 3–7 of the coverage plan completed. New/updated test files across the closedloop module: `TicketCommentsUtils.test.js` (22 new tests: `CommentBox` dispatch, `CommentParentItem` reply, `ShowFlatList` empty/populated states), `QPDropDownMenu.test.js` (6 tests: visibility, item press, overlay close, position styles), `AITagsChipList.test.js` (6 tests: chip rendering, count chip, callbacks), `AIEmailDraftModal.test.js` (6 tests: loading state, draft text, Insert/Regenerate/Refine presses), `TicketActivity.test.js` (sort dropdown open/close/select via `QPDropDownMenu`), `TopRowIcon.test.js` (both `hasPanelMember` branches), `TicketOverviewContainer.test.js` (loading/non-loading), `NPSScoreComponent.test.js` (score, null, undefined), `useActionHandler.test.js` (promptCall and promptSms branches). Final coverage: **Lines 95.69%, Branches 84.68%, Functions 89.91%** (239 suites, 1916 tests). |
| 2026-05-15 | **Test suite fixed — 90% coverage reached** — `ClosedLoop.test.js` brought to 44/44 passing: fixed `SearchBox` import (moved to `./ui/SearchBox`), fixed `ClosedLoopTicketList` mock to render `closedloop-cell` testIDs with `onPressHandler`, added `tags: []` to `createFilterState` test items (required by `getNames(item.tags)` — see Known Pitfall #2). Overall project line coverage hit **90.53%**. |
| 2026-05-13 | **QPBottomSheet widget move** — `QPBottomSheet.js`, `QPBottomSheetHeader.js`, and their tests moved from `takeaction/` to `app/widgets/QPBottomSheet/`. Barrel export (`index.js`) added. All 14 consumer files updated to named imports: `import {QPBottomSheet, QPBottomSheetHeader} from '../../../widgets/QPBottomSheet'`. 100% test coverage achieved across all three files. |
| 2026-05-13 | **Action Email refactor** — All Action Email feature files moved from `takeaction/` and `takeaction/sendEmail/` to a new top-level `sendEmail/` directory. `CommonScreen.js` updated (import paths changed, legacy `SelectEmailTemplate` route removed). `sendEmail/CLAUDE.md` created. `DropDownButton` remains in `takeaction/` as a shared utility. |
| 2026-05-11 | **Filter Persistence** — Filter selections (status, priority, type, AI tags, assignToId) now persist across navigation via `state.dashboard.ticketFilter` in Redux. New actions: `saveTicketFilterData`, `clearTicketFilterData`. Filter resets on segment change. Fixed crash caused by `currentSegment` useEffect firing on mount (added `isFirstRender` ref guard in `ClosedLoop.js`). Fixed crash caused by missing `tags` field when calling `createFilterState` during filter restoration. |
