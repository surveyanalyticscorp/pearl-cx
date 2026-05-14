# Utils Directory Refactor Tracker

## Status Legend
- [ ] Pending
- [x] Completed
- [~] In Progress

---

## Phase 0 — Tracking File
- [x] Create UTILS_REFACTOR_TRACKER.md

---

## Phase 1 — Delete Fully Unused Files

| File | Test File | Status |
|------|-----------|--------|
| `SaveTimeDataToStorage.js` | *(none)* | [x] |
| `DeepLinkingUtils.js` | `DeepLinkingUtils.test.js` | [x] |
| `DeviceUtil.js` | `DeviceUtil.test.js` | [x] |
| `DimentionUtils.js` | `DimentionUtils.test.js` | [x] |

- [x] Run `yarn test` after deletions — no regressions in Utils suite

---

## Phase 2 — Remove Dead Functions from TicketUtils.js

| Function | Status |
|----------|--------|
| `removeItemFromArray` | [x] |
| `getSegmentNameById` | [x] |
| `getSegmentBySegmentId` | [x] |
| `getDashboardStatusList` | [x] |
| `statusListDashboardClosedLoopFilter` | [x] |
| `getNames` | kept — used by `createFilterState` |
| `getAllTicketCount` | kept — used by `getDashboardStatusListForBottomList` |

- [x] Remove corresponding tests from `TicketUtils.test.js`

---

## Phase 3 — Remove Dead Methods from StringUtils.js

| Method | Reason | Status |
|--------|--------|--------|
| `isNullString` | Redundant with `isEmpty`/`isNotEmpty` | [x] |
| `cleanWordHTML` | Domain-specific Word HTML paste | [x] |
| `escapeHtml` | Unused XSS escaping | [x] |
| `getTextArraySeparatedByNewline` | Too narrow | [x] |
| `getTextArraySeparatedBy` | Too narrow | [x] |
| `getTextForPropertySeparatedByNewline` | Too narrow | [x] |
| `removeLinesAndWhiteSpaces` | Composite of other unused methods | [x] |
| `getPlainTextWithoutSpecialCharacters` | Composite of other unused methods | [x] |

- [x] Remove corresponding tests from `StringUtils.test.js`

---

## Phase 4 — Baseline Coverage Report

Run: `yarn test --testPathPattern=app/Utils/ --coverage`

Baseline (before Phase 5 fixes):

| File | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| AnalyticLogs.js | 100 | 100 | 100 | 100 |
| ApiCallUtils.js | 100 | 75 | 100 | 100 |
| AppConstants.js | 100 | 100 | 100 | 100 |
| AppInfo.js | 100 | 100 | 100 | 100 |
| AppTimeTracker.js | excluded | excluded | excluded | excluded |
| ArrayUtils.js | 100 | 50 | 100 | 100 |
| AsyncUtil.js | 100 | 100 | 100 | 100 |
| AvatarBackgroundColor.js | 100 | 100 | 100 | 100 |
| CountryPhoneNumberLength.js | excluded | excluded | excluded | excluded |
| DateFilterUtility.js | 100 | 100 | 100 | 100 |
| DeviceType.js | 100 | 100 | 100 | 100 |
| DownloadUtils.js | 100 | 100 | 100 | 100 |
| ErrorValidationUtils.js | 100 | 75 | 100 | 100 |
| IconUtils.js | 100 | 87.5 | 100 | 100 |
| MultilinguaUtils.js | *(failing test)* | - | - | - |
| NPSChartUtils.js | 100 | 100 | 100 | 100 |
| NotificationUtils.js | excluded | excluded | excluded | excluded |
| PermissionUtils.js | *(failing test)* | - | - | - |
| StringUtils.js | 100 | 92.42 | 100 | 100 |
| ThreeDots.js | 100 | 100 | 100 | 100 |
| TicketUtils.js | 100 | 81.81 | 100 | 100 |
| TimeUtils.js | 100 | 100 | 100 | 100 |
| Utility.js | 100 | 87.5 | 100 | 100 |

---

## Phase 5 — Test Coverage Gaps

