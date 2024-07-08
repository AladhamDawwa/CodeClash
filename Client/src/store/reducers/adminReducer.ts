import { createSlice } from "@reduxjs/toolkit";
import { loginAdmin } from "../actions/adminInfo";

interface IAdminState {
  data: any;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: IAdminState = {
  data: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminState: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(loginAdmin.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginAdmin.fulfilled,
        (state, action) => {
          state.loading = false;
          state.data = {
            ...state.data,
            ...action.payload,
          };
          state.isAuthenticated = true;
          state.error = null;
        },
      )
      .addCase(
        loginAdmin.rejected,
        (state, action) => {
          state.error = action.error.message || 'Login Failed';
          state.loading = false;
        },
      )
  }
})

export const {
  clearAdminState,
} = adminSlice.actions;
export default adminSlice.reducer;