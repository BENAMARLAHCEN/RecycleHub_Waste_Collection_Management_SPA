//src/app/features/auth/components/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../../store/actions/auth.actions';

@Component({
  selector: 'app-register',
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div class="mt-1">
                <input id="email" type="email" formControlName="email"
                       class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500">
              </div>
              <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid"
                   class="mt-1 text-sm text-red-600">
                Please enter a valid email address
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div class="mt-1">
                <input id="password" type="password" formControlName="password"
                       class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500">
              </div>
            </div>

            <!-- First Name -->
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <div class="mt-1">
                <input id="firstName" type="text" formControlName="firstName"
                       class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500">
              </div>
            </div>

            <!-- Last Name -->
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <div class="mt-1">
                <input id="lastName" type="text" formControlName="lastName"
                       class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500">
              </div>
            </div>

            <!-- Address -->
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div class="mt-1">
                <input id="address" type="text" formControlName="address"
                       class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500">
              </div>
            </div>

            <!-- City -->
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700">
                City
              </label>
              <div class="mt-1">
                <input id="city" type="text" formControlName="city"
                       class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500">
              </div>
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div class="mt-1">
                <input id="phone" type="tel" formControlName="phone"
                       class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500">
              </div>
            </div>

            <!-- Birth Date -->
            <div>
              <label for="birthDate" class="block text-sm font-medium text-gray-700">
                Birth Date
              </label>
              <div class="mt-1">
                <input id="birthDate" type="date" formControlName="birthDate"
                       class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500">
              </div>
            </div>

            <!-- Collector Checkbox -->
            <div class="flex items-center">
              <input id="isCollector" type="checkbox" formControlName="isCollector"
                     class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded">
              <label for="isCollector" class="ml-2 block text-sm text-gray-900">
                Register as a Collector
              </label>
            </div>

            <div>
              <button type="submit" [disabled]="registerForm.invalid"
                      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
                Register
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  Already have an account?
                  <a routerLink="/auth/login" class="font-medium text-green-600 hover:text-green-500">
                    Sign in
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      birthDate: ['', Validators.required],
      isCollector: [false]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    console.log(this.registerForm);
    if (this.registerForm.valid) {
      this.store.dispatch(AuthActions.register({ user: this.registerForm.value }));
    }
  }
}
