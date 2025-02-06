// src/app/features/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.model';
import * as AuthActions from '../../store/actions/auth.actions';

@Component({
  selector: 'app-profile',
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white shadow rounded-lg">
          <!-- Profile Header -->
          <div class="px-4 py-5 sm:px-6 border-b">
            <h3 class="text-2xl font-bold leading-6 text-gray-900">Profile Settings</h3>
            <p class="mt-1 text-sm text-gray-500">Manage your account information and preferences</p>
          </div>

          <div class="px-4 py-5 sm:p-6">
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Profile Photo -->
              <div>
                <div class="flex items-center space-x-4">
                  <img
                    [src]="profileForm.get('profilePhoto')?.value || 'assets/images/default-avatar.png'"
                    alt="Profile Photo"
                    class="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                  >
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Profile Photo</label>
                    <div class="mt-1 flex items-center space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        (change)="onPhotoSelected($event)"
                        class="hidden"
                        #photoInput
                      >
                      <button
                        type="button"
                        (click)="photoInput.click()"
                        class="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Change Photo
                      </button>
                      <button
                        *ngIf="profileForm.get('profilePhoto')?.value"
                        type="button"
                        (click)="removePhoto()"
                        class="px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Basic Information -->
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    formControlName="firstName"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                  <div *ngIf="profileForm.get('firstName')?.touched && profileForm.get('firstName')?.invalid"
                       class="mt-1 text-sm text-red-600">
                    First name is required
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    formControlName="lastName"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                  <div *ngIf="profileForm.get('lastName')?.touched && profileForm.get('lastName')?.invalid"
                       class="mt-1 text-sm text-red-600">
                    Last name is required
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    formControlName="email"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                  <div *ngIf="profileForm.get('email')?.touched && profileForm.get('email')?.invalid"
                       class="mt-1 text-sm text-red-600">
                    Please enter a valid email
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    formControlName="phone"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                  <div *ngIf="profileForm.get('phone')?.touched && profileForm.get('phone')?.invalid"
                       class="mt-1 text-sm text-red-600">
                    Phone number is required
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Birth Date</label>
                  <input
                    type="date"
                    formControlName="birthDate"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    formControlName="city"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                  <div *ngIf="profileForm.get('city')?.touched && profileForm.get('city')?.invalid"
                       class="mt-1 text-sm text-red-600">
                    City is required
                  </div>
                </div>
              </div>

              <!-- Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  formControlName="address"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                ></textarea>
                <div *ngIf="profileForm.get('address')?.touched && profileForm.get('address')?.invalid"
                     class="mt-1 text-sm text-red-600">
                  Address is required
                </div>
              </div>

              <!-- Points Display -->
              <div *ngIf="(currentUser$ | async) as user" class="bg-gray-50 p-4 rounded-md">
                <div class="text-sm font-medium text-gray-500">Current Points Balance</div>
                <div class="mt-1 text-2xl font-semibold text-green-600">{{ user.points || 0 }} points</div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-between space-x-4">
                <button
                  type="submit"
                  [disabled]="profileForm.invalid"
                  class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  (click)="confirmDeleteAccount()"
                  class="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Delete Account Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
          <p class="text-sm text-gray-500 mb-4">
            Are you sure you want to delete your account? This action cannot be undone and you will lose all your points and collection history.
          </p>
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              (click)="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="deleteAccount()"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser$: Observable<User | null>;
  showDeleteModal = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: { user: User | null } }>,
  ) {
    this.currentUser$ = this.store.select(state => state.auth.user);

    this.profileForm = this.fb.group({
      id: [''],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      birthDate: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      profilePhoto: [''],
      points: [0],
      isCollector: [false]
    });
  }

  ngOnInit(): void {
    this.currentUser$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          birthDate: this.formatDate(user.birthDate),
          address: user.address,
          city: user.city,
          profilePhoto: user.profilePhoto,
          points: user.points,
          isCollector: user.isCollector
        });
      }
    });
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileForm.patchValue({
          profilePhoto: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.profileForm.patchValue({
      profilePhoto: ''
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.store.dispatch(AuthActions.updateProfile({
        user: this.profileForm.value
      }));
    }
  }

  confirmDeleteAccount(): void {
    this.showDeleteModal = true;
  }

  deleteAccount(): void {
    this.store.select(state => state.auth.user?.id)
      .subscribe(userId => {
        if (userId) {
          this.store.dispatch(AuthActions.deleteAccount({ userId }));
        }
      })
      .unsubscribe();
    this.showDeleteModal = false;
  }
}
