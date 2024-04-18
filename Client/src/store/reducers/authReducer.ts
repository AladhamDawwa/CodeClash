import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { signInAction } from '../actions/authAction';
import { IAuthState } from '../../interfaces/IAuthState';

const initialState: IAuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(signInAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(signInAction.rejected, (state, action) => {
        state.error = action.error.message || 'Login Failed';
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
