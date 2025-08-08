
import { UserResponse } from '../../../../types/auth.d';
import { clearAuth, setAuthError, setAuthLoading, setUser } from '../authSlice';
import { login } from '../authThunks';


// src/redux/features/auth/authSlice.test.ts
describe('authSlice() authSlice method', () => {
  // Initial state for reference in tests
  const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  // =========================
  // Happy Path Tests
  // =========================

  it('should return the initial state when passed an undefined state', () => {
    // Test: Ensure reducer returns initial state when state is undefined
    const result = authReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should handle setAuthLoading to true', () => {
    // Test: Setting isLoading to true
    const action = setAuthLoading(true);
    const result = authReducer(initialState, action);
    expect(result.isLoading).toBe(true);
    expect(result).toMatchObject({
      ...initialState,
      isLoading: true,
    });
  });

  it('should handle setAuthLoading to false', () => {
    // Test: Setting isLoading to false
    const prevState = { ...initialState, isLoading: true };
    const action = setAuthLoading(false);
    const result = authReducer(prevState, action);
    expect(result.isLoading).toBe(false);
  });

  it('should handle setAuthError with a string error', () => {
    // Test: Setting error to a string value
    const errorMsg = 'Invalid credentials';
    const action = setAuthError(errorMsg);
    const result = authReducer(initialState, action);
    expect(result.error).toBe(errorMsg);
  });

  it('should handle setAuthError with null', () => {
    // Test: Setting error to null
    const prevState = { ...initialState, error: 'Some error' };
    const action = setAuthError(null);
    const result = authReducer(prevState, action);
    expect(result.error).toBeNull();
  });

  it('should handle setUser with a valid user', () => {
    // Test: Setting user and isAuthenticated to true
    const user: UserResponse = { id: '1', name: 'Alice', email: 'alice@example.com' };
    const action = setUser(user);
    const result = authReducer(initialState, action);
    expect(result.user).toEqual(user);
    expect(result.isAuthenticated).toBe(true);
  });

  it('should handle setUser with null', () => {
    // Test: Setting user to null and isAuthenticated to false
    const prevState = {
      ...initialState,
      user: { id: '2', name: 'Bob', email: 'bob@example.com' },
      isAuthenticated: true,
    };
    const action = setUser(null);
    const result = authReducer(prevState, action);
    expect(result.user).toBeNull();
    expect(result.isAuthenticated).toBe(false);
  });

  it('should handle clearAuth and reset user, isAuthenticated, and error', () => {
    // Test: Clearing authentication state
    const prevState = {
      user: { id: '3', name: 'Charlie', email: 'charlie@example.com' },
      isAuthenticated: true,
      isLoading: true,
      error: 'Some error',
    };
    const action = clearAuth();
    const result = authReducer(prevState, action);
    expect(result.user).toBeNull();
    expect(result.isAuthenticated).toBe(false);
    expect(result.error).toBeNull();
    expect(result.isLoading).toBe(true); // isLoading is not reset by clearAuth
  });

  it('should handle login.fulfilled and set user, isAuthenticated, and clear error', () => {
    // Test: Handling successful login
    const user: UserResponse = { id: '4', name: 'Dana', email: 'dana@example.com' };
    const action = { type: login.fulfilled.type, payload: user };
    const prevState = {
      ...initialState,
      error: 'Previous error',
    };
    const result = authReducer(prevState, action);
    expect(result.user).toEqual(user);
    expect(result.isAuthenticated).toBe(true);
    expect(result.error).toBeNull();
  });

  // =========================
  // Edge Case Tests
  // =========================

  it('should not change state for unknown action types', () => {
    // Test: Reducer should return current state for unknown actions
    const prevState = {
      ...initialState,
      user: { id: '5', name: 'Eve', email: 'eve@example.com' },
      isAuthenticated: true,
      isLoading: true,
      error: 'Some error',
    };
    const action = { type: 'UNKNOWN_ACTION' };
    const result = authReducer(prevState, action);
    expect(result).toEqual(prevState);
  });

  it('should handle setAuthError with an empty string', () => {
    // Test: Setting error to an empty string
    const action = setAuthError('');
    const result = authReducer(initialState, action);
    expect(result.error).toBe('');
  });

  it('should handle setUser with a user object with minimal fields', () => {
    // Test: Setting user with minimal valid UserResponse fields
    // Assuming UserResponse requires id, name, email
    const user: UserResponse = { id: '', name: '', email: '' };
    const action = setUser(user);
    const result = authReducer(initialState, action);
    expect(result.user).toEqual(user);
    expect(result.isAuthenticated).toBe(true);
  });

  it('should not reset isLoading when clearAuth is called', () => {
    // Test: clearAuth should not affect isLoading
    const prevState = {
      ...initialState,
      isLoading: true,
    };
    const action = clearAuth();
    const result = authReducer(prevState, action);
    expect(result.isLoading).toBe(true);
  });

  it('should handle login.fulfilled when previous user and error exist', () => {
    // Test: login.fulfilled should overwrite user and clear error
    const prevUser: UserResponse = { id: '6', name: 'Frank', email: 'frank@example.com' };
    const newUser: UserResponse = { id: '7', name: 'Grace', email: 'grace@example.com' };
    const prevState = {
      user: prevUser,
      isAuthenticated: true,
      isLoading: false,
      error: 'Old error',
    };
    const action = { type: login.fulfilled.type, payload: newUser };
    const result = authReducer(prevState, action);
    expect(result.user).toEqual(newUser);
    expect(result.isAuthenticated).toBe(true);
    expect(result.error).toBeNull();
  });
});