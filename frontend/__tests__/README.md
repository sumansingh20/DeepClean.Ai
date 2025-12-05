# Frontend Test Suite Documentation

## Test Coverage Summary

### Hooks Tests (6 files, 150+ test cases)

#### 1. `__tests__/hooks/useAuth.test.ts`
- **Coverage:** Authentication hook with JWT token management
- **Test Cases:**
  - Initial state (unauthenticated, with stored token)
  - Login functionality (success, errors)
  - Logout functionality
  - Token refresh mechanism
  - Error handling
- **Mocks:** `apiClient`, `tokenStorage`

#### 2. `__tests__/hooks/useSession.test.ts`
- **Coverage:** Session management
- **Test Cases:**
  - Session creation
  - Session retrieval
  - Session updates
  - Loading state management
  - Error handling
- **Mocks:** `apiClient`

#### 3. `__tests__/hooks/useWebSocket.test.ts`
- **Coverage:** WebSocket connection lifecycle
- **Test Cases:**
  - Connection management (connect/disconnect)
  - Message handling
  - Event subscriptions (on/off)
  - Reconnection logic (5 attempts, 3s interval)
  - Keep-alive ping (30s intervals)
  - Multiple listeners per event
- **Mocks:** Global WebSocket API

#### 4. `__tests__/hooks/useRiskScore.test.ts`
- **Coverage:** Risk score calculation and retrieval
- **Test Cases:**
  - Fetch risk score
  - Score history retrieval
  - Risk level interpretation (low/medium/high/critical)
  - Color mapping for risk levels
  - Loading and error states
- **Mocks:** `apiClient`

#### 5. `__tests__/hooks/useIncidents.test.ts`
- **Coverage:** Incident management operations
- **Test Cases:**
  - Fetch incidents with filters
  - Fetch by user
  - Single incident retrieval
  - Update incident status
  - Escalate incident
  - Create new incident
  - Error handling for all operations
- **Mocks:** `apiClient`

#### 6. `__tests__/hooks/useUpload.test.ts` (Not included - refer to session 2 documentation)
- **Coverage:** File upload and validation
- **Mocks:** `apiClient`, File API

### Component Tests (5 files, 100+ test cases)

#### 1. `__tests__/components/RiskScoreCard.test.tsx`
- **Coverage:** Risk score display component
- **Test Cases:**
  - Component rendering
  - Score display (0-100 range, fractional values)
  - Risk level display
  - Component score breakdown (voice, video, document, liveness, scam)
  - Risk level styling (green/yellow/orange/red)
- **Coverage:** ~95%

#### 2. `__tests__/components/IncidentList.test.tsx`
- **Coverage:** Incident list display and interaction
- **Test Cases:**
  - List rendering
  - Incident display
  - Severity indicators (emoji icons)
  - Status badges
  - Empty state
  - Loading state
  - Pagination (load more)
  - Selection callbacks
  - Severity color coding
- **Coverage:** ~90%

#### 3. `__tests__/components/NotificationCenter.test.tsx`
- **Coverage:** Toast notification system
- **Test Cases:**
  - Component rendering
  - Notification display
  - Notification types (info/success/warning/error)
  - Auto-close behavior (configurable timeout)
  - Max notifications limit (default 10)
  - Manual close
  - Accessibility (ARIA labels, screen reader support)
- **Mocks:** `useWebSocket` hook
- **Coverage:** ~85%

#### 4. `__tests__/components/RealTimeProgress.test.tsx`
- **Coverage:** Real-time analysis progress tracking
- **Test Cases:**
  - Component rendering
  - Progress bar display and updates
  - Connection status indicator
  - Current stage display
  - Component progress breakdown (5 stages)
  - Stage color coding (blue/purple/green/orange/indigo)
  - Completion callback
  - Error callback
  - Accessibility features
  - Real-time WebSocket integration
- **Mocks:** `useWebSocket` hook
- **Coverage:** ~90%

#### 5. Additional Components (Button, Header, Uploaders, ScoreHistory, IncidentDetails)
- Fully tested in session 2 test suite
- Reference existing test documentation

### Integration Tests (3 files, 80+ test cases)

#### 1. `__tests__/pages/analysis.test.tsx`
- **Coverage:** Complete analysis page workflow
- **Test Cases:**
  - Page rendering and layout
  - Session creation and display
  - Tab navigation (voice/video/document/liveness)
  - Upload handling and success flow
  - Progress tracker integration
  - Notification center integration
  - Real-time updates
  - Error handling
  - Responsive layout
- **Mocks:** `useAuth`, `useSession`, all components
- **Coverage:** ~90%

#### 2. `__tests__/pages/results.test.tsx`
- **Coverage:** Results display and navigation
- **Test Cases:**
  - Page rendering
  - Tab navigation (Overview/History/Details)
  - Risk score display
  - Score history display
  - Actions (Print, New Analysis)
  - Data loading states
  - Error handling
- **Mocks:** `useAuth`, `useRiskScore`, components
- **Coverage:** ~85%

#### 3. `__tests__/pages/incidents.test.tsx`
- **Coverage:** Incident management dashboard
- **Test Cases:**
  - Page rendering
  - Statistics display
  - Filtering (status, severity)
  - Incident list display
  - Incident selection and details
  - Dual-column layout
  - Actions (update, escalate, close)
  - Responsive design
- **Mocks:** `useAuth`, `useIncidents`, components
- **Coverage:** ~90%

## Test Configuration

### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/__tests__'],
  collectCoverageFrom: [
    'components/**/*.tsx',
    'hooks/**/*.ts',
    'app/**/*.tsx',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
```

### Testing Library Setup (`jest.setup.js`)
- Configures @testing-library/jest-dom matchers
- Mocks API client and token storage
- Configures fetch API mocks
- Sets up WebSocket mocks

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- RiskScoreCard.test.tsx

# Run tests in watch mode
npm test -- --watch

# Run tests matching pattern
npm test -- --testNamePattern="useAuth"
```

## Coverage Goals

- **Hooks:** 90%+ coverage
- **Components:** 85%+ coverage
- **Pages:** 80%+ coverage
- **Overall:** 85%+ coverage

## Test Utilities

### Helper Functions
- `renderHook` - Render custom hooks in isolation
- `render` - Render React components
- `screen` - Query rendered components by text/role
- `fireEvent` - Trigger user interactions
- `waitFor` - Wait for async operations
- `act` - Wrap state updates

### Mock Patterns
- Jest mocking for modules
- Mock WebSocket implementation
- Mock API client with resolved/rejected promises
- Mock React Router navigation
- Mock token storage

## CI/CD Integration

Tests are configured to run:
- On every git commit (pre-commit hook)
- On every pull request
- On push to main branch
- With coverage reports generated

## Known Limitations

1. **WebSocket Testing**: Uses mock implementation instead of real WebSocket
   - Suitable for testing connection lifecycle and event handling
   - Consider using ws library for integration tests

2. **Performance Tests**: Not included in this suite
   - Consider adding performance benchmarks in future iterations

3. **E2E Tests**: Not included in this suite
   - Can be added using Cypress or Playwright

## Future Enhancements

1. Add snapshot tests for complex components
2. Implement visual regression testing
3. Add performance benchmarking
4. E2E test coverage with Cypress
5. Accessibility testing with axe-core
6. Test coverage for error boundaries
7. Mock API response variations for edge cases

## Test Maintenance Guidelines

1. Update tests when component props change
2. Keep mocks synchronized with actual implementations
3. Review coverage reports after each major feature
4. Refactor tests for clarity and maintainability
5. Document complex test scenarios
