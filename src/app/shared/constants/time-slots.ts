// src/app/shared/constants/time-slots.ts
import {WasteType} from "../models/collection-request.model";

export const TIME_SLOTS = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00'
];

export const WEIGHT_LIMITS = {
  MIN_WEIGHT: 1000, // 1kg in grams
  MAX_WEIGHT: 10000 // 10kg in grams
};

export const POINTS_PER_KG = {
  [WasteType.PLASTIC]: 2,
  [WasteType.GLASS]: 1,
  [WasteType.PAPER]: 1,
  [WasteType.METAL]: 5
};
