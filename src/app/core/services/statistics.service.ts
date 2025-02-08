import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';
import { CollectionRequest, RequestStatus } from '../../shared/models/collection-request.model';

export interface HomeStatistics {
  activeUsers: number;
  totalCollectors: number;
  totalWasteRecycled: number;
  totalRewardsGiven: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  constructor() {}

  getHomeStatistics(): Observable<HomeStatistics> {
    const users = this.getUsers();
    const collections = this.getCollections();
    const validatedCollections = collections.filter(c => c.status === RequestStatus.VALIDATED);

    const stats: HomeStatistics = {
      activeUsers: users.filter(u => !u.isCollector).length,
      totalCollectors: users.filter(u => u.isCollector).length,
      totalWasteRecycled: validatedCollections.reduce((total, collection) =>
        total + (collection.validatedWeight || 0), 0),
      totalRewardsGiven: this.calculateTotalRewards()
    };

    return of(stats);
  }

  private calculateTotalRewards(): number {
    const vouchers = this.getVouchers();
    return vouchers.reduce((total, voucher) => total + voucher.amount, 0);
  }

  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(environment.localStorage.usersKey) || '[]');
  }

  private getCollections(): CollectionRequest[] {
    return JSON.parse(localStorage.getItem(environment.localStorage.collectionsKey) || '[]');
  }

  private getVouchers(): any[] {
    return JSON.parse(localStorage.getItem('recyclehub_vouchers') || '[]');
  }
}
