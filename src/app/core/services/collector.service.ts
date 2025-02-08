// src/app/core/services/collector.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionRequest, RequestStatus } from '../../shared/models/collection-request.model';
import { User } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface CollectorStats {
  totalCollections: number;
  completedCollections: number;
  pendingCollections: number;
  totalWeight: number;
}

@Injectable({
  providedIn: 'root'
})
export class CollectorService {
  private readonly COLLECTOR_REQUESTS_KEY = 'recyclehub_collector_requests';

  constructor(private authService: AuthService) {}

  getAvailableRequestsByCity(city: string): Observable<CollectionRequest[]> {
    const allRequests = this.getAllRequests();
    const availableRequests = allRequests.filter(request =>
      request.city === city &&
      request.status === RequestStatus.PENDING
    );
    return of(availableRequests);
  }

  getActiveCollections(collectorId: string): Observable<CollectionRequest[]> {
    const allRequests = this.getAllRequests();
    const activeCollections = allRequests.filter(request =>
      request.collectorId === collectorId &&
      [RequestStatus.OCCUPIED, RequestStatus.IN_PROGRESS].includes(request.status)
    );
    return of(activeCollections);
  }

  acceptRequest(requestId: string, collectorId: string): Observable<CollectionRequest> {
    const requests = this.getAllRequests();
    const requestIndex = requests.findIndex(r => r.id === requestId);

    if (requestIndex === -1) {
      return throwError(() => new Error('Request not found'));
    }

    const request = requests[requestIndex];

    // Check if request is still available
    if (request.status !== RequestStatus.PENDING) {
      return throwError(() => new Error('Request is no longer available'));
    }

    // Check collector's active collections limit
    const activeCollections = requests.filter(r =>
      r.collectorId === collectorId &&
      [RequestStatus.OCCUPIED, RequestStatus.IN_PROGRESS].includes(r.status)
    );

    if (activeCollections.length >= 3) {
      return throwError(() => new Error('Maximum active collections limit reached'));
    }

    // Update request
    const updatedRequest = {
      ...request,
      status: RequestStatus.OCCUPIED,
      collectorId,
      updatedAt: new Date()
    };

    requests[requestIndex] = updatedRequest;
    this.saveRequests(requests);

    return of(updatedRequest);
  }

  completeCollection(
    requestId: string,
    validatedWeight: number,
    photos: string[]
  ): Observable<CollectionRequest> {
    const requests = this.getAllRequests();
    const requestIndex = requests.findIndex(r => r.id === requestId);

    if (requestIndex === -1) {
      return throwError(() => new Error('Request not found'));
    }

    const request = requests[requestIndex];

    // Calculate points based on waste types and validated weight
    const totalRequestWeight = request.wasteItems.reduce((sum, item) => sum + item.weight, 0);
    const weightRatio = validatedWeight / totalRequestWeight;

    const pointsEarned = request.wasteItems.reduce((total, item) => {
      const itemValidatedWeight = item.weight * weightRatio;
      const pointsConfig = environment.pointsConfig as Record<string, number>;
      return total + (itemValidatedWeight * pointsConfig[item.type.toLowerCase()]);
    }, 0);

    // Update user points
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === request.userId);

    if (userIndex !== -1) {
      users[userIndex].points = (users[userIndex].points || 0) + pointsEarned;
      localStorage.setItem(environment.localStorage.usersKey, JSON.stringify(users));
    }

    // Update request
    const updatedRequest = {
      ...request,
      status: RequestStatus.VALIDATED,
      validatedWeight,
      validationPhotos: photos,
      updatedAt: new Date()
    };

    requests[requestIndex] = updatedRequest;
    this.saveRequests(requests);

    return of(updatedRequest);
  }

  getCollectorStats(collectorId: string): Observable<CollectorStats> {
    const requests = this.getAllRequests();
    const collectorRequests = requests.filter(r => r.collectorId === collectorId);

    const stats: CollectorStats = {
      totalCollections: collectorRequests.length,
      completedCollections: collectorRequests.filter(r => r.status === RequestStatus.VALIDATED).length,
      pendingCollections: collectorRequests.filter(r =>
        [RequestStatus.OCCUPIED, RequestStatus.IN_PROGRESS].includes(r.status)
      ).length,
      totalWeight: collectorRequests
        .filter(r => r.status === RequestStatus.VALIDATED)
        .reduce((sum, r) => sum + (r.validatedWeight || 0), 0)
    };

    return of(stats);
  }

  private getAllRequests(): CollectionRequest[] {
    const requestsJson = localStorage.getItem(environment.localStorage.collectionsKey);
    return requestsJson ? JSON.parse(requestsJson) : [];
  }

  private saveRequests(requests: CollectionRequest[]): void {
    localStorage.setItem(environment.localStorage.collectionsKey, JSON.stringify(requests));
  }

  private getUsers(): User[] {
    const usersJson = localStorage.getItem(environment.localStorage.usersKey);
    return usersJson ? JSON.parse(usersJson) : [];
  }
}
