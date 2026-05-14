# app/widgets — Shared UI Library

Reusable, presentational UI components shared across the whole app. Components here must have no direct knowledge of screens, navigation, or business logic — they receive data and callbacks purely through props.

---

## Directory Structure

```
widgets/
├── Core primitives
│   ├── Button.js               QPButton — primary action button
│   ├── TextField.js            QPTextField — form input (React Native Paper)
│   ├── CustomTextField.js      Custom animated text field (currently unused in app)
│   ├── SpaceBox.js             VerticalSpaceBox / HorizontalSpaceBox layout utilities
│   ├── ParentContainer.js      ParentContainer / ChildContainer layout shells
│   ├── TextLabel/TextLabel.js  TextLabel — configurable text with font/color props
│   ├── SendCommentButton.js    Send icon button for comments
│   └── QPWebView.js            WebView wrapper with loading state
│
├── Loaders (do not consolidate — each is a distinct contract)
│   ├── QPSpinner.js            Animated dot spinner — most widely used
│   ├── QPTransparentSpinner.js Dark overlay spinner
│   └── QPLoader.js             GIF-based loader (used in email send flow)
│
├── Calendars (kept for future use — do not delete without checking usages first)
│   ├── QPCalendar.js           Month picker with year dropdown
│   └── RangeCalendar.js        Date range picker modal (DatePicker body is pending)
│   └── HorizontalScaleBar.js   NPS visual scale bar (kept, unused externally)
│   └── qp-calendar/            Legacy custom calendar — do NOT refactor, complex internals
│
├── IconWidget/                 Small icon components wrapping PNGs
│   ├── DateFilterIcon.js
│   ├── PersonIcon.js
│   ├── ResponsesIcon.js
│   └── StatusIcon.js
│
├── QPBottomSheet/              Modal bottom sheet — barrel export pattern
│   ├── index.js                Re-exports QPBottomSheet + QPBottomSheetHeader
│   ├── QPBottomSheet.js
│   └── QPBottomSheetHeader.js
│
├── drop-down/                  Custom dropdown modal
│   ├── ModalDropdown.js        Functional dropdown with FlatList — only dropdown used
│   └── DropdownStyle.js        Shared styles for ModalDropdown
│
├── dashboardWidget/            Dashboard-specific display components
│   ├── CsatChart.js            CSAT donut chart (VictoryPie)
│   ├── CsatScoreLabel.js       CSAT score display (Mean or Top Box)
│   ├── CsatToggleButton.js     Toggle between CSAT display modes
│   ├── NpsGaugeChart.js        NPS gauge (AMCharts via WebView)
│   ├── DottedLine.js           Decorative horizontal dotted line
│   ├── LegendScoreView.js      Legend row: icon + score + count
│   ├── RenderInfo.js           Single info block with count
│   ├── RenderInfoContainer.js  Container for response info blocks
│   ├── RenderSegmentTitle.js   DashboardSegmentHeader — section title with tail
│   ├── ResponsesButton.js      Navigation button to Responses screen
│   ├── ScoreIndicatorIcon.js   Up/down caret for score change
│   ├── SmileyImageLabel.js     VictoryPie smiley label component
│   └── NPSIcon.js / NPSAnswerText.js  NPS sentiment display
│
└── closedloopWidget/           Ticket / closed-loop specific widgets
    └── ActivityText.js         HTML-rendered ticket activity (memoized, pure)
```

---

## Rules for Adding a Widget

1. **No redux, no navigation** — a widget must not `useSelector`, `useDispatch`, or call navigation APIs directly. Pass data and callbacks as props.
2. **One responsibility** — if a widget fetches AND renders, split the data logic into a helper function in the same file (see `NpsGaugeChart.js → buildGaugeConfig`).
3. **StyleSheet only** — all styles via `StyleSheet.create()`. No anonymous inline objects for static values.
4. **Named export convention** — widgets use `export default`; shared helpers use named exports.
5. **Tests** — every new widget gets a `.test.js` in the same directory.

