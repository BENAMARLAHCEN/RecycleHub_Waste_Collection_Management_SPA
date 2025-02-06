// src/app/features/dashboard/components/user-dashboard/user-dashboard.component.ts
  import { Component } from '@angular/core';

  @Component({
    selector: 'app-user-dashboard',
    template: `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Quick Actions Card -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900">Quick Actions</h3>
            <div class="mt-6 grid gap-4">
              <button (click)="showRequestForm()"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                New Collection Request
              </button>
              <button (click)="showPointsConversion()"
                class="inline-flex items-center px-4 py-2 border border-green-600 shadow-sm text-sm font-medium rounded-md text-green-600 bg-white hover:bg-green-50">
                Convert Points
              </button>
            </div>
          </div>
        </div>

        <!-- Points Overview Card -->
<!--        <div class="bg-white overflow-hidden shadow rounded-lg">-->
<!--          <div class="p-6">-->
<!--            <h3 class="text-lg font-medium text-gray-900">Points Overview</h3>-->
<!--            <app-points-overview></app-points-overview>-->
<!--          </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; Recent Requests Card &ndash;&gt;-->
<!--        <div class="bg-white overflow-hidden shadow rounded-lg">-->
<!--          <div class="p-6">-->
<!--            <h3 class="text-lg font-medium text-gray-900">Recent Requests</h3>-->
<!--            <app-request-list [limit]="5"></app-request-list>-->
<!--          </div>-->
<!--        </div>-->
      </div>

      <!-- Request Form Modal -->
<!--      <app-request-form *ngIf="showingRequestForm"-->
<!--        (close)="hideRequestForm()">-->
<!--      </app-request-form>-->
    `
  })
  export class UserDashboardComponent {
    showingRequestForm = false;

    showRequestForm(): void {
      this.showingRequestForm = true;
    }

    hideRequestForm(): void {
      this.showingRequestForm = false;
    }

    showPointsConversion(): void {
      // Implement points conversion modal
    }
  }
