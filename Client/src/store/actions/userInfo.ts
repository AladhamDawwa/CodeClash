import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserData {
  username: string;
  email: string;
  description: string;
  exp: number;
  first_name: string;
  last_name: string;
  image: string;
  level: number;
  mmr: number;
  rank_points: number;
  rank_tier: number;
}

export const getUserByUsername = createAsyncThunk<
  UserData,
  { username: string; jwtToken: string }
>('user/getUserByUsername', async ({ username, jwtToken }) => {
  const url = `http://localhost:5000/users/${username}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data as UserData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
});
