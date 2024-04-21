import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

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

      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      const errorData = err.response?.data as ResponseData;
      throw new Error(errorData.error);
    }
  },
);

export const signUpAction = createAsyncThunk(
  'auth/signUp',
  async (credentials: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/users/signup',
        credentials,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      const errorData = err.response?.data as ResponseData;

      throw new Error(errorData.error);
    }
  },
);
