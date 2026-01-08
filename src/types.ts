export type EventStatus = 'OK' | 'NOT_OK' | 'OUTDOOR' | 'OK_OUTDOOR';

export interface StatusLabel {
  value: EventStatus;
  label: string;
}

export interface Event {
  id: string;
  clientName?: string;
  date?: string;
  status?: EventStatus;
  contactNumber?: string;
  instagramId?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  artists?: string[];
  marketingCosts?: number;
  price?: number;
  otherCosts?: {
    materials?: number;
    travel?: number;
    misc?: number;
  };
  advancePayment?: number;
  pendingPayment?: number;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

export interface EventFormData {
  date?: string;
  clientName?: string;
  status?: EventStatus;
  contactNumber?: string;
  instagramId?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  artists?: string[];
  marketingCosts?: number;
  price?: number;
  otherCosts?: {
    materials?: number;
    travel?: number;
    misc?: number;
  };
  advancePayment?: number;
  pendingPayment?: number;
}

export type UserRole = 'admin' | 'manager';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
}

export interface Artist {
  id: string;
  name: string;
}