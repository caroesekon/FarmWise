export const APP_NAME = 'FarmWise';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROLES = {
  FARM_ADMIN: 'farmAdmin',
  MANAGER: 'manager',
  WORKER: 'worker',
  VET: 'vet',
};

export const ANIMAL_CATEGORIES = [
  { value: 'dairyCattle', label: 'Dairy Cattle' },
  { value: 'beefCattle', label: 'Beef Cattle' },
  { value: 'poultry', label: 'Poultry' },
  { value: 'goats', label: 'Goats' },
  { value: 'sheep', label: 'Sheep' },
  { value: 'pigs', label: 'Pigs' },
  { value: 'other', label: 'Other' },
];

export const HEALTH_TYPES = [
  { value: 'diagnosis', label: 'Diagnosis' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'vet_visit', label: 'Vet Visit' },
  { value: 'deworming', label: 'Deworming' },
  { value: 'hoof_trimming', label: 'Hoof Trimming' },
  { value: 'injury', label: 'Injury' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'other', label: 'Other' },
];

export const ALERT_LEVELS = {
  info: { label: 'Info', color: 'blue' },
  medium: { label: 'Medium', color: 'yellow' },
  high: { label: 'High', color: 'orange' },
  critical: { label: 'Critical', color: 'red' },
};

export const TASK_CATEGORIES = [
  { value: 'feeding', label: 'Feeding' },
  { value: 'milking', label: 'Milking' },
  { value: 'health', label: 'Health' },
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'planting', label: 'Planting' },
  { value: 'harvesting', label: 'Harvesting' },
  { value: 'other', label: 'Other' },
];

export const INVENTORY_CATEGORIES = [
  { value: 'feed', label: 'Feed' },
  { value: 'medicine', label: 'Medicine' },
  { value: 'vaccine', label: 'Vaccine' },
  { value: 'supplement', label: 'Supplement' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'other', label: 'Other' },
];