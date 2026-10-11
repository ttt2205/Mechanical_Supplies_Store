export interface UserAccount {
  account_id: string;
  role_id: string;
  roleCode?: string;
  roleId?: number;
  email: string;
  username: string;
  status: string;
}

export interface AuthState {
  user: UserAccount | null;
  isAuthenticated: boolean;
  permissions: string[];
  accessToken?: string | null;
  refreshToken?: string | null;
}

export interface AuthActions {
  login: (userData: UserAccount, permissions: string[], tokens?: { accessToken: string, refreshToken: string }) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export type AuthStore = AuthState & AuthActions;
