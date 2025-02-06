// src/app/shared/models/user.model.ts

export interface User {
  id?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  birthDate: Date;
  profilePhoto?: string;
  isCollector: boolean;
  city?: string;
  points?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends Omit<User, 'id' | 'isCollector' | 'points' | 'createdAt' | 'updatedAt'> {
  password: string;
}

export enum UserRole {
  COLLECTOR = 'COLLECTOR',
  PARTICULAR = 'PARTICULAR'
}
