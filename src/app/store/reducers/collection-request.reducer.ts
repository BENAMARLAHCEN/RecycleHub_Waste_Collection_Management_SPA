import { createReducer, on } from '@ngrx/store';
import { CollectionRequest } from '../../shared/models/collection-request.model';
import * as CollectionRequestActions from '../actions/collection-request.actions';

export interface CollectionRequestState {
  requests: CollectionRequest[];
  selectedRequest: CollectionRequest | null;
  loading: boolean;
  error: string | null;
}

export const initialState: CollectionRequestState = {
  requests: [],
  selectedRequest: null,
  loading: false,
  error: null
};

export const collectionRequestReducer = createReducer(
  initialState,
  on(CollectionRequestActions.createRequest, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CollectionRequestActions.createRequestSuccess, (state, { request }) => ({
    ...state,
    requests: [...state.requests, request],
    loading: false,
    error: null
  })),
  on(CollectionRequestActions.createRequestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CollectionRequestActions.loadUserRequests, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CollectionRequestActions.loadUserRequestsSuccess, (state, { requests }) => ({
    ...state,
    requests,
    loading: false,
    error: null
  })),
  on(CollectionRequestActions.loadUserRequestsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CollectionRequestActions.loadCityRequests, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CollectionRequestActions.loadCityRequestsSuccess, (state, { requests }) => ({
    ...state,
    requests,
    loading: false,
    error: null
  })),
  on(CollectionRequestActions.loadCityRequestsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CollectionRequestActions.updateRequest, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CollectionRequestActions.updateRequestSuccess, (state, { request }) => ({
    ...state,
    requests: state.requests.map(r => r.id === request.id ? request : r),
    loading: false,
    error: null
  })),
  on(CollectionRequestActions.updateRequestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CollectionRequestActions.deleteRequest, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CollectionRequestActions.deleteRequestSuccess, (state, { requestId }) => ({
    ...state,
    requests: state.requests.filter(r => r.id !== requestId),
    loading: false,
    error: null
  })),
  on(CollectionRequestActions.deleteRequestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CollectionRequestActions.validateRequest, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CollectionRequestActions.validateRequestSuccess, (state, { request }) => ({
    ...state,
    requests: state.requests.map(r => r.id === request.id ? request : r),
    loading: false,
    error: null
  })),
  on(CollectionRequestActions.validateRequestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CollectionRequestActions.clearCollectionErrors, state => ({
    ...state,
    error: null
  }))
);
