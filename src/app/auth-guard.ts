import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = sessionStorage.getItem('authToken');
    const isProtected = route.data['protected'] === true;

    if (isProtected) {
      // Si la ruta es protegida y hay token → pasa
      if (token) return true;

      // Si no hay token → redirige al login
      this.router.navigate(['/login']);
      return false;
    } else {
      // Si la ruta es pública y ya hay token → redirige al dashboard
      if (token) {
        this.router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }
  }
}
