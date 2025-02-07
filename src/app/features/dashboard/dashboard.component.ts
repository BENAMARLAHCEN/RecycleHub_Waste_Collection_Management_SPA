// src/app/features/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CollectionRequest } from '../../shared/models/collection-request.model';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Dashboard Header -->
      <div class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </div>

      <!-- Dashboard Content -->
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <ng-container *ngIf="currentUser$ | async as user">
            <app-collector-dashboard *ngIf="user.isCollector"></app-collector-dashboard>
            <app-user-dashboard *ngIf="!user.isCollector"></app-user-dashboard>
          </ng-container>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }
}
