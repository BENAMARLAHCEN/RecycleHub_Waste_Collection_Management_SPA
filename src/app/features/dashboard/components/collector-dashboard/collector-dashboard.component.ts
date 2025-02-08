// src/app/features/dashboard/components/collector-dashboard/collector-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, take, switchMap } from 'rxjs';
import { CollectionRequest, RequestStatus } from '../../../../shared/models/collection-request.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CollectorService, CollectorStats } from '../../../../core/services/collector.service';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-collector-dashboard',
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Stats Overview -->
      <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div *ngIf="collectorStats$ | async as stats"
             class="bg-white rounded-lg shadow p-4">
          <h4 class="text-sm font-medium text-gray-500">Total Collections</h4>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{stats.totalCollections}}</p>
        </div>
        <div *ngIf="collectorStats$ | async as stats"
             class="bg-white rounded-lg shadow p-4">
          <h4 class="text-sm font-medium text-gray-500">Completed</h4>
          <p class="mt-2 text-3xl font-bold text-green-600">{{stats.completedCollections}}</p>
        </div>
        <div *ngIf="collectorStats$ | async as stats"
             class="bg-white rounded-lg shadow p-4">
          <h4 class="text-sm font-medium text-gray-500">Pending</h4>
          <p class="mt-2 text-3xl font-bold text-yellow-600">{{stats.pendingCollections}}</p>
        </div>
        <div *ngIf="collectorStats$ | async as stats"
             class="bg-white rounded-lg shadow p-4">
          <h4 class="text-sm font-medium text-gray-500">Total Weight (kg)</h4>
          <p class="mt-2 text-3xl font-bold text-blue-600">{{stats.totalWeight}}</p>
        </div>
      </div>

      <!-- Available Requests -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900">Available Requests</h3>
          <div class="mt-4">
            <div *ngFor="let request of availableRequests$ | async"
                 class="mb-4 p-4 border rounded-lg hover:bg-gray-50">
              <div class="flex justify-between items-center">
                <div class="flex-grow">
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
                  <button *ngIf="collection.status === RequestStatus.IN_PROGRESS"
                          (click)="showValidationForm = collection.id"
                          class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50">
                    Validate
                  </button>
                  <button *ngIf="collection.status === RequestStatus.OCCUPIED"
                          (click)="startCollection(collection)"
                          class="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                    Start Collection
                  </button>
                </div>
              </div>

              <!-- Validation Form -->
              <div *ngIf="showValidationForm === collection.id"
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

                  <div class="flex justify-end space-x-2">
                    <button type="button"
                            (click)="showValidationForm = null"
                            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit"
                            [disabled]="!validationForm.valid"
                            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
                      Complete Validation
                    </button>
                  </div>
                </form>
              </div>
            </div>

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
// Continuing CollectorDashboardComponent...
export class CollectorDashboardComponent implements OnInit {
  availableRequests$: Observable<CollectionRequest[]>;
  activeCollections$: Observable<CollectionRequest[]>;
  collectorStats$: Observable<CollectorStats>;
  currentUser$: Observable<User | null>;
  RequestStatus = RequestStatus;
  validationForm: FormGroup;
  validationPhotos: string[] = [];
  showValidationForm: string | null | undefined = null;

  constructor(
    private authService: AuthService,
    private collectorService: CollectorService,
    private fb: FormBuilder
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.validationForm = this.fb.group({
      validatedWeight: ['', [Validators.required, Validators.min(0)]]
    });

    // Initialize observables
    this.availableRequests$ = new Observable<CollectionRequest[]>();
    this.activeCollections$ = new Observable<CollectionRequest[]>();
    this.collectorStats$ = new Observable<CollectorStats>();
  }

  ngOnInit(): void {
    // Load collector data based on current user
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user?.id && user?.city) {
        // Load available requests in collector's city
        this.availableRequests$ = this.collectorService.getAvailableRequestsByCity(user.city);

        // Load active collections for this collector
        this.activeCollections$ = this.collectorService.getActiveCollections(user.id);

        // Load collector stats
        this.collectorStats$ = this.collectorService.getCollectorStats(user.id);
      }
    });
  }

  acceptRequest(request: CollectionRequest): void {
    this.currentUser$.pipe(
      take(1),
      switchMap(user => {
        if (!user?.id) {
          throw new Error('User not authenticated');
        }
        return this.collectorService.acceptRequest(request.id!, user.id);
      })
    ).subscribe({
      next: () => {
        // Refresh the lists after accepting
        this.refreshCollections();
      },
      error: (error) => {
        alert(error.message);
      }
    });
  }

  startCollection(collection: CollectionRequest): void {
    if (collection.id) {
      this.collectorService.startCollection(collection.id)
        .subscribe({
          next: () => {
            this.refreshCollections();
          },
          error: (error) => {
            alert(error.message);
          }
        });
    }
  }

  validateCollection(collection: CollectionRequest): void {
    if (this.validationForm.valid && collection.id) {  // Added null check
      const validatedWeight = this.validationForm.get('validatedWeight')?.value;

      this.collectorService.completeCollection(
        collection.id,
        validatedWeight,
        this.validationPhotos
      ).subscribe({
        next: () => {
          this.showValidationForm = null;
          this.validationForm.reset();
          this.validationPhotos = [];
          this.refreshCollections();
        },
        error: (error) => {
          alert(error.message);
        }
      });
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

  private refreshCollections(): void {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user?.id && user?.city) {
        // Refresh available requests
        this.availableRequests$ = this.collectorService.getAvailableRequestsByCity(user.city);

        // Refresh active collections
        this.activeCollections$ = this.collectorService.getActiveCollections(user.id);

        // Refresh collector stats
        this.collectorStats$ = this.collectorService.getCollectorStats(user.id);
      }
    });
  }
}
