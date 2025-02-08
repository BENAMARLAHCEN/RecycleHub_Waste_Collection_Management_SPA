
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';

export interface VoucherTransaction {
  id: string;
  userId: string;
  points: number;
  amount: number;
  createdAt: Date;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  constructor(private authService: AuthService) {}

  convertToVoucher(points: number): Observable<VoucherTransaction> {
    return this.authService.currentUser$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return throwError(() => new Error('User not authenticated'));
        }

        const voucherConversion = environment.voucherConversion as Record<string, number>;
        const amount = voucherConversion[points];

        if (!amount) {
          return throwError(() => new Error('Invalid points amount'));
        }

        if ((user.points ?? 0) < points) {
          return throwError(() => new Error('Insufficient points'));
        }
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex === -1) {
          return throwError(() => new Error('User not found'));
        }

        users[userIndex].points = (users[userIndex].points ?? 0) - points;
        localStorage.setItem(environment.localStorage.usersKey, JSON.stringify(users));
        const transaction: VoucherTransaction = {
          id: Date.now().toString(),
          userId: user.id ?? '',
          points,
          amount,
          createdAt: new Date(),
          code: this.generateVoucherCode()
        };

        const transactions = this.getTransactions();
        transactions.push(transaction);
        localStorage.setItem('recyclehub_vouchers', JSON.stringify(transactions));

        return of(transaction);
      })
    );
  }

  getUserTransactions(userId: string): Observable<VoucherTransaction[]> {
    const transactions = this.getTransactions()
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return of(transactions);
  }

  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(environment.localStorage.usersKey) || '[]');
  }

  private getTransactions(): VoucherTransaction[] {
    return JSON.parse(localStorage.getItem('recyclehub_vouchers') || '[]');
  }

  private generateVoucherCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 12;
    let code = '';
    for (let i = 0; i < length; i++) {
      if (i > 0 && i % 4 === 0) code += '-';
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }
}
