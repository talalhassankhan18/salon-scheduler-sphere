
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  image?: string;
}

export interface TimeSlot {
  id: string;
  time: string; // format: "HH:MM"
  isAvailable: boolean;
}

export interface Review {
  id: string;
  serviceId: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // ISO date string
  timeSlot: string; // format: "HH:MM"
  notes?: string;
}
