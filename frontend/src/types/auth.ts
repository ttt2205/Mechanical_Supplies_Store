export interface UserAccount {
  account_id: string;
  role_id: string;
  email: string;
  username: string;
  status: string;
}

export interface AuthState {
  user: UserAccount | null;
  isAuthenticated: boolean;
}

export interface AuthActions {
  login: (userData: UserAccount) => void;
  logout: () => void;
}

export type AuthStore = AuthState & AuthActions;
