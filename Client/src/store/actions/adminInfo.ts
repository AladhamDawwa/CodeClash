import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

interface ResponseData {
  error?: string;
}

interface AdminData {
  user: {
    id: string;
    username: string;
  };
  token: string;
  is_admin: boolean;
}

export const loginAdmin = createAsyncThunk(
  'admin/loginAdmin',
  async ({ username, password }: { username: string, password: string }, thunkAPI) => {
    const url = `${apiUrl}/admin/login`;
    try {
      const response = await axios.post(url, {
        username,
        password
      });
      return response.data as AdminData;
    } catch (error) {
      const err = error as AxiosError<ResponseData>;
      if (err.response && err.response.data) {
        return thunkAPI.rejectWithValue(
          err.response.data.error || 'Failed to fetch user data',
        );
      }
    }
  },
);