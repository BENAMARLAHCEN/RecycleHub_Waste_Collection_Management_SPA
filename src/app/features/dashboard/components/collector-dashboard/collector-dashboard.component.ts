// src/app/features/dashboard/components/collector-dashboard/collector-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollectionRequest, RequestStatus, WasteType } from '../../../../shared/models/collection-request.model';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../shared/models/user.model';
import * as CollectionRequestActions from '../../../../store/actions/collection-request.actions';
import { environment } from '../../../../../environments/environment';
import { CollectionRequestState } from '../../../../store/reducers/collection-request.reducer';

interface AppState {
  collectionRequests: CollectionRequestState;
}

@Component({
  selector: 'app-collector-dashboard',
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Available Requests -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900">Available Requests</h3>
          <div class="mt-4">
            <div *ngFor="let request of availableRequests$ | async"
                 class="mb-4 p-4 border rounded-lg hover:bg-gray-50">
              <div class="flex justify-between items-center">
                <div class="flex-grow">
                  <!-- Display all waste types -->
                  <div class="mb-2">
                    <span class="font-medium">Waste Types:</span>
                    <div class="mt-1">
                      <div *ngFor="let item of request.wasteItems" class="text-sm">
                        {{item.type}}: {{item.weight}}kg
                      </div>
                    </div>
                  </div>
                  <p class="text-sm text-gray-500">{{request.address}}</p>
                  <p class="text-sm text-gray-500">Total: {{request.totalWeight}}kg</p>
                  <p class="text-sm text-gray-500">
                    {{request.collectionDate | date}} - {{request.timeSlot}}
                  </p>
                </div>
                <div class="ml-4">
                  <button (click)="acceptRequest(request)"
                          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Accept
                  </button>
                </div>
              </div>
              <div *ngIf="request.notes" class="mt-2 text-sm text-gray-500">
                <span class="font-medium">Notes:</span> {{request.notes}}
              </div>
            </div>

            <!-- No requests message -->
            <div *ngIf="(availableRequests$ | async)?.length === 0"
                 class="text-center text-gray-500 py-4">
              No available requests in your city
            </div>
          </div>
        </div>
      </div>

      <!-- Active Collections -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900">Active Collections</h3>
          <div class="mt-4">
            <div *ngFor="let collection of activeCollections$ | async"
                 class="mb-4 p-4 border rounded-lg">
              <div class="flex justify-between items-center">
                <div class="flex-grow">
                  <div class="mb-2">
                    <span class="font-medium">Waste Types:</span>
                    <div class="mt-1">
                      <div *ngFor="let item of collection.wasteItems" class="text-sm">
                        {{item.type}}: {{item.weight}}kg
                      </div>
                    </div>
                  </div>
                  <p class="text-sm text-gray-500">Status: {{collection.status}}</p>
                  <p class="text-sm text-gray-500">{{collection.address}}</p>
                </div>
                <div class="ml-4">
                  <button *ngIf="collection.status !== RequestStatus.VALIDATED"
                          (click)="updateStatus(collection)"
                          class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50">
                    {{getNextStatusLabel(collection.status)}}
                  </button>
                </div>
              </div>

              <!-- Validation Form -->
              <div *ngIf="collection.status === RequestStatus.IN_PROGRESS"
                   class="mt-4 border-t pt-4">
                <form [formGroup]="validationForm" (ngSubmit)="validateCollection(collection)" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Validated Weight (kg)</label>
                    <input type="number"
                           formControlName="validatedWeight"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                           [min]="0"
                           [max]="collection.totalWeight">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Validation Photos</label>
                    <input type="file"
                           multiple
                           accept="image/*"
                           (change)="onValidationPhotosSelected($event)"
                           class="mt-1 block w-full">
                  </div>

                  <div class="flex justify-end">
                    <button type="submit"
                            [disabled]="!validationForm.valid"
                            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
                      Validate Collection
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- No active collections message -->
            <div *ngIf="(activeCollections$ | async)?.length === 0"
                 class="text-center text-gray-500 py-4">
              No active collections
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CollectorDashboardComponent implements OnInit {
  availableRequests$: Observable<CollectionRequest[]>;
  activeCollections$: Observable<CollectionRequest[]>;
  currentUser$: Observable<User | null>;
  RequestStatus = RequestStatus;
  validationForm: FormGroup;
  validationPhotos: string[] = [];

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.validationForm = this.fb.group({
      validatedWeight: ['', [Validators.required, Validators.min(0)]]
    });

    // Initialize observables
    this.availableRequests$ = new Observable<CollectionRequest[]>();
    this.activeCollections$ = new Observable<CollectionRequest[]>();
  }

  ngOnInit(): void {
    // Load requests based on collector's city
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user?.city) {
        this.store.dispatch(CollectionRequestActions.loadCityRequests({ city: user.city }));

        // Filter available requests
        this.availableRequests$ = this.store.select(state =>
          state.collectionRequests.requests.filter((request: CollectionRequest) =>
            request.status === RequestStatus.PENDING &&
            request.city === user.city
          )
        );

        // Filter active collections for this collector
        this.activeCollections$ = this.store.select(state =>
          state.collectionRequests.requests.filter((request: CollectionRequest) =>
            (request.status === RequestStatus.OCCUPIED ||
              request.status === RequestStatus.IN_PROGRESS) &&
            request.collectorId === user.id
          )
        );
      }
    });
  }

  acceptRequest(request: CollectionRequest): void {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.store.dispatch(CollectionRequestActions.updateRequest({
          requestId: request.id!,
          request: {
            status: RequestStatus.OCCUPIED,
            collectorId: user.id,
            updatedAt: new Date()
          }
        }));
      }
    });
  }

  updateStatus(collection: CollectionRequest): void {
    const nextStatus = this.getNextStatus(collection.status);
    this.store.dispatch(CollectionRequestActions.updateRequest({
      requestId: collection.id!,
      request: {
        status: nextStatus,
        updatedAt: new Date()
      }
    }));
  }

  validateCollection(collection: CollectionRequest): void {
    if (this.validationForm.valid) {
      const validatedWeight = this.validationForm.get('validatedWeight')?.value;

      this.store.dispatch(CollectionRequestActions.validateRequest({
        requestId: collection.id!,
        validatedWeight,
        photos: this.validationPhotos
      }));

      // Reset form and photos
      this.validationForm.reset();
      this.validationPhotos = [];
    }
  }

  onValidationPhotosSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    this.validationPhotos = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.validationPhotos.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  getNextStatus(currentStatus: RequestStatus): RequestStatus {
    switch (currentStatus) {
      case RequestStatus.OCCUPIED:
        return RequestStatus.IN_PROGRESS;
      case RequestStatus.IN_PROGRESS:
        return RequestStatus.VALIDATED;
      default:
        return currentStatus;
    }
  }

  getNextStatusLabel(currentStatus: RequestStatus): string {
    switch (currentStatus) {
      case RequestStatus.OCCUPIED:
        return 'Start Collection';
      case RequestStatus.IN_PROGRESS:
        return 'Validate';
      default:
        return 'Update Status';
    }
  }
}
