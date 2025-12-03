import { User } from '../user/user.model';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  refreshToken: string;
}
