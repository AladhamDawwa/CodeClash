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

interface Problem {
  id?: string;
  title: string;
  description: string;
  input_format: string;
  output_format: string;
  memory_limit: number;
  time_limit: number;
  rating?: string;
  tags?: string[];
  accepted_code?: string;
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
interface EditTeamParams {
  jwtToken: string;
  oldteamName: string;
  newteamName: string;
  slogan: string;
}
interface GetUserByUsernameParams {
  username: string;
  jwtToken: string;
}
interface GetProblemInfoParams {
  problemId: string;
  jwtToken: string;
}

interface GetGameHistory {
  username: string;
  jwtToken: string;
}
interface GetGameSubmissions {
  username: string;
  jwtToken: string;
  gameId: string;
}

interface getTeamsParams {
  jwtToken: string;
}

interface inviteUserParams {
  jwtToken: string;
  team_name: string;
  user: string;
}

interface GameHistory {
  id: string;
  game_mode: number;
  game_type: number;
  problem_id: string;
  duration: number;
  start_time: { _seconds: number; _nanoseconds: number };
  end_time: { _seconds: number; _nanoseconds: number };
  user_a_result: {
    new_points: number;
    delta: number;
    new_tier: number;
    username: string;
    status: number;
  };
  user_b_result: {
    new_points: number;
    delta: number;
    new_tier: number;
    username: string;
    status: number;
  };
  submissions: any[];
  username_b: string;
}

export const getUserByUsername = createAsyncThunk(
  'user/getUserByUsername',
  async ({ username, jwtToken }: GetUserByUsernameParams, thunkAPI) => {
    const url = `https://codeclash-backend.packetmasr.shop/users/${username}`;
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
export const getProblemInfo = createAsyncThunk(
  'user/getProblemInfo',
  async ({ problemId, jwtToken }: GetProblemInfoParams, thunkAPI) => {
    const url = `https://codeclash-backend.packetmasr.shop/problems/${problemId}`;
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
export const getGameHistory = createAsyncThunk(
  'user/getGameHistory',
  async ({ username, jwtToken }: GetGameHistory, thunkAPI) => {
    const url = `https://codeclash-backend.packetmasr.shop/game_history/${username}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data as GameHistory[];
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

export const getGameSubmissions = createAsyncThunk(
  'user/getGameSubmissions',
  async ({ gameId, username, jwtToken }: GetGameSubmissions, thunkAPI) => {
    const url = `https://codeclash-backend.packetmasr.shop/submissions/${gameId}/${username}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data as any[];
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
      const response = await axios.put(
        'https://codeclash-backend.packetmasr.shop/users',
        newData,
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
        'https://codeclash-backend.packetmasr.shop/teams/create',
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

export const editTeam = createAsyncThunk(
  'user/EditTeam',
  async (
    { jwtToken, oldteamName, newteamName, slogan }: EditTeamParams,
    thunkAPI,
  ) => {
    const data = {
      team_name: newteamName,
      slogan: slogan,
    };

    try {
      const response = await axios.put(
        `https://codeclash-backend.packetmasr.shop/teams/${oldteamName}`,
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
      const response = await axios.get(
        'https://codeclash-backend.packetmasr.shop/teams/all',
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
        'https://codeclash-backend.packetmasr.shop/teams/invite',
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
