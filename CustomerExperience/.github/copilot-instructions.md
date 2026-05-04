# CustomerExperience React Native App - AI Coding Guide

## Architecture Overview

This is a React Native customer experience management app with Redux/Redux-Saga state management, Firebase integration, and comprehensive testing infrastructure.

### Key Structure

- **`app/`** - Main application code (NOT src/)
- **`app/redux/`** - Redux store, actions, reducers, and sagas
- **`app/routes/`** - Navigation stacks using React Navigation v5
- **`app/api/`** - API layer with `ApiHandler.js` and `WebServiceHandler.js`
- **`app/components/`** - Organized by feature domains (login/, dashboard/, closedloop/, etc.)
- **`app/Utils/`** - Shared utilities, analytics, and app info
- **`__mocks__/`** - Comprehensive Jest mocks for React Native libraries

## Critical Development Workflows

### Build & Run Commands (from package.json)

```bash
# Android development
yarn android:cleanBuildAssemble  # Full clean build
yarn android:debug-bundle        # Create debug bundle

# iOS development
yarn ios:pod-reinstall           # Full pod reinstall when deps change
NODE_OPTIONS=--openssl-legacy-provider yarn ios  # iOS with legacy support

# Testing strategies
yarn test:unit           # Unit tests in app/testcases/unit_test/
yarn test:component      # Component tests with snapshots
yarn test:widget         # Widget-specific tests
yarn test:singleFileCoverage  # Coverage for specific files

# Cache & reset workflows
yarn start:resetCache    # Metro cache issues
yarn watchman:clean      # Watchman issues
yarn reset_              # Full node_modules reset
```

### Redux Patterns

- **Store**: `app/redux/store/store.js` - Redux + Saga + DevTools setup
- **Actions**: Domain-specific action files (dashboard.actions.js, login.actions.js)
- **Sagas**: Handle async operations, API calls, and side effects
- **State structure**: Normalized domain-specific reducers

### API Layer Pattern

```javascript
// ApiHandler.js - Business logic layer
callAPIInternal(token, url, data, successCallback, errorCallback)
callAIRouterAPI(url, apiKey, data, successCallback, errorCallback) // AI router integration

// WebServiceHandler.js - HTTP abstraction
static postNew(url, headers, data)  // Standard POST wrapper
```

## Project-Specific Conventions

### Testing Organization

- **Unit tests**: `app/testcases/unit_test/`
- **Component tests**: `app/testcases/component_test/` with snapshot testing
- **Widget tests**: `app/testcases/widget_test/`
- **Mocks**: Extensive `__mocks__/` directory for all major RN libraries
- **Coverage**: Use `yarn test:singleFileCoverage` pattern for focused coverage

### Navigation Architecture

- **Stack-based**: Multiple navigation stacks (DashboardStack.js, ClosedLoopStack.js, etc.)
- **Drawer navigation**: Custom DrawerContent.js with logout hooks
- **Routing**: Central `appRouter.js` orchestrates navigation flow
- **Navigation v5**: Uses `@react-navigation/core@5.16.1` patterns

### State Management Patterns

```javascript
// Action pattern
{type: ANALYTICS_EVENTS.SCREEN_VIEW, payload: {screen: 'Dashboard'}}

// Async storage integration
ASYNC_AUTH_TOKEN, ASYNC_USER_INFO, ASYNC_LOGGED_IN_ALREADY constants

// Saga pattern for API calls
function* callAPI(action) { /* yield call, put patterns */ }
```

### Styling System

- **EStyleSheet**: Extended StyleSheet for responsive design
- **Global variables**: `app/styles/globalStyleVariables.js` (responsive rem calculations)
- **Theme system**: React Native Paper integration via PaperProvider
- **Assets**: Fonts and images in `assets/` linked via `react-native.config.js`

### Firebase Integration

- **Messaging**: `@react-native-firebase/messaging@14.12.0`
- **Analytics**: Firebase Analytics integration
- **Notifications**: Custom `NotificationUtils.js` for permission handling

## Platform-Specific Considerations

### iOS

- **Legacy Node**: Use `NODE_OPTIONS=--openssl-legacy-provider` for iOS builds
- **Podfile management**: Always use `yarn ios:pod-reinstall` after dependency changes
- **Image loading**: iOS 14+ compatibility notes in `dev_note.txt`

### Android

- **Gradle**: Custom clean/build commands with `--stacktrace` for debugging
- **Bundle generation**: Specific asset path handling for Android builds
- **Debug port conflicts**: Use `lsof -i :8081` and `kill -9 <PID>` for port issues

### Patches

- **patch-package**: Multiple patches in `patches/` directory for RN libraries
- **Version locking**: Keep `patch-package@5.0.0` for React Native 0.62.2 compatibility

## Integration Points

### External Services

- **Customer feedback APIs**: Detractor tickets, closed-loop segments via `ApiHandler`
- **AI Router API**: Separate API key authentication for AI services
- **Firebase**: Push notifications, analytics tracking
- **Network monitoring**: Redux connectivity middleware

### Development Tools

- **Flipper**: React Native debugging integration
- **Redux DevTools**: Browser extension support in store configuration
- **Jest**: Custom configuration with extensive transform ignore patterns
- **Metro**: Custom resolver configuration for React Native 0.67.2

## Common Gotchas

1. **Always use `app/` directory** - Never assume `src/` structure
2. **Redux-Saga async patterns** - Use `yield call` for API calls, `yield put` for actions
3. **Navigation v5 syntax** - Different from v6, check existing stack files for patterns
4. **Asset linking** - Use `react-native.config.js` asset paths, not auto-linking
5. **Test mocks** - Extensive `__mocks__/` directory covers most RN libraries
6. **iOS builds** - Always include `NODE_OPTIONS=--openssl-legacy-provider`
7. **State persistence** - AsyncStorage integration throughout login flow
