import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addTeam,
  editTeam,
  getGameInfo,
  getUserByUsername,
  getUserTeams,
  inviteUser,
  updateUser,
} from '../actions/userInfo';
import { IUserState } from '../../interfaces/IUserState';

const initialState: IUserState = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserData: state => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    clearUserState: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(getUserByUsername.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserByUsername.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          console.log('fullfilled action', action.payload);
          console.log('fullfilled state', state.data);
          state.data = {
            ...state.data,
            ...action.payload,
          };
          state.error = null;
        },
      )
      .addCase(
        getUserByUsername.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch user data';
        },
      )
      .addCase(getGameInfo.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGameInfo.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        console.log('fullfilled action game', action.payload);
        console.log('fullfilled state game', state.data);
        const gameInfo = action.payload;

        state.data = {
          ...state.data,
          gameInfo,
        };
        state.error = null;
      })
      .addCase(getGameInfo.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user data';
      })
      .addCase(updateUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = {
          ...state.data,
          ...action.payload,
        };
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user data';
      })
      .addCase(addTeam.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTeam.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = {
          ...state.data,
          ...action.payload,
        };
        state.error = null;
      })
      .addCase(addTeam.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create a team';
      })
      .addCase(editTeam.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTeam.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = {
          ...state.data,
          ...action.payload,
        };
        state.error = null;
      })
      .addCase(editTeam.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create a team';
      })
      .addCase(getUserTeams.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserTeams.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = {
          ...state.data,
          ...action.payload,
        };
        state.error = null;
      })
      .addCase(getUserTeams.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create a team';
      })
      .addCase(inviteUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = {
          ...state.data,
          ...action.payload,
        };
        state.error = null;
      })
      .addCase(inviteUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create a team';
      });
  },
});

export const { clearUserData, clearUserState } = userSlice.actions;
export default userSlice.reducer;
