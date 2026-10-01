import { HttpInterceptorFn } from '@angular/common/http';

const ANON_KEY = 'anon-id';

/**
 * Identidad del navegador para las consultas sin sesion. El backend la usa para
 * separar el historial de cada visitante; sin ella, todos cairian en el mismo
 * historial compartido.
 */
function anonId(): string {
  let id = localStorage.getItem(ANON_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ANON_KEY, id);
  }
  return id;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const headers: Record<string, string> = { 'X-Anon-Id': anonId() };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return next(req.clone({ setHeaders: headers }));
};
