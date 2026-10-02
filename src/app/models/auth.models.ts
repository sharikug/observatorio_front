export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * El rol no viaja desde aqui: el backend lo decide a partir de `codigoAdmin`, y por
 * eso no hay ningun campo de rol que un formulario pudiera manipular.
 */
export interface RegistroRequest {
  idcard: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
  codigoAdmin?: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  rol: string;
}