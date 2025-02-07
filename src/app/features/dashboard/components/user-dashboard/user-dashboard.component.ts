// src/app/features/dashboard/components/user-dashboard/user-dashboard.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {CollectionRequest} from "../../../../shared/models/collection-request.model";
import {AuthService} from "../../../../core/services/auth.service";
import {selectError, selectLoading} from "../../../../store/selectors/collection-request.selectors";


@Component({
  selector: 'app-user-dashboard',
  template: `
    <div class="grid grid-cols-1 gap-6">
      <!-- Status Messages -->
      <div *ngIf="error$ | async as error"
           class="bg-red-50 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{{error}}</h3>
          </div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div *ngIf="loading$ | async"
           class="flex justify-center items-center py-4">
        <svg class="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Quick Actions Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900">Quick Actions</h3>
          <div class="mt-6 grid gap-4">
            <button (click)="showRequestForm = true"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
              <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Collection Request
            </button>
          </div>
        </div>
      </div>

      <!-- My Requests -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">My Collection Requests</h3>
          <app-request-list
            (editRequest)="onEditRequest($event)">
          </app-request-list>
        </div>
      </div>

      <!-- Request Form Modal -->
      <app-request-form
        *ngIf="showRequestForm"
        (close)="showRequestForm = false">
      </app-request-form>

      <!-- Edit Form Modal -->
      <app-collection-edit
        *ngIf="requestToEdit"
        [request]="requestToEdit"
        (close)="requestToEdit = null">
      </app-collection-edit>
    </div>
  `
})
export class UserDashboardComponent {
  showRequestForm = false;
  requestToEdit: CollectionRequest | null = null;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private store: Store,
    private authService: AuthService
  ) {
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  onEditRequest(request: CollectionRequest): void {
    this.requestToEdit = request;
  }
}
