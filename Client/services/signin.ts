import axios from 'axios';

interface SignInData {
  usernameOrEmail: string;
  password: string;
}

export const signIn = async (data: SignInData) => {
  console.log('signin api', data);
  const response = await axios.post('/users/login', data);
  return response.data;
};
