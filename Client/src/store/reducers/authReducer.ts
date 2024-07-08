import { createSlice } from '@reduxjs/toolkit';
import { IAuthState } from '../../interfaces/IAuthState';
import { signInAction, signUpAction } from '../actions/authAction';

const initialState: IAuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    logout: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(signInAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload,
        };
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(signInAction.rejected, (state, action) => {
        state.error = action.error.message || 'Login Failed';
        state.loading = false;
      })
      .addCase(signUpAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpAction.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(signUpAction.rejected, (state, action) => {
        state.error = action.error.message || 'Sign Up Failed';
        state.loading = false;
      });
  },
});
export const { clearError, setAuthenticated, logout } = authSlice.actions;

export default authSlice.reducer;
