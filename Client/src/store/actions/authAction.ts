import axios, { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface ResponseData {
  error?: string;
}

export const signInAction = createAsyncThunk(
  'auth/signIn',
  async (credentials: { username: string; password: string }) => {
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
      const err = error as AxiosError;
      const errorData = err.response?.data as ResponseData;

      throw new Error(errorData.error);
    }
  },
);
