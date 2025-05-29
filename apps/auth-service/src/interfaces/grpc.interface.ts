import { UserRole } from '../enums/user-role.enum';

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponse {
  id: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  token: string;
  user: UserData;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  user: UserData;
}

export interface IGrpcService {
  Register(request: RegisterRequest): Promise<RegisterResponse>;
  Login(request: LoginRequest): Promise<LoginResponse>;
  ValidateToken(request: ValidateTokenRequest): Promise<ValidateTokenResponse>;
}
