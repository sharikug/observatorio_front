export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistroRequest {
  idcard: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
  rol?: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  rol: string;
}