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
        'https://codeclash-backend-t4cnvcfzcq-ew.a.run.app/users/login',
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
        'https://codeclash-backend-t4cnvcfzcq-ew.a.run.app/users/signup',
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

export const uploadImage = async (
  file: File,
  jwtToken: string,
): Promise<void> => {
  const url =
    'https://codeclash-backend-t4cnvcfzcq-ew.a.run.app/users/profile_picture';
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.put(url, formData, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Image uploaded successfully:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        'Error response:',
        error.response.status,
        error.response.data,
      );
    }
  }
};
