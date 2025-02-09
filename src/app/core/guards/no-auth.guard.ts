import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import {map, Observable} from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (!user) {
          return true;
        }
        return this.router.createUrlTree(['/dashboard']);
      })
    );
  }
}
