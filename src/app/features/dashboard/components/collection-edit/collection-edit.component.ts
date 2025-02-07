// src/app/features/dashboard/components/collection-edit/collection-edit.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CollectionRequest, WasteType } from '../../../../shared/models/collection-request.model';
import { TIME_SLOTS } from '../../../../shared/constants/time-slots';
import * as CollectionRequestActions from '../../../../store/actions/collection-request.actions';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-collection-edit',
  template: `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Edit Collection Request</h2>
          <button (click)="close.emit()" class="text-gray-500 hover:text-gray-700">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form [formGroup]="editForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Waste Items -->
          <div formArrayName="wasteItems">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Waste Items
              <span class="text-xs text-gray-500 ml-1">
                (Total: {{totalWeight}} kg)
              </span>
            </label>

            <div class="space-y-4">
              <div *ngFor="let item of wasteItems.controls; let i = index"
                   [formGroupName]="i"
                   class="flex items-center space-x-4">
                <div class="flex-1">
                  <select formControlName="type"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                    <option value="">Select type</option>
                    <option *ngFor="let type of wasteTypes" [value]="type">
                      {{type}}
                    </option>
                  </select>
                </div>
                <div class="flex-1">
                  <input type="number"
                         formControlName="weight"
                         placeholder="Weight in kg"
                         (input)="updateTotalWeight()"
                         class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                </div>
                <button type="button"
                        (click)="removeWasteItem(i)"
                        [disabled]="wasteItems.length === 1"
                        class="text-red-600 hover:text-red-700 disabled:opacity-50">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="mt-2 flex justify-between items-center">
              <button type="button"
                      (click)="addWasteItem()"
                      class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Add Item
              </button>

              <div *ngIf="totalWeight > environment.maxCollectionWeight"
                   class="text-sm text-red-600">
                Total weight cannot exceed {{environment.maxCollectionWeight}} kg
              </div>
            </div>
          </div>

          <!-- Collection Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Collection Date</label>
              <input type="date"
                     formControlName="collectionDate"
                     [min]="minDate"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                <div *ngIf="editForm.get('collectionDate')?.touched && editForm.get('collectionDate')?.invalid"
                     class="mt-1 text-sm text-red-600">
                  Please select a valid future date
                </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Time Slot</label>
              <select formControlName="timeSlot"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                <option value="">Select time slot</option>
                <option *ngFor="let slot of timeSlots" [value]="slot">
                  {{slot}}
                </option>
              </select>
            </div>
          </div>

          <!-- Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Collection Address</label>
            <textarea formControlName="address"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
            </textarea>
          </div>

          <!-- City -->
          <div>
            <label class="block text-sm font-medium text-gray-700">City</label>
            <input type="text"
                   formControlName="city"
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea formControlName="notes"
                      rows="2"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
            </textarea>
          </div>

          <!-- Photos -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Photos</label>
            <input type="file"
                   multiple
                   accept="image/*"
                   (change)="onPhotosSelected($event)"
                   class="mt-1 block w-full">

            <!-- Existing Photos -->
            <div *ngIf="existingPhotos.length" class="mt-2">
              <div class="text-sm font-medium text-gray-700 mb-2">Current Photos:</div>
              <div class="flex flex-wrap gap-2">
                <div *ngFor="let photo of existingPhotos; let i = index"
                     class="relative group">
                  <img [src]="photo"
                       class="h-20 w-20 object-cover rounded-md">
                  <button type="button"
                          (click)="removeExistingPhoto(i)"
                          class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-3">
            <button type="button"
                    (click)="close.emit()"
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit"
                    [disabled]="!editForm.valid || totalWeight > environment.maxCollectionWeight"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CollectionEditComponent implements OnInit {
  @Input() request!: CollectionRequest;
  @Output() close = new EventEmitter<void>();

  editForm: FormGroup;
  timeSlots = TIME_SLOTS;
  wasteTypes = Object.values(WasteType);
  totalWeight = 0;
  minDate: string;
  environment = environment;
  existingPhotos: string[] = [];
  newPhotos: string[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.editForm = this.fb.group({
      wasteItems: this.fb.array([]),
      collectionDate: ['', [Validators.required]],
      timeSlot: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    if (this.request) {
      // Initialize waste items
      this.request.wasteItems.forEach(item => {
        this.addWasteItem(item);
      });

      // Set existing photos
      this.existingPhotos = this.request.photos || [];

      // Set other form values
      this.editForm.patchValue({
        collectionDate: new Date(this.request.collectionDate).toISOString().split('T')[0],
        timeSlot: this.request.timeSlot,
        address: this.request.address,
        city: this.request.city,
        notes: this.request.notes
      });

      this.updateTotalWeight();
    } else {
      this.addWasteItem();
    }
  }

  get wasteItems() {
    return this.editForm.get('wasteItems') as FormArray;
  }

  addWasteItem(item?: { type: WasteType; weight: number }) {
    const wasteItem = this.fb.group({
      type: [item?.type || '', Validators.required],
      weight: [item?.weight || '', [Validators.required, Validators.min(0.1)]]
    });
    this.wasteItems.push(wasteItem);
  }

  removeWasteItem(index: number) {
    this.wasteItems.removeAt(index);
    this.updateTotalWeight();
  }

  updateTotalWeight() {
    this.totalWeight = this.wasteItems.controls.reduce(
      (sum, control) => sum + (Number(control.get('weight')?.value) || 0),
      0
    );
  }

  removeExistingPhoto(index: number) {
    this.existingPhotos.splice(index, 1);
  }

  onPhotosSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newPhotos.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  onSubmit() {
    if (this.editForm.valid && this.totalWeight <= environment.maxCollectionWeight) {
      const updatedRequest = {
        ...this.editForm.value,
        photos: [...this.existingPhotos, ...this.newPhotos],
        totalWeight: this.totalWeight
      };

      this.store.dispatch(CollectionRequestActions.updateRequest({
        requestId: this.request.id!,
        request: updatedRequest
      }));

      this.close.emit();
    }
  }
}
