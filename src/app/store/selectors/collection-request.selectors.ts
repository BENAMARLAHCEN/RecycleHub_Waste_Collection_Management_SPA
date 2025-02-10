
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

