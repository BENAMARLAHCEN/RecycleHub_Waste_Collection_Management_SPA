export enum RequestStatus {
  PENDING = 'En attente',
  OCCUPIED = 'Occupée',
  IN_PROGRESS = 'En cours',
  VALIDATED = 'Validée',
  REJECTED = 'Rejetée'
}

export enum WasteType {
  PLASTIC = 'Plastique',
  GLASS = 'Verre',
  PAPER = 'Papier',
  METAL = 'Métal'
}

export interface WasteItem {
  type: WasteType;
  weight: number;
}

export interface CollectionRequest {
  id?: string;
  userId: string;
  wasteItems: WasteItem[];
  totalWeight: number;
  address: string;
  city: string;
  collectionDate: Date;
  timeSlot: string;
  status: RequestStatus;
  notes?: string;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
  collectorId?: string;
  validatedWeight?: number;
  validationPhotos?: string[];
  rejectionReason?: string;
}
