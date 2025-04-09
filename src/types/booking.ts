
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  image?: string;
  gender?: "men" | "women" | "unisex"; // To identify gender-specific services
  salonId: string; // To associate service with a salon
}

export interface Salon {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  image?: string;
  type: "men" | "women" | "unisex"; // Salon type
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
  salonId: string; // Added salonId
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // ISO date string
  timeSlots: string[]; // Changed from single timeSlot to multiple timeSlots
  notes?: string;
}
