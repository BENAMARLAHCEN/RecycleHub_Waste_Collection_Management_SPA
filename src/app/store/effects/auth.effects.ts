// src/app/store/effects/auth.effects.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { User } from '../../shared/models/user.model';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map(user => AuthActions.loginSuccess({ user })),
          catchError(error => of(AuthActions.loginFailure({ error: error.message })))
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ user }) =>
        this.authService.register(user).pipe(
          map(user => AuthActions.registerSuccess({ user })),
          catchError(error => of(AuthActions.registerFailure({ error: error.message })))
        )
      )
    )
  );

  authSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );


  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      mergeMap(({ user }) =>
        this.authService.updateProfile(user).pipe(
          map((updatedUser: User) => AuthActions.updateProfileSuccess({ user: updatedUser })),
          catchError(error => of(AuthActions.updateProfileFailure({ error: error.message })))
        )
      )
    )
  );

  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.deleteAccount),
      mergeMap(({ userId }) =>
        this.authService.deleteAccount(userId).pipe(
          map(() => AuthActions.deleteAccountSuccess()),
          catchError(error => of(AuthActions.deleteAccountFailure({ error: error.message })))
        )
      )
    )
  );

  profileSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.updateProfileSuccess),
        tap(() => {
          console.log('Profile updated successfully');
        })
      ),
    { dispatch: false }
  );

  accountDeleted$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.deleteAccountSuccess),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
