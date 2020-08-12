import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authSvc: AuthService,
              private router: Router ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> |
    Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authSvc.userData$.pipe(
        map(user => {
          if (!user) {
            this.router.navigate(['/admin']);
            return false;
          }
          if (user.email === 'admin@ejeplaypereira.com') {
            return true;
          }
          Swal.fire({
            title: 'Error...',
            text: 'El usuario no tiene permisos administrativos',
            icon: 'error',
            allowOutsideClick: false,
            showCloseButton: true
          });
          this.authSvc.logout();
          this.router.navigate(['/admin']);
          return false;
        })
      );
  }
}
