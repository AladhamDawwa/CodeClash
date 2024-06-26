import { Problem } from './../../../../backend/src/models/problem';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

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

interface ProblemData {
  problem: Problem;
  testcases: TestCase[];
}
interface TestCase {
  problem_id: string;
  input: string;
  expected_output: string;
}

interface TestCase {
  title: string;
  description: string;
  input_format: string;
  output_format: string;
  time_limit: number;
  memory_limit: number;
}

interface ResponseData {
  error?: string;
}

interface UpdateUserParams {
  jwtToken: string;
  first_name: string;
  last_name: string;
  username: string;
  description: string;
}

interface CreateTeamParams {
  jwtToken: string;
  teamName: string;
  slogan: string;
}

interface GetUserByUsernameParams {
  username: string;
  jwtToken: string;
}
interface GetGameInfoParams {
  gameId: string;
  jwtToken: string;
}

interface getTeamsParams {
  jwtToken: string;
}

interface inviteUserParams {
  jwtToken: string;
  team_name: string;
  user: string;
}

export const getUserByUsername = createAsyncThunk(
  'user/getUserByUsername',
  async ({ username, jwtToken }: GetUserByUsernameParams, thunkAPI) => {
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
      const err = error as AxiosError<ResponseData>;
      if (err.response && err.response.data) {
        return thunkAPI.rejectWithValue(
          err.response.data.error || 'Failed to fetch user data',
        );
      }
    }
  },
);
export const getGameInfo = createAsyncThunk(
  'user/getGameInfo',
  async ({ gameId, jwtToken }: GetGameInfoParams, thunkAPI) => {
    const url = `http://localhost:5000/problems/${gameId}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('response', response.data);

      return response.data as ProblemData;
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

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    {
      jwtToken,
      first_name,
      last_name,
      username,
      description,
    }: UpdateUserParams,
    thunkAPI,
  ) => {
    const newData = {
      new_user: {
        first_name: first_name,
        last_name: last_name,
        username: username,
        description: description,
      },
    };

    try {
      const response = await axios.put('http://localhost:5000/users', newData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ResponseData>;
      if (err.response && err.response.data) {
        return thunkAPI.rejectWithValue(
          err.response.data.error || 'Failed to update user data',
        );
      }
    }
  },
);

export const addTeam = createAsyncThunk(
  'user/createTeam',
  async ({ jwtToken, teamName, slogan }: CreateTeamParams, thunkAPI) => {
    const data = {
      team_name: teamName,
      slogan: slogan,
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/teams/create',
        data,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ResponseData>;
      if (err.response && err.response.data) {
        return thunkAPI.rejectWithValue(
          err.response.data.error || 'Failed to create team',
        );
      }
      throw error;
    }
  },
);

export const getUserTeams = createAsyncThunk(
  'user/getUserTeams',
  async ({ jwtToken }: getTeamsParams, thunkAPI) => {
    try {
      const response = await axios.get('http://localhost:5000/teams/all', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ResponseData>;
      if (err.response && err.response.data) {
        return thunkAPI.rejectWithValue(
          err.response.data.error || 'Failed to fetch teams',
        );
      }
      throw error;
    }
  },
);

export const inviteUser = createAsyncThunk(
  'user/inviteUser',
  async ({ jwtToken, team_name, user }: inviteUserParams, thunkAPI) => {
    const data = {
      team_name: team_name,
      user: user,
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/teams/invite',
        data,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ResponseData>;
      if (err.response && err.response.data) {
        return thunkAPI.rejectWithValue(
          err.response.data.error || 'Failed to invite user',
        );
      }
      throw error;
    }
  },
);
