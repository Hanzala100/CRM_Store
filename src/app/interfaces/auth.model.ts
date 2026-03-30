export interface AuthUser {
  id: number;
  email: string;
  role: string;
  tenantId: number;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
  tenantId: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'customer';
  tenantId: number;
}
