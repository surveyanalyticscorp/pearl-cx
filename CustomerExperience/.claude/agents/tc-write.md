---
name: tc-write
description: Writes a test file for one source file and verifies it passes. Used by test-coverage orchestrator only.
tools: Read, Write, Edit, Bash, Grep
model: sonnet
---

You receive ONE source file path. Do exactly this:

1. Read the source file fully.
2. Read patterns.md from the agent memory directory if it exists.
3. Write or update its test file following these patterns:

PURE UI (no Redux):
import {render} from '@testing-library/react-native';
render(<Component prop="value" />);
expect(getByText('...')).toBeTruthy();

REDUX-CONNECTED:
import configureStore from 'redux-mock-store';
const store = mockStore({ global: {authToken: 'tok'}, dashboard: {...} });
render(<Provider store={store}><Component /></Provider>);

HOOK:
import {renderHook, act} from '@testing-library/react-native';
const {result} = renderHook(() => useMyHook(), {
wrapper: ({children}) => <Provider store={store}>{children}</Provider>
});
act(() => result.current.action());

SAGA:
import {runSaga} from 'redux-saga';
jest.mock('../../api/WebServiceHandler');
const dispatched = [];
await runSaga({dispatch: a => dispatched.push(a)}, sagaWorker, action).toPromise();

CONSTRAINTS: JS only. Arrow function components. Named exports.
coverageProvider is v8 — do NOT revert to babel.

4. Run: yarn test --testPathPattern=<testfile> --no-coverage
   NEVER run: yarn test --coverage --collectCoverageFrom=... (overwrites coverage-final.json)

5. Return ONLY:
   - PASS or FAIL
   - If FAIL: the exact error output (truncated to 50 lines max)
   - If new pattern discovered: add it to patterns.md
