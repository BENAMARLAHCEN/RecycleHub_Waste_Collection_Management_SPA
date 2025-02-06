// src/app/features/dashboard/components/collector-dashboard/collector-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CollectionRequest, RequestStatus, WasteType } from '../../../../shared/models/collection-request.model';

@Component({
  selector: 'app-collector-dashboard',
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Available Requests -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900">Available Requests</h3>
          <div class="mt-4">
            <div *ngFor="let request of availableRequests"
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
          </div>
        </div>
      </div>

      <!-- Active Collections -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900">Active Collections</h3>
          <div class="mt-4">
            <div *ngFor="let collection of activeCollections"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CollectorDashboardComponent implements OnInit {
  availableRequests: CollectionRequest[] = [];
  activeCollections: CollectionRequest[] = [];
  RequestStatus = RequestStatus; // Make enum available in template

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Load available requests and active collections
    this.loadRequests();
  }

  loadRequests(): void {
    // Example data - replace with actual store implementation
    this.availableRequests = [
      {
        id: '1',
        userId: 'user1',
        wasteItems: [
          { type: WasteType.PLASTIC, weight: 2 },
          { type: WasteType.GLASS, weight: 3 }
        ],
        totalWeight: 5,
        address: '123 Green Street',
        city: 'Eco City',
        collectionDate: new Date(),
        timeSlot: '09:00 - 10:00',
        status: RequestStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  acceptRequest(request: CollectionRequest): void {
    const updatedRequest = {
      ...request,
      status: RequestStatus.OCCUPIED,
      collectorId: 'currentCollectorId', // Replace with actual collector ID
      updatedAt: new Date()
    };
    // Dispatch action to update request
    this.activeCollections = [...this.activeCollections, updatedRequest];
    this.availableRequests = this.availableRequests.filter(r => r.id !== request.id);
  }

  updateStatus(collection: CollectionRequest): void {
    const nextStatus = this.getNextStatus(collection.status);
    const updatedCollection = {
      ...collection,
      status: nextStatus,
      updatedAt: new Date()
    };
    // Dispatch action to update collection
    this.activeCollections = this.activeCollections.map(c =>
      c.id === collection.id ? updatedCollection : c
    );
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
