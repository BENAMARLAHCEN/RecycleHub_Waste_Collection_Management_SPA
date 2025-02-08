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
