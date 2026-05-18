# patterns.md

# Seed file — agent will append new discoveries automatically.

---

## Test patterns

### Pure UI (no Redux)

```js
import {render} from '@testing-library/react-native';
const {getByText} = render(<Component prop="value" />);
expect(getByText('...')).toBeTruthy();
```

### Redux-connected component

```js
import configureStore from 'redux-mock-store';
const store = mockStore({ global: {authToken: 'tok'}, dashboard: {...} });
render(<Provider store={store}><Component /></Provider>);
```

### Hook

```js
import {renderHook, act} from '@testing-library/react-native';
const {result} = renderHook(() => useMyHook(), {
  wrapper: ({children}) => <Provider store={store}>{children}</Provider>,
});
act(() => result.current.action());
expect(result.current.state).toBe(expected);
```

### Saga

```js
import {runSaga} from 'redux-saga';
jest.mock('../../api/WebServiceHandler');
const dispatched = [];
await runSaga(
  {dispatch: a => dispatched.push(a)},
  sagaWorker,
  action,
).toPromise();
expect(dispatched.some(a => a.type === SUCCESS_TYPE)).toBe(true);
```

### Navigation-dependent component

```js
// Always provide route.params or the component will crash on mount
const mockRoute = {params: {ticketId: '123'}};
render(
  <Provider store={store}>
    <Component route={mockRoute} />
  </Provider>,
);
```

---

## Known import path fixes

| File                    | Wrong                                                                        | Correct                       |
| ----------------------- | ---------------------------------------------------------------------------- | ----------------------------- |
| `Feedback.js`           | `../widgets`                                                                 | `../../widgets/QPBottomSheet` |
| `Login.js` action mocks | two separate mocks for `../../redux/actions/index` and `../../redux/actions` | merge into one mock           |

---

## Known mock shapes

| Module                                                         | How to mock                                                   |
| -------------------------------------------------------------- | ------------------------------------------------------------- |
| `getClfAuth` / `doLogin`                                       | `jest.fn().mockReturnValue({})` — plain object, NOT a promise |
| `userInfo.emailAddress` in `Login.js:callClfAuth()`            | use optional chaining `userInfo?.emailAddress`                |
| `mockDashboardData` + `mockTicketStatusCounts`                 | must be defined as constants in `CxDashboard.test.js`         |
| `TakeActionButton` / `ContactView` in `TicketOverview.test.js` | mock assertions must match actual prop signatures             |
| `SearchBox` in `ClosedLoop.test.js`                            | requires explicit import fix                                  |
| `ClosedLoopTicketList`                                         | mock the whole module, not individual exports                 |
| `goal_icon.svg` / `DottedLine` in `BenchmarkView.test.js`      | must be mocked — jest can't process SVG imports               |

---

## CommonUI mock — components to include

When a test fails with "element type is invalid" for a UI primitive, add it here:

```js
jest.mock('path/to/CommonUI', () => ({
  RadioButtonCheckbox: () => null,
  RenderStatusIcon: () => null,
}));
```

Known required: `RadioButtonCheckbox`, `RenderStatusIcon`.

---

## testID renames (do not use old values)

| Component                           | Old testID          | Current testID              |
| ----------------------------------- | ------------------- | --------------------------- |
| `ClosedLoopDashboard` filter button | `icon-button`       | `on-press-filter-icon`      |
| `NPSScoreView` wrapper              | _(various)_         | `nps-score-view`            |
| `RenderSegmentDashboardData`        | `render-info-title` | _(removed — do not assert)_ |

---

## Infrastructure rules (never change)

- `coverageProvider: 'v8'` — never revert to babel (causes counter-reset bug, loses ~4%)
- `coverage-summary.json` is unreliable — use `All files` line from `yarn test:coverage` and `coverage-final.json` for per-file data
- Never run `yarn test --coverage --collectCoverageFrom=...` — overwrites `coverage-final.json`
- JS only — no `.ts` / `.tsx` files
- Arrow function components, named exports everywhere
