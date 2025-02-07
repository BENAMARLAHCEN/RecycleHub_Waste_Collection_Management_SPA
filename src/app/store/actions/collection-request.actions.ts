import { createAction, props } from '@ngrx/store';
import { CollectionRequest } from '../../shared/models/collection-request.model';

// Create Request
export const createRequest = createAction(
  '[Collection Request] Create Request',
  props<{ request: Partial<CollectionRequest> }>()
);

export const createRequestSuccess = createAction(
  '[Collection Request] Create Request Success',
  props<{ request: CollectionRequest }>()
);

export const createRequestFailure = createAction(
  '[Collection Request] Create Request Failure',
  props<{ error: string }>()
);

// Load Requests
export const loadUserRequests = createAction(
  '[Collection Request] Load User Requests',
  props<{ userId: string }>()
);

export const loadUserRequestsSuccess = createAction(
  '[Collection Request] Load User Requests Success',
  props<{ requests: CollectionRequest[] }>()
);

export const loadUserRequestsFailure = createAction(
  '[Collection Request] Load User Requests Failure',
  props<{ error: string }>()
);

// Load City Requests
export const loadCityRequests = createAction(
  '[Collection Request] Load City Requests',
  props<{ city: string }>()
);

export const loadCityRequestsSuccess = createAction(
  '[Collection Request] Load City Requests Success',
  props<{ requests: CollectionRequest[] }>()
);

export const loadCityRequestsFailure = createAction(
  '[Collection Request] Load City Requests Failure',
  props<{ error: string }>()
);

// Update Request
export const updateRequest = createAction(
  '[Collection Request] Update Request',
  props<{ requestId: string; request: Partial<CollectionRequest> }>()
);

export const updateRequestSuccess = createAction(
  '[Collection Request] Update Request Success',
  props<{ request: CollectionRequest }>()
);

export const updateRequestFailure = createAction(
  '[Collection Request] Update Request Failure',
  props<{ error: string }>()
);

// Delete Request
export const deleteRequest = createAction(
  '[Collection Request] Delete Request',
  props<{ requestId: string }>()
);

export const deleteRequestSuccess = createAction(
  '[Collection Request] Delete Request Success',
  props<{ requestId: string }>()
);

export const deleteRequestFailure = createAction(
  '[Collection Request] Delete Request Failure',
  props<{ error: string }>()
);

// Validate Request
export const validateRequest = createAction(
  '[Collection Request] Validate Request',
  props<{ requestId: string; validatedWeight: number; photos?: string[] }>()
);

export const validateRequestSuccess = createAction(
  '[Collection Request] Validate Request Success',
  props<{ request: CollectionRequest }>()
);

export const validateRequestFailure = createAction(
  '[Collection Request] Validate Request Failure',
  props<{ error: string }>()
);

// Clear Errors
export const clearCollectionErrors = createAction(
  '[Collection Request] Clear Errors'
);
