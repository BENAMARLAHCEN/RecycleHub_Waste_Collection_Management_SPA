
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {map, Observable} from 'rxjs';
import { CollectionRequest, RequestStatus, WasteType } from '../../../../shared/models/collection-request.model';
import { AuthService } from '../../../../core/services/auth.service';
import * as CollectionRequestActions from '../../../../store/actions/collection-request.actions';

@Component({
  selector: 'app-request-list',
  template: `
    <div class="space-y-4">
      <!-- Filter Controls -->
      <div class="mb-4 flex gap-4">
        <select
          [(ngModel)]="statusFilter"
          (change)="applyFilters()"
          class="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
          <option value="">All Statuses</option>
          <option *ngFor="let status of Object.values(RequestStatus)" [value]="status">
            {{status}}
          </option>
        </select>

        <select
          *ngIf="isCollector"
          [(ngModel)]="sortBy"
          (change)="applyFilters()"
          class="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
          <option value="date">Sort by Date</option>
          <option value="weight">Sort by Weight</option>
        </select>
      </div>

      <ng-container *ngIf="filteredRequests$ | async as requests">
        <!-- Empty State -->
        <div *ngIf="requests.length === 0" class="text-center py-8">
          <p class="text-gray-500">No collection requests found</p>
        </div>

        <!-- Request List -->
        <div *ngFor="let request of requests" class="bg-white shadow rounded-lg p-4 mb-4">
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <!-- Header -->
              <div class="flex items-center space-x-2 mb-3">
                <span class="text-sm font-medium text-gray-500">Request #{{request.id}}</span>
                <span [class]="getStatusClass(request.status)"
                      class="px-2 py-1 text-xs rounded-full">
                  {{request.status}}
                </span>
              </div>

              <!-- Details -->
              <div class="space-y-2">
                <!-- Waste Items -->
                <div class="text-sm text-gray-600">
                  <span class="font-medium">Materials:</span>
                  <div class="ml-2">
                    <div *ngFor="let item of request.wasteItems" class="flex justify-between max-w-xs">
                      <span>{{item.type}}</span>
                      <span>{{item.weight}} kg</span>
                    </div>
                  </div>
                </div>

                <!-- Total Weight -->
                <div class="text-sm text-gray-600">
                  <span class="font-medium">Total Weight:</span>
                  <span>{{request.totalWeight}} kg</span>
                  <span *ngIf="request.validatedWeight" class="ml-2 text-green-600">
                    (Validated: {{request.validatedWeight}} kg)
                  </span>
                </div>

                <!-- Collection Details -->
                <div class="text-sm text-gray-600">
                  <span class="font-medium">Collection:</span>
                  {{request.collectionDate | date}} at {{request.timeSlot}}
                </div>

                <!-- Address -->
                <div class="text-sm text-gray-600">
                  <span class="font-medium">Location:</span>
                  {{request.address}}, {{request.city}}
                </div>

                <!-- Notes -->
                <div *ngIf="request.notes" class="text-sm text-gray-600">
                  <span class="font-medium">Notes:</span>
                  {{request.notes}}
                </div>

                <!-- Photos -->
                <div *ngIf="request.photos?.length" class="mt-3">
                  <span class="text-sm font-medium text-gray-600">Photos:</span>
                  <div class="flex gap-2 mt-1">
                    <img *ngFor="let photo of request.photos"
                         [src]="photo"
                         alt="Request photo"
                         class="h-20 w-20 object-cover rounded-md">
                  </div>
                </div>

                <!-- Validation Photos -->
                <div *ngIf="request.validationPhotos?.length" class="mt-3">
                  <span class="text-sm font-medium text-gray-600">Validation Photos:</span>
                  <div class="flex gap-2 mt-1">
                    <img *ngFor="let photo of request.validationPhotos"
                         [src]="photo"
                         alt="Validation photo"
                         class="h-20 w-20 object-cover rounded-md">
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-start space-x-2">
              <!-- Edit/Delete for Pending Requests -->
              <ng-container *ngIf="request.status === RequestStatus.PENDING && !isCollector">
                <button (click)="onEdit(request)"
                        class="p-2 text-blue-600 hover:text-blue-700"
                        title="Edit request">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button (click)="onDelete(request.id!)"
                        class="p-2 text-red-600 hover:text-red-700"
                        title="Delete request">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </ng-container>

              <!-- Collector Actions -->
              <ng-container *ngIf="isCollector">
                <button *ngIf="request.status === RequestStatus.PENDING"
                        (click)="onAccept(request.id!)"
                        class="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                  Accept
                </button>

                <button *ngIf="request.status === RequestStatus.OCCUPIED"
                        (click)="onStartCollection(request.id!)"
                        class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Start Collection
                </button>
              </ng-container>
            </div>
          </div>

          <!-- Validation Form for Collectors -->
          <div *ngIf="request.status === RequestStatus.IN_PROGRESS && isCollector"
               class="mt-4 border-t pt-4">
            <form [formGroup]="validationForm" (ngSubmit)="onValidate(request.id!)" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Validated Weight (kg)</label>
                <input type="number"
                       formControlName="validatedWeight"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                <div *ngIf="validationForm.get('validatedWeight')?.touched && validationForm.get('validatedWeight')?.invalid"
                     class="mt-1 text-sm text-red-600">
                  Please enter a valid weight
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Validation Photos</label>
                <input type="file"
                       multiple
                       accept="image/*"
                       (change)="onValidationPhotosSelected($event)"
                       class="mt-1 block w-full">
              </div>

              <div class="flex justify-end space-x-2">
                <button type="button"
                        (click)="onReject(request.id!)"
                        class="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50">
                  Reject
                </button>
                <button type="submit"
                        [disabled]="!validationForm.valid"
                        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
                  Validate
                </button>
              </div>
            </form>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class RequestListComponent implements OnInit {
  @Input() limit?: number;
  @Input() cityFilter?: string;
  @Output() editRequest = new EventEmitter<CollectionRequest>();

  requests$: Observable<CollectionRequest[]>;
  filteredRequests$: Observable<CollectionRequest[]>;
  RequestStatus = RequestStatus;
  Object = Object;
  isCollector: boolean = false;
  validationForm: FormGroup;
  validationPhotos: string[] = [];
  statusFilter: string = '';
  sortBy: string = 'date';

  constructor(
    private store: Store<{ collectionRequests: { requests: CollectionRequest[] } }>,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.requests$ = this.store.select(state => state.collectionRequests.requests);
    this.filteredRequests$ = this.requests$;
    this.validationForm = this.fb.group({
      validatedWeight: ['', [Validators.required, Validators.min(0.1)]],
      rejectionReason: ['']
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isCollector = user?.isCollector || false;

      if (user) {
        if (this.cityFilter) {
          this.store.dispatch(CollectionRequestActions.loadCityRequests({ city: this.cityFilter }));
        } else {
          this.store.dispatch(CollectionRequestActions.loadUserRequests({ userId: user.id ?? '' }));
        }
      }
    });
  }

  applyFilters() {
    this.filteredRequests$ = this.requests$.pipe(
      map(requests => {
        let filtered = [...requests];
        if (this.statusFilter) {
          filtered = filtered.filter(r => r.status === this.statusFilter);
        }
        if (this.sortBy === 'date') {
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (this.sortBy === 'weight') {
          filtered.sort((a, b) => b.totalWeight - a.totalWeight);
        }
        if (this.limit) {
          filtered = filtered.slice(0, this.limit);
        }

        return filtered;
      })
    );
  }

  getStatusClass(status: RequestStatus): string {
    switch (status) {
      case RequestStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case RequestStatus.OCCUPIED:
        return 'bg-blue-100 text-blue-800';
      case RequestStatus.IN_PROGRESS:
        return 'bg-purple-100 text-purple-800';
      case RequestStatus.VALIDATED:
        return 'bg-green-100 text-green-800';
      case RequestStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  onValidationPhotosSelected(event: Event) {
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

  onValidate(requestId: string) {
    if (this.validationForm.valid) {
      this.store.dispatch(CollectionRequestActions.validateRequest({
        requestId,
        validatedWeight: this.validationForm.value.validatedWeight,
        photos: this.validationPhotos
      }));
      this.validationForm.reset();
      this.validationPhotos = [];
    }
  }

  onReject(requestId: string) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      this.store.dispatch(CollectionRequestActions.updateRequest({
        requestId,
        request: {
          status: RequestStatus.REJECTED,
          rejectionReason: reason
        }
      }));
    }
  }

  onAccept(requestId: string) {
    this.store.dispatch(CollectionRequestActions.updateRequest({
      requestId,
      request: { status: RequestStatus.OCCUPIED }
    }));
  }

  onStartCollection(requestId: string) {
    this.store.dispatch(CollectionRequestActions.updateRequest({
      requestId,
      request: { status: RequestStatus.IN_PROGRESS }
    }));
  }

  onEdit(request: CollectionRequest) {
    if (request.status !== RequestStatus.PENDING) {
      alert('Only pending requests can be edited');
      return;
    }
    this.editRequest.emit(request);
  }

  onDelete(requestId: string) {
    if (confirm('Are you sure you want to delete this request?')) {
      this.store.dispatch(CollectionRequestActions.deleteRequest({ requestId }));
    }
  }
}
