export interface IAuthState {
  user: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
