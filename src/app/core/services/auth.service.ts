
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeCollectors();
  }

  login(email: string, password: string): Observable<User> {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const userWithoutPassword = { ...user, password: undefined };
      localStorage.setItem(environment.localStorage.userKey, JSON.stringify(userWithoutPassword));
      this.currentUserSubject.next(userWithoutPassword);
      return of(userWithoutPassword);
    }
    return throwError(() => new Error('Invalid credentials'));
  }

  register(user: User): Observable<User> {
    const users = this.getUsers();
    console.log(user);
    if (users.some(u => u.email === user.email)) {
      return throwError(() => new Error('Email already exists'));
    }

    const newUser = {
      ...user,
      id: Date.now().toString(),
      points: 1000,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);
    localStorage.setItem(environment.localStorage.usersKey, JSON.stringify(users));

    const userWithoutPassword = { ...newUser, password: undefined };
    localStorage.setItem(environment.localStorage.userKey, JSON.stringify(userWithoutPassword));
    this.currentUserSubject.next(userWithoutPassword);

    return of(userWithoutPassword);
  }

  updateProfile(updates: Partial<User>): Observable<User> {
    const users = this.getUsers();
    const currentUser = this.currentUserSubject.value;

    if (!currentUser?.id) {
      return throwError(() => new Error('User not found'));
    }

    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }

    const updatedUser = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date()
    };

    users[userIndex] = updatedUser;
    localStorage.setItem(environment.localStorage.usersKey, JSON.stringify(users));

    const userWithoutPassword = { ...updatedUser, password: undefined };
    localStorage.setItem(environment.localStorage.userKey, JSON.stringify(userWithoutPassword));
    this.currentUserSubject.next(userWithoutPassword);

    return of(userWithoutPassword);
  }

  deleteAccount(userId: string): Observable<void> {
    const users = this.getUsers();
    const filteredUsers = users.filter(u => u.id !== userId);

    if (users.length === filteredUsers.length) {
      return throwError(() => new Error('User not found'));
    }

    localStorage.setItem(environment.localStorage.usersKey, JSON.stringify(filteredUsers));
    localStorage.removeItem(environment.localStorage.userKey);
    this.currentUserSubject.next(null);

    return of(void 0);
  }

  logout(): void {
    localStorage.removeItem(environment.localStorage.userKey);
    this.currentUserSubject.next(null);
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem(environment.localStorage.userKey);
    return user ? JSON.parse(user) : null;
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(environment.localStorage.usersKey);
    return users ? JSON.parse(users) : [];
  }

  private initializeCollectors(): void {
    const users = this.getUsers();
    if (!users.some(u => u.isCollector)) {
      const collectors: User[] = [
        {
          id: 'collector1',
          email: 'collector1@recyclehub.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Collector',
          address: '123 Recycling St',
          city: 'Casablanca',
          phone: '0600000001',
          birthDate: new Date('1990-01-01'),
          isCollector: true,
          points: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      localStorage.setItem(environment.localStorage.usersKey, JSON.stringify([...users, ...collectors]));
    }
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
