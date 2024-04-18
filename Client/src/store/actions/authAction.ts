import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const signInAction = createAsyncThunk(
  'auth/signIn',
  async (credentials: { usernameOrEmail: string; password: string }) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/users/login',
        credentials,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      return response.data.user; // Replace with the actual data structure
    } catch (error) {
      throw new Error('Login failed'); // Handle errors appropriately
    }
  },
);
