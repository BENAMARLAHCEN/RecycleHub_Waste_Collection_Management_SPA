// src/app/shared/components/navbar/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import * as AuthActions from '../../../store/actions/auth.actions';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="bg-white shadow-lg fixed w-full z-50">
      <!-- Main Navbar Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo Section -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center">
              <svg class="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span class="ml-2 text-2xl font-bold text-green-600">RecycleHub</span>
            </a>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-8">
            <!-- Navigation Links -->
            <a routerLink="/"
              routerLinkActive="text-green-600"
              [routerLinkActiveOptions]="{exact: true}"
              class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
              Home
            </a>
            <a routerLink="/#materials"
              routerLinkActive="text-green-600"
              class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
              Materials
            </a>
            <a routerLink="/points"
              routerLinkActive="text-green-600"
              class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
              Points
            </a>

            <!-- Auth Section -->
            <ng-container *ngIf="(currentUser$ | async) as user; else authButtons">
              <!-- User Dropdown -->
              <div class="relative" #dropdown>
                <button
                  (click)="toggleDropdown()"
                  class="flex items-center space-x-2 text-gray-700 hover:text-green-600 focus:outline-none">
                  <img
                    [src]="user.profilePhoto || 'assets/images/default-avatar.png'"
                    alt="Profile"
                    class="h-8 w-8 rounded-full object-cover border-2 border-gray-200">
                  <span class="font-medium">{{ user.firstName }}</span>
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div *ngIf="isDropdownOpen"
                  class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div class="py-1">
                    <a routerLink="/profile"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </a>
                    <a routerLink="/dashboard"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </a>
                    <a routerLink="/my-collections"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Collections
                    </a>
                    <hr class="my-1">
                    <button
                      (click)="logout()"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </ng-container>

            <!-- Auth Buttons for Non-authenticated Users -->
            <ng-template #authButtons>
              <div class="flex items-center space-x-4">
                <a routerLink="/auth/login"
                  class="text-green-600 hover:text-green-700 px-4 py-2 rounded-md text-sm font-medium border border-green-600 hover:border-green-700 transition duration-150 ease-in-out">
                  Sign in
                </a>
                <a routerLink="/auth/register"
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                  Sign up
                </a>
              </div>
            </ng-template>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center">
            <button
              (click)="toggleMobileMenu()"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none">
              <svg
                class="h-6 w-6"
                [class.hidden]="isMobileMenuOpen"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                class="h-6 w-6"
                [class.hidden]="!isMobileMenuOpen"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="md:hidden" [class.hidden]="!isMobileMenuOpen">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a routerLink="/"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
            Home
          </a>
          <a routerLink="/materials"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
            Materials
          </a>
          <a routerLink="/points"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
            Points
          </a>
        </div>

        <!-- Mobile Auth Section -->
        <div class="pt-4 pb-3 border-t border-gray-200">
          <ng-container *ngIf="(currentUser$ | async) as user">
            <div class="flex items-center px-5">
              <div class="flex-shrink-0">
                <img
                  [src]="user.profilePhoto || 'assets/icons/default-avatar.svg'"
                  alt="Profile"
                  class="h-10 w-10 rounded-full">
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-gray-800">{{ user.firstName }} {{ user.lastName }}</div>
                <div class="text-sm font-medium text-gray-500">{{ user.email }}</div>
              </div>
            </div>
            <div class="mt-3 px-2 space-y-1">
              <a routerLink="/profile"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                Profile
              </a>
              <a routerLink="/dashboard"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                Dashboard
              </a>
              <a routerLink="/my-collections"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                My Collections
              </a>
              <button
                (click)="logout()"
                class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50">
                Sign out
              </button>
            </div>
          </ng-container>

          <ng-container *ngIf="!(currentUser$ | async)">
            <div class="px-2 space-y-1">
              <a routerLink="/auth/login"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                Sign in
              </a>
              <a routerLink="/auth/register"
                class="block px-3 py-2 rounded-md text-base font-medium text-green-600 hover:text-green-700 hover:bg-gray-50">
                Sign up
              </a>
            </div>
          </ng-container>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  currentUser$: Observable<User | null>;
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  constructor(
    private store: Store<{ auth: { user: User | null } }>,
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    document.addEventListener('click', (event) => {
      const dropdown = document.getElementById('userDropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        this.isDropdownOpen = false;
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.authService.logout();
    this.router.navigate(['/']);
    this.isDropdownOpen = false;
    this.isMobileMenuOpen = false;
  }
}
