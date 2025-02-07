import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CollectionRequestService } from '../../core/services/collection-request.service';
import * as CollectionRequestActions from '../actions/collection-request.actions';

@Injectable()
export class CollectionRequestEffects {
  createRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionRequestActions.createRequest),
      mergeMap(({ request }) =>
        this.collectionRequestService.createRequest(request).pipe(
          map(request => CollectionRequestActions.createRequestSuccess({ request })),
          catchError(error => of(CollectionRequestActions.createRequestFailure({ error: error.message })))
        )
      )
    )
  );

  loadUserRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionRequestActions.loadUserRequests),
      mergeMap(({ userId }) =>
        this.collectionRequestService.getRequestsByUser(userId).pipe(
          map(requests => CollectionRequestActions.loadUserRequestsSuccess({ requests })),
          catchError(error => of(CollectionRequestActions.loadUserRequestsFailure({ error: error.message })))
        )
      )
    )
  );

  loadCityRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionRequestActions.loadCityRequests),
      mergeMap(({ city }) =>
        this.collectionRequestService.getRequestsByCity(city).pipe(
          map(requests => CollectionRequestActions.loadCityRequestsSuccess({ requests })),
          catchError(error => of(CollectionRequestActions.loadCityRequestsFailure({ error: error.message })))
        )
      )
    )
  );

  updateRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionRequestActions.updateRequest),
      mergeMap(({ requestId, request }) =>
        this.collectionRequestService.updateRequest(requestId, request).pipe(
          map(updatedRequest => CollectionRequestActions.updateRequestSuccess({ request: updatedRequest })),
          catchError(error => of(CollectionRequestActions.updateRequestFailure({ error: error.message })))
        )
      )
    )
  );

  deleteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionRequestActions.deleteRequest),
      mergeMap(({ requestId }) =>
        this.collectionRequestService.deleteRequest(requestId).pipe(
          map(() => CollectionRequestActions.deleteRequestSuccess({ requestId })),
          catchError(error => of(CollectionRequestActions.deleteRequestFailure({ error: error.message })))
        )
      )
    )
  );

  validateRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionRequestActions.validateRequest),
      mergeMap(({ requestId, validatedWeight, photos }) =>
        this.collectionRequestService.validateCollection(requestId, validatedWeight, photos).pipe(
          map(request => CollectionRequestActions.validateRequestSuccess({ request })),
          catchError(error => of(CollectionRequestActions.validateRequestFailure({ error: error.message })))
        )
      )
    )
  );

  // Navigate after successful request creation
  createRequestSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CollectionRequestActions.createRequestSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private collectionRequestService: CollectionRequestService,
    private router: Router
  ) {}
}
