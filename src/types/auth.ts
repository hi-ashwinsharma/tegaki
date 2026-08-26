export interface UserProfile {
  id: string;
  name: string;
  username: string; // e.g. "ashwin" -> creates /@ashwin/slug
  email: string;
  avatarUrl?: string;
  bio?: string;
  authProvider: 'google' | 'passkey' | 'email';
  createdAt: number;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
