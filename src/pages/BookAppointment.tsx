
import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CalendarIcon, Clock } from "lucide-react";

// Import components
import ServiceCard from "@/components/booking/ServiceCard";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import ServiceReviews from "@/components/booking/ServiceReviews";
import CustomerForm from "@/components/booking/CustomerForm";

// Import data and types
import { Service, TimeSlot, Review } from "@/types/booking";
import { services, reviews, generateTimeSlots } from "@/data/salonData";

const BookAppointment: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("services");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [serviceReviews, setServiceReviews] = useState<Review[]>([]);
  
  // Handle date change - regenerate time slots
  useEffect(() => {
    if (selectedDate) {
      setSelectedTimeSlot(null);
      setTimeSlots(generateTimeSlots(selectedDate));
    }
  }, [selectedDate]);
  
  // Filter reviews when service is selected
  useEffect(() => {
    if (selectedService) {
      const filteredReviews = reviews.filter(
        (review) => review.serviceId === selectedService.id
      );
      setServiceReviews(filteredReviews);
    } else {
      setServiceReviews([]);
    }
  }, [selectedService]);
  
  // Handle service selection
  const handleServiceSelect = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    setSelectedService(service || null);
  };
  
  // Handle time slot selection
  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
  };
  
  // Handle form submission
  const handleSubmit = (formData: any) => {
    if (!selectedService || !selectedDate || !selectedTimeSlot) {
      toast({
        title: "Booking Error",
        description: "Please complete all booking details",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send data to the backend
    console.log("Booking submitted:", {
      service: selectedService,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      customerInfo: formData
    });
    
    toast({
      title: "Booking Confirmed!",
      description: `Your ${selectedService.name} appointment has been scheduled.`,
      variant: "success"
    });
    
    // Reset form
    setSelectedService(null);
    setSelectedDate(new Date());
    setSelectedTimeSlot(null);
    setSelectedTab("services");
  };
  
  // Navigation between steps
  const goToNextStep = () => {
    if (selectedTab === "services" && selectedService) {
      setSelectedTab("datetime");
    } else if (selectedTab === "datetime" && selectedDate && selectedTimeSlot) {
      setSelectedTab("details");
    }
  };
  
  const goToPreviousStep = () => {
    if (selectedTab === "details") {
      setSelectedTab("datetime");
    } else if (selectedTab === "datetime") {
      setSelectedTab("services");
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Card className="border border-muted">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white">
          <CardTitle className="text-2xl md:text-3xl">Book Your Appointment</CardTitle>
          <CardDescription className="text-white/80">
            Schedule your next salon experience with us
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="services">
                1. Select Service
              </TabsTrigger>
              <TabsTrigger value="datetime" disabled={!selectedService}>
                2. Date & Time
              </TabsTrigger>
              <TabsTrigger value="details" disabled={!selectedService || !selectedDate || !selectedTimeSlot}>
                3. Your Details
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="services" className="mt-4 space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isSelected={selectedService?.id === service.id}
                    onClick={handleServiceSelect}
                  />
                ))}
              </div>
              
              {selectedService && (
                <div className="mt-6">
                  <Button 
                    onClick={goToNextStep} 
                    className="bg-primary hover:bg-primary/90"
                  >
                    Continue to Select Date & Time
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              )}
              
              {selectedService && (
                <ServiceReviews 
                  reviews={serviceReviews}
                  serviceName={selectedService.name}
                />
              )}
            </TabsContent>
            
            <TabsContent value="datetime" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <CalendarIcon size={18} className="mr-2" />
                    Select Date
                  </h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      // Disable dates in the past and more than 30 days in the future
                      return (
                        date < today ||
                        date > addDays(today, 30) ||
                        date.getDay() === 0 // Sundays closed
                      );
                    }}
                    className="bg-card rounded-md border p-3 pointer-events-auto"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Clock size={18} className="mr-2" />
                    Available Times
                  </h3>
                  {selectedDate ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-3">
                        Selected date: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </p>
                      <TimeSlotPicker
                        slots={timeSlots}
                        selectedSlot={selectedTimeSlot}
                        onSelectSlot={handleTimeSlotSelect}
                      />
                    </>
                  ) : (
                    <p className="text-muted-foreground">Please select a date first</p>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={goToPreviousStep}
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Services
                </Button>
                
                <Button 
                  onClick={goToNextStep} 
                  disabled={!selectedDate || !selectedTimeSlot}
                  className="bg-primary hover:bg-primary/90"
                >
                  Continue to Your Details
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="animate-fade-in">
              {selectedService && selectedDate && selectedTimeSlot && (
                <>
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-lg">Appointment Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Service</p>
                        <p className="font-medium">{selectedService.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">
                          {timeSlots.find(s => s.id === selectedTimeSlot)?.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="mt-6">
                    <h3 className="font-medium text-lg mb-4">Enter Your Details</h3>
                    <CustomerForm
                      selectedService={selectedService}
                      selectedDate={selectedDate}
                      selectedTimeSlot={selectedTimeSlot}
                      onSubmit={handleSubmit}
                    />
                  </div>
                  
                  <div className="mt-8">
                    <Button 
                      variant="outline" 
                      onClick={goToPreviousStep}
                    >
                      <ArrowLeft size={16} className="mr-2" />
                      Back to Date & Time
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookAppointment;
