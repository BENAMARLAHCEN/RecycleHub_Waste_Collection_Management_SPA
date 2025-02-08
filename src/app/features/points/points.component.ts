// src/app/features/points/points.component.ts
import { Component, OnInit } from '@angular/core';
import {Observable, take} from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { PointsService, VoucherTransaction } from '../../core/services/points.service';
import { User } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-points',
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Points Overview -->
        <div class="bg-white rounded-lg shadow p-6 mb-8" *ngIf="currentUser$ | async as user">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900">{{user.points || 0}}</h2>
            <p class="text-gray-600">Available Points</p>
          </div>
        </div>

        <!-- Voucher Conversion Options -->
        <div class="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-medium text-gray-900">Convert Points to Vouchers</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div *ngFor="let option of conversionOptions"
                   class="border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <div class="text-2xl font-bold text-green-600 mb-2">{{option.points}} Points</div>
                <div class="text-gray-600 mb-4">= {{option.amount | currency:'MAD':'symbol-narrow':'1.0-0'}}</div>
                <button (click)="convertPoints(option.points)"
                        class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  Convert
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Transaction History -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-medium text-gray-900">Transaction History</h3>
          </div>
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                <tr>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voucher Code
                  </th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let transaction of transactions$ | async">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{transaction.createdAt | date:'medium'}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{transaction.points}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{transaction.amount}} Dh
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {{transaction.code}}
                  </td>
                </tr>
                <tr *ngIf="(transactions$ | async)?.length === 0">
                  <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                    No transactions yet
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div *ngIf="successTransaction"
           class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <div class="mb-4">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-center text-gray-900 mb-2">Points Converted Successfully!</h3>
            <p class="text-center text-gray-600">
              Your voucher code is:
            </p>
            <div class="text-center font-mono text-lg font-bold my-2">
              {{successTransaction.code}}
            </div>
            <p class="text-center text-gray-600">
              Value: {{successTransaction.amount}} Dh
            </p>
          </div>
          <div class="flex justify-center">
            <button (click)="successTransaction = null"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PointsComponent implements OnInit {
  currentUser$: Observable<User | null>;
  transactions$: Observable<VoucherTransaction[]>;
  conversionOptions: { points: number; amount: number }[] = [];
  successTransaction: VoucherTransaction | null = null;

  constructor(
    private authService: AuthService,
    private pointsService: PointsService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.transactions$ = new Observable();

    // Initialize conversion options from environment
    const voucherConversion = environment.voucherConversion as Record<string, number>;
    this.conversionOptions = Object.entries(voucherConversion).map(([points, amount]) => ({
      points: Number(points),
      amount
    }));
  }

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user?.id) {
        this.transactions$ = this.pointsService.getUserTransactions(user.id);
      }
    });
  }

  convertPoints(points: number) {
    this.pointsService.convertToVoucher(points).subscribe({
      next: (transaction) => {
        this.successTransaction = transaction;
        this.loadTransactions();
      },
      error: (error) => {
        alert(error.message);
      }
    });
  }
}