---

## QPBottomSheet Barrel Export

Always import from the folder, not the file:

```js
// Correct
import QPBottomSheet from '../widgets/QPBottomSheet';

// Wrong — bypasses barrel export
import QPBottomSheet from '../widgets/QPBottomSheet/QPBottomSheet';
```

The barrel (`index.js`) exports both `QPBottomSheet` and `QPBottomSheetHeader`.

---

## "Kept but Unused" Files

These files have no external imports but are preserved intentionally:

| File | Reason kept |
|------|-------------|
| `QPCalendar.js` | May be needed for future date picker work |
| `RangeCalendar.js` | DatePicker body pending; shell is complete |
| `HorizontalScaleBar.js` | NPS scale visualization, may be used in reporting |
| `CustomTextField.js` | Alternative text field; evaluate vs TextField.js before using |
| `NPSAnswerText.js` | NPS text with sentiment colors; may be used in response detail |
| `CaretDownIcon.js` | Icon asset; check DateFilterIcon/StatusIcon patterns first |

Do not delete these without a product/design conversation.

---

## Test Coverage

All widget files have `.test.js` coverage (40 test suites, 212 tests). Test files live in the same directory as the source file.

| Suite | Coverage notes |
|-------|---------------|
| `Button.test.js` | press, disabled, buttonColor, testID |
| `TextField.test.js` | placeholder, label, events, password visibility |
| `CustomTextField.test.js` | controlled/uncontrolled, label animation, password toggle |
| `SpaceBox.test.js` | VerticalSpaceBox + HorizontalSpaceBox margins |
| `ParentContainer.test.js` | render smoke tests |
| `TextLabel/TextLabel.test.js` | text, children, color, numberOfLines, testID |
| `SendCommentButton.test.js` | press event, size, color, buttonStyle |
| `SendButton.test.js` | press event, size, color, style |
| `QPWebView.test.js` | render, QPSpinner shown during load |
| `QPSpinner.test.js` | render, spinnerText present/absent, props |
| `QPTransparentSpinner.test.js` | render, subText present/absent, props |
| `QPLoader.test.js` | render, spinnerText present/absent |
| `QPCalendar.test.js` | render, header, year dropdown, Pressable count |
| `RangeCalendar.test.js` | showCalendar flag, predefined options, custom mode, validation |
| `HorizontalScaleBar.test.js` | render smoke |
| `NPSAnswerText.test.js` | all sentiments, testID |
| `QPBottomSheet/index.test.js` | barrel export identity checks |
| `QPBottomSheet/QPBottomSheet.test.js` | show/hide, pan gesture |
| `drop-down/ModalDropdown.test.js` | defaultValue, disabled, RTL, style props |
| `dashboardWidget/*.test.js` | all dashboard widgets |
| `closedloopWidget/ActivityText.test.js` | RenderHTML, memo boundary |
| `IconWidget/*.test.js` | all icon widgets |

**Mock patterns used:**
- PNG/SVG assets: auto-resolved to `'test-file-stub'` via `fileMock.js`
- `react-native-animatable`: mocked per-test as passthrough View
- `react-native-render-html`: mocked per-test with `<Text testID="render-html">`
- `react-native-vector-icons/*`: mocked per-test as `'Icon'`
- `react-native-webview`: mocked per-test, calls `renderLoading`
- `qp-calendar/calendar`: mocked per-test as minimal wrapper

---

## Known Limitations

- **TextLabel operator precedence bug**: `fontWeight ?? Platform.OS === 'ios' ? ... : ...` has a subtle precedence issue — the `fontWeight` prop override path behaves incorrectly. The default (no `fontWeight` prop) works correctly. Fix before relying on the `fontWeight` prop.
- **RangeCalendar DatePicker**: `renderDatePicker()` renders an empty View — the DatePicker component was removed. Custom date range selection is non-functional until a date picker is re-integrated.
- **qp-calendar/**: Large custom implementation. Do not refactor. Treat as a black box.
