import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'investigacion', loadComponent: () => import('./pages/investigacion-cifras/investigacion-cifras.component').then(m => m.InvestigacionCifrasComponent) },
  { path: 'impacto', loadComponent: () => import('./pages/impacto/impacto.component').then(m => m.ImpactoComponent) },
  { path: 'impacto/:id', loadComponent: () => import('./pages/detalle-impacto/detalle-impacto.component').then(m => m.DetalleImpactoComponent) },
  { path: 'reportes', loadComponent: () => import('./pages/reportes/reportes.component').then(m => m.ReportesComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent) },
  { path: 'terminos', loadComponent: () => import('./pages/terminos/terminos.component').then(m => m.TerminosComponent) },
  { path: 'politica-privacidad', loadComponent: () => import('./pages/politica-privacidad/politica-privacidad.component').then(m => m.PoliticaPrivacidadComponent) },
  { path: '**', redirectTo: 'home' }
];
