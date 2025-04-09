
import React, { useEffect } from "react";
import { TimeSlot } from "@/types/booking";
import { formatTime } from "@/data/salonData";
import { cn } from "@/lib/utils";
import { Check, X, Clock, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlots: string[];
  onSelectSlot: (slotId: string) => void;
  requiredSlots: number;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ 
  slots, 
  selectedSlots, 
  onSelectSlot,
  requiredSlots
}) => {
  // Automatically select consecutive slots when the first slot is selected
  useEffect(() => {
    // Only run this if we have exactly one selected slot and need more
    if (selectedSlots.length === 1 && requiredSlots > 1) {
      const firstSlotId = selectedSlots[0];
      const firstSlotIndex = slots.findIndex(slot => slot.id === firstSlotId);
      
      // Try to select consecutive slots after the first one
      let canCompleteBooking = true;
      const slotsToSelect = [];
      
      // Check if we can select the required number of consecutive slots
      for (let i = 1; i < requiredSlots; i++) {
        const nextSlotIndex = firstSlotIndex + i;
        
        // Make sure the next slot exists and is available
        if (nextSlotIndex < slots.length && 
            slots[nextSlotIndex].isAvailable && 
            !slots[nextSlotIndex].capacityReached) {
          slotsToSelect.push(slots[nextSlotIndex].id);
        } else {
          canCompleteBooking = false;
          break;
        }
      }
      
      // If we can complete the booking, select all the slots
      if (canCompleteBooking) {
        slotsToSelect.forEach(slotId => {
          onSelectSlot(slotId);
        });
      } else {
        // Notify that we can't complete the booking with consecutive slots
        toast({
          title: "Cannot Complete Booking",
          description: `Not enough consecutive time slots available for this service.`,
          variant: "destructive"
        });
        
        // Deselect the first slot since we can't complete the booking
        onSelectSlot(firstSlotId);
      }
    }
  }, [selectedSlots, requiredSlots, slots, onSelectSlot]);
  
  // Check if a slot can be selected based on consecutive slot requirements
  const canSelectSlot = (slotId: string): boolean => {
    // If no slots are selected yet, any available slot can be selected
    if (selectedSlots.length === 0) return true;
    
    // If we already have enough slots, don't allow more
    if (selectedSlots.length >= requiredSlots) return false;
    
    // We're only allowing selection of the first slot now
    // The rest are automatically selected by the useEffect
    if (selectedSlots.length > 0) return false;
    
    return true;
  };

  // Group slots by hour for cleaner UI
  const groupedSlots: { [hour: string]: TimeSlot[] } = {};
  slots.forEach(slot => {
    const [hour] = slot.time.split(':');
    if (!groupedSlots[hour]) {
      groupedSlots[hour] = [];
    }
    groupedSlots[hour].push(slot);
  });

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-3">Select {requiredSlots} Time Slot{requiredSlots > 1 ? 's' : ''}</h3>
      <p className="text-sm text-muted-foreground mb-3">
        {selectedSlots.length} of {requiredSlots} slots selected
        {requiredSlots > 1 && selectedSlots.length === 0 && (
          <span className="ml-2 text-amber-500 flex items-center text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Select the first slot, remaining slots will be selected automatically
          </span>
        )}
      </p>
      
      <div className="space-y-4">
        {Object.entries(groupedSlots).map(([hour, hourSlots]) => (
          <div key={hour} className="border rounded-lg p-3 bg-white">
            <h4 className="font-medium mb-2 flex items-center text-neutral">
              <Clock className="h-4 w-4 mr-2" /> 
              {parseInt(hour) > 12 ? parseInt(hour) - 12 : hour}:00 {parseInt(hour) >= 12 ? 'PM' : 'AM'}
            </h4>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
              {hourSlots.map((slot) => {
                const isSelected = selectedSlots.includes(slot.id);
                const isSelectable = slot.isAvailable && 
                  (!slot.capacityReached) && 
                  (isSelected || canSelectSlot(slot.id));
                
                // Determine if this slot is part of a consecutive series
                const isConsecutive = selectedSlots.length > 1 &&
                  selectedSlots.includes(slot.id) && 
                  slot.id !== selectedSlots[0];
                
                const slotClass = cn(
                  "py-2 px-1 rounded-md text-xs sm:text-sm transition-all relative flex items-center justify-center",
                  isSelected && "bg-primary text-white",
                  isConsecutive && "bg-primary/80 text-white",
                  !isSelected && isSelectable && "bg-[#F1F0FB] hover:bg-accent hover:text-accent-foreground border border-primary/20",
                  !isSelectable && slot.isAvailable && "bg-[#F1F1F1] text-[#999] cursor-not-allowed border border-[#eee]",
                  !slot.isAvailable && "bg-[#F1F1F1] text-[#999] line-through cursor-not-allowed opacity-50"
                );
                
                return (
                  <button
                    key={slot.id}
                    onClick={() => isSelectable && onSelectSlot(slot.id)}
                    disabled={!isSelectable}
                    className={slotClass}
                    title={
                      !slot.isAvailable ? "Booked" : 
                      slot.capacityReached ? "No capacity left" : 
                      isConsecutive ? "Auto-selected based on service duration" :
                      "Available"
                    }
                  >
                    {formatTime(slot.time)}
                    {isSelected && !isConsecutive && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    {!slot.isAvailable && (
                      <span className="absolute inset-0 flex items-center justify-center bg-[#aaadb0]/20 rounded-md">
                        <X className="h-3 w-3 text-[#999]" />
                      </span>
                    )}
                    {slot.capacityReached && slot.isAvailable && (
                      <span className="absolute inset-0 flex items-center justify-center bg-[#aaadb0]/20 rounded-md">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {!slots.some(slot => slot.isAvailable) && (
        <p className="text-error mt-2 text-sm">No available slots for this day.</p>
      )}
      
      {selectedSlots.length === requiredSlots && (
        <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700 flex items-center">
            <Check className="h-4 w-4 mr-1 text-green-500" />
            {requiredSlots} consecutive slots selected
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
