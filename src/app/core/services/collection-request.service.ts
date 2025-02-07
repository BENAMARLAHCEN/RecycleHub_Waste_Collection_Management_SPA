// src/app/core/services/collection-request.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { CollectionRequest, RequestStatus, WasteType } from '../../shared/models/collection-request.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionRequestService {
  constructor(private authService: AuthService) {}

  createRequest(request: Partial<CollectionRequest>): Observable<CollectionRequest> {
    const user = this.authService.currentUser$.value;
    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }

    const pendingRequests = this.getUserPendingRequests(user.id!);
    if (pendingRequests.length >= environment.maxPendingRequests) {
      return throwError(() => new Error(`Maximum of ${environment.maxPendingRequests} pending requests allowed`));
    }

    const totalWeight = request.wasteItems?.reduce((sum, item) => sum + item.weight, 0) || 0;
    if (totalWeight > environment.maxCollectionWeight || totalWeight < environment.minCollectionWeight) {
      return throwError(() => new Error(`Total weight must be between ${environment.minCollectionWeight} and ${environment.maxCollectionWeight} kg`));
    }

    const newRequest: CollectionRequest = {
      id: Date.now().toString(),
      userId: user.id!,
      status: RequestStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...request,
      totalWeight
    };

    const requests = this.getRequests();
    requests.push(newRequest);
    localStorage.setItem(environment.localStorage.collectionsKey, JSON.stringify(requests));

    return of(newRequest);
  }

  updateRequest(id: string, updates: Partial<CollectionRequest>): Observable<CollectionRequest> {
    const requests = this.getRequests();
    const index = requests.findIndex(r => r.id === id);

    if (index === -1) {
      return throwError(() => new Error('Request not found'));
    }

    const updatedRequest = {
      ...requests[index],
      ...updates,
      updatedAt: new Date()
    };

    requests[index] = updatedRequest;
    localStorage.setItem(environment.localStorage.collectionsKey, JSON.stringify(requests));

    return of(updatedRequest);
  }

  getRequestsByUser(userId: string): Observable<CollectionRequest[]> {
    const requests = this.getRequests().filter(r => r.userId === userId);
    return of(requests);
  }

  getRequestsByCity(city: string): Observable<CollectionRequest[]> {
    const requests = this.getRequests().filter(r =>
      r.city === city && r.status === RequestStatus.PENDING
    );
    return of(requests);
  }

  validateCollection(requestId: string, validatedWeight: number, photos?: string[]): Observable<CollectionRequest> {
    const user = this.authService.currentUser$.value;
    if (!user?.isCollector) {
      return throwError(() => new Error('Only collectors can validate collections'));
    }

    const request = this.getRequests().find(r => r.id === requestId);
    if (!request) {
      return throwError(() => new Error('Request not found'));
    }

    const points = this.calculatePoints(request.wasteItems, validatedWeight);

    // Update user points
    const users = JSON.parse(localStorage.getItem(environment.localStorage.usersKey) || '[]');
    const userIndex = users.findIndex((u: any) => u.id === request.userId);
    if (userIndex !== -1) {
      users[userIndex].points = (users[userIndex].points || 0) + points;
      localStorage.setItem(environment.localStorage.usersKey, JSON.stringify(users));
    }

    return this.updateRequest(requestId, {
      status: RequestStatus.VALIDATED,
      validatedWeight,
      validationPhotos: photos,
      collectorId: user.id
    });
  }

  private calculatePoints(wasteItems: WasteItem[], validatedWeight: number): number {
    const totalWeight = wasteItems.reduce((sum, item) => sum + item.weight, 0);
    const weightRatio = validatedWeight / totalWeight;

    return wasteItems.reduce((points, item) => {
      const adjustedWeight = item.weight * weightRatio;
      return points + (adjustedWeight * environment.pointsConfig[item.type.toLowerCase()]);
    }, 0);
  }

  private getRequests(): CollectionRequest[] {
    return JSON.parse(localStorage.getItem(environment.localStorage.collectionsKey) || '[]');
  }

  private getUserPendingRequests(userId: string): CollectionRequest[] {
    return this.getRequests().filter(r =>
      r.userId === userId &&
      [RequestStatus.PENDING, RequestStatus.OCCUPIED, RequestStatus.IN_PROGRESS].includes(r.status)
    );
  }
}
