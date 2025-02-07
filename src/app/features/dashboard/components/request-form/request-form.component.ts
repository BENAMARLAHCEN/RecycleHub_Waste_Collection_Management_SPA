// src/app/features/dashboard/components/request-form/request-form.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { WasteType } from '../../../../shared/models/collection-request.model';
import { TIME_SLOTS } from '../../../../shared/constants/time-slots';
import {createRequest} from "../../../../store/actions/collection-request.actions";

@Component({
  selector: 'app-request-form',
  template: `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">New Collection Request</h2>
          <button (click)="close.emit()" class="text-gray-500 hover:text-gray-700">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form [formGroup]="requestForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Waste Items -->
          <div formArrayName="wasteItems">
            <label class="block text-sm font-medium text-gray-700 mb-2">Waste Items</label>
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
                         class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                </div>
                <button type="button"
                        (click)="removeWasteItem(i)"
                        class="text-red-600 hover:text-red-700">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <button type="button"
                    (click)="addWasteItem()"
                    class="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Add Item
            </button>
          </div>

          <!-- Collection Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Collection Date</label>
              <input type="date"
                     formControlName="collectionDate"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
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
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"></textarea>
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
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"></textarea>
          </div>

          <!-- Photos -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Photos</label>
            <input type="file"
                   multiple
                   accept="image/*"
                   (change)="onPhotosSelected($event)"
                   class="mt-1 block w-full">
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button type="submit"
                    [disabled]="requestForm.invalid || requestForm.pristine"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RequestFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  requestForm: FormGroup;
  timeSlots = TIME_SLOTS;
  wasteTypes = Object.values(WasteType);
  photos: string[] = [];

  constructor(private fb: FormBuilder, private store: Store) {
    this.requestForm = this.fb.group({
      wasteItems: this.fb.array([]),
      collectionDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      notes: [''],
      photos: [[]]
    });
  }

  ngOnInit(): void {
    this.addWasteItem();
  }

  get wasteItems() {
    return this.requestForm.get('wasteItems') as FormArray;
  }

  addWasteItem() {
    const wasteItem = this.fb.group({
      type: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0.1)]]
    });
    this.wasteItems.push(wasteItem);
  }

  removeWasteItem(index: number) {
    this.wasteItems.removeAt(index);
  }

  onPhotosSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    this.photos = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photos.push(e.target.result);
        if (this.photos.length === files.length) {
          this.requestForm.patchValue({ photos: this.photos });
        }
      };
      reader.readAsDataURL(files[i]);
    }
  }

  onSubmit() {
    if (this.requestForm.valid) {
      const totalWeight = this.wasteItems.controls.reduce(
        (sum, control) => sum + Number(control.get('weight')?.value || 0),
        0
      );

      if (totalWeight > 10) {
        alert('Total weight cannot exceed 10kg');
        return;
      }

      // Dispatch create request action
      this.store.dispatch(createRequest({ request: this.requestForm.value }));
      this.close.emit();
    }
  }
}