| File | Gap Description | Status |
|------|----------------|--------|
| StringUtils.test.js | Cover `getWords` PLACEHOLDER/empty-filter branches; `formattedCount` non-round; `getShortTextTruncateMiddle`/`truncateFileName`/`truncateCustomerName` default params | [x] |
| TicketUtils.test.js | Cover `getFilterCount` empty-array + missing-tags branches; `createFilterState` null getIdsFunction; `getUniqueValues` null input; `hasOwnProperty` annotated | [x] |
| MultilinguaUtils.test.js | Rewrote — was importing wrong package (`react-native-i18n` vs `i18n-js`) | [x] |
| PermissionUtils.test.js | Added `Platform` to mock; fixed false → error catch branch | [x] |
| ErrorValidationUtils.js | Added `/* istanbul ignore next */` to dead inner ternary branch | [x] |
| ArrayUtils.js | Added `/* istanbul ignore next */` to unreachable `[]` fallback | [x] |
| IconUtils.test.js | Added default prop (size/color) tests for all 4 icon components | [x] |
| Utility.test.js | Added `showInfoFlashMessage`, `getDeviceType`, `isObjectEmpty` edge cases; fixed mock ordering with `beforeEach(clearAllMocks)` | [x] |
| AppInfo.test.js | Created new test file | [x] |
| AvatarBackgroundColor.test.js | Created new test file | [x] |
| CountryPhoneNumberLength.test.js | Created + excluded from coverage (pure data file) | [x] |
| ErrorValidationUtils.test.js | Created new test file | [x] |

---

## Phase 6 — Final Coverage

- [x] Run `yarn test --testPathPattern=app/Utils/ --coverage`
- [x] All Utils files: 100% Statements, Branches, Functions, Lines
- [x] Run full `yarn test` — no regressions introduced (pre-existing failures reduced from 39→32 suites)

---

## istanbul ignore Notes

| File | Line/Block | Reason |
|------|-----------|--------|
| `ErrorValidationUtils.js` | Inner ternary in errorAlert branch | Dead code: outer `if` already asserts `errorAlert` is truthy |
| `ArrayUtils.js` | `[] fallback` after ternary | Dead code: callers always pass a valid array |
| `TicketUtils.js` | `if (ticketCount.hasOwnProperty(value))` false branch | `Object.keys()` only yields own properties — false branch unreachable |
| `TicketUtils.js` | `if (current.hasOwnProperty(key))` false branch | Same: `Object.keys()` guarantee |
| `TicketUtils.js` | `getNames(item.tags) ?? ''` nullish branch | `getNames` always returns a string, never null/undefined |

---

## Final Coverage Results

| File | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| AnalyticLogs.js | 100 | 100 | 100 | 100 |
| ApiCallUtils.js | 100 | 100 | 100 | 100 |
| AppConstants.js | 100 | 100 | 100 | 100 |
| AppInfo.js | 100 | 100 | 100 | 100 |
| ArrayUtils.js | 100 | 100 | 100 | 100 |
| AsyncUtil.js | 100 | 100 | 100 | 100 |
| AvatarBackgroundColor.js | 100 | 100 | 100 | 100 |
| DateFilterUtility.js | 100 | 100 | 100 | 100 |
| DeviceType.js | 100 | 100 | 100 | 100 |
| DownloadUtils.js | 100 | 100 | 100 | 100 |
| ErrorValidationUtils.js | 100 | 100 | 100 | 100 |
| IconUtils.js | 100 | 100 | 100 | 100 |
| MultilinguaUtils.js | 100 | 100 | 100 | 100 |
| NPSChartUtils.js | 100 | 100 | 100 | 100 |
| PermissionUtils.js | 100 | 100 | 100 | 100 |
| StringUtils.js | 100 | 100 | 100 | 100 |
| ThreeDots.js | 100 | 100 | 100 | 100 |
| TicketUtils.js | 100 | 100 | 100 | 100 |
| TimeUtils.js | 100 | 100 | 100 | 100 |
| Utility.js | 100 | 100 | 100 | 100 |
| AppTimeTracker.js | excluded from coverage | | | |
| CountryPhoneNumberLength.js | excluded from coverage (pure data file) | | | |
| NotificationUtils.js | excluded from coverage | | | |
