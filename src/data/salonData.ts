
import { Service, Review, TimeSlot } from "@/types/booking";

export const services: Service[] = [
  {
    id: "haircut",
    name: "Premium Haircut",
    description: "Expert styling tailored to your face shape and personal style.",
    duration: 60,
    price: 85,
    image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "color",
    name: "Color Treatment",
    description: "Vibrant, long-lasting color using premium products for healthy hair.",
    duration: 120,
    price: 120,
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=2071&auto=format&fit=crop"
  },
  {
    id: "blowout",
    name: "Blowout & Style",
    description: "Professional blow dry and styling for any occasion.",
    duration: 45,
    price: 65,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1976&auto=format&fit=crop"
  },
  {
    id: "facial",
    name: "Signature Facial",
    description: "Customized facial treatment to rejuvenate and nourish your skin.",
    duration: 90,
    price: 110,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop"
  }
];

export const reviews: Review[] = [
  {
    id: "rev1",
    serviceId: "haircut",
    customerName: "Emma Wilson",
    rating: 5,
    comment: "Absolutely loved my haircut! The stylist listened to exactly what I wanted and delivered perfection.",
    date: "2023-11-15"
  },
  {
    id: "rev2",
    serviceId: "haircut",
    customerName: "Michael Chen",
    rating: 4,
    comment: "Great service and attention to detail. Will definitely return!",
    date: "2023-10-22"
  },
  {
    id: "rev3",
    serviceId: "color",
    customerName: "Sophia Martinez",
    rating: 5,
    comment: "The color came out exactly as I hoped. My stylist was incredibly knowledgeable and helped me choose the perfect shade.",
    date: "2023-11-05"
  },
  {
    id: "rev4",
    serviceId: "blowout",
    customerName: "James Johnson",
    rating: 5,
    comment: "Quick service without sacrificing quality. My hair looked amazing for my event!",
    date: "2023-10-30"
  },
  {
    id: "rev5",
    serviceId: "facial",
    customerName: "Olivia Thompson",
    rating: 4,
    comment: "Such a relaxing experience! My skin felt amazing afterward.",
    date: "2023-11-10"
  }
];

// Generate time slots for a given day
export const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const openingHour = 9; // 9 AM
  const closingHour = 17; // 5 PM
  
  // Mock bookings - some slots will be marked as unavailable
  const bookedSlots = ["9:00", "11:30", "13:45", "15:00", "16:30"];
  
  for (let hour = openingHour; hour < closingHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour}:${minute === 0 ? '00' : minute}`;
      const isAvailable = !bookedSlots.includes(timeString);
      
      slots.push({
        id: `${date.toISOString().split('T')[0]}-${timeString}`,
        time: timeString,
        isAvailable
      });
    }
  }
  
  return slots;
};

// Helper function to format time from 24h to 12h format
export const formatTime = (time: string): string => {
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr);
  const minute = minuteStr;
  
  return `${hour % 12 || 12}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`;
};
