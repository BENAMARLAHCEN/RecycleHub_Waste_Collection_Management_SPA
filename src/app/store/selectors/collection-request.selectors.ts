// src/app/store/selectors/collection-request.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionRequestState } from '../reducers/collection-request.reducer';
import { RequestStatus } from '../../shared/models/collection-request.model';

export const selectCollectionRequestState = createFeatureSelector<CollectionRequestState>('collectionRequests');

export const selectAllRequests = createSelector(
  selectCollectionRequestState,
  (state) => state.requests
);

export const selectLoading = createSelector(
  selectCollectionRequestState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectCollectionRequestState,
  (state) => state.error
);

export const selectSelectedRequest = createSelector(
  selectCollectionRequestState,
  (state) => state.selectedRequest
);

export const selectPendingRequests = createSelector(
  selectAllRequests,
  (requests) => requests.filter(request => request.status === RequestStatus.PENDING)
);

export const selectValidatedRequests = createSelector(
  selectAllRequests,
  (requests) => requests.filter(request => request.status === RequestStatus.VALIDATED)
);

export const selectInProgressRequests = createSelector(
  selectAllRequests,
  (requests) => requests.filter(request =>
    request.status === RequestStatus.IN_PROGRESS ||
    request.status === RequestStatus.OCCUPIED
  )
);

export const selectRequestsByCity = (city: string) => createSelector(
  selectAllRequests,
  (requests) => requests.filter(request => request.city === city)
);

export const selectRequestsByUser = (userId: string) => createSelector(
  selectAllRequests,
  (requests) => requests.filter(request => request.userId === userId)
);

export const selectTotalPoints = createSelector(
  selectValidatedRequests,
  (requests) => requests.reduce((total, request) => {
    // Calculate points based on validated weight and waste type
    return total + request.validatedWeight!;
  }, 0)
);
