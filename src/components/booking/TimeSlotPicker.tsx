
import React from "react";
import { TimeSlot } from "@/types/booking";
import { formatTime } from "@/data/salonData";
import { cn } from "@/lib/utils";
import { Check, X, Clock } from "lucide-react";

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
  // Check if a slot can be selected based on consecutive slot requirements
  const canSelectSlot = (slotId: string): boolean => {
    // If no slots are selected yet, any available slot can be selected
    if (selectedSlots.length === 0) return true;
    
    // If we already have enough slots, don't allow more
    if (selectedSlots.length >= requiredSlots) return false;
    
    const slotIndex = slots.findIndex(slot => slot.id === slotId);
    
    // Check if this slot is adjacent to any existing selected slot
    for (const selectedSlotId of selectedSlots) {
      const selectedIndex = slots.findIndex(slot => slot.id === selectedSlotId);
      
      // If it's immediately after the last selected slot
      if (slotIndex === selectedIndex + 1) return true;
      
      // If it's immediately before the first selected slot
      if (slotIndex === selectedIndex - 1) return true;
    }
    
    return false;
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
                  (isSelected || canSelectSlot(slot.id) || selectedSlots.length < requiredSlots);
                
                const slotClass = cn(
                  "py-2 px-1 rounded-md text-xs sm:text-sm transition-all relative flex items-center justify-center",
                  isSelected && "bg-primary text-white",
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
                      "Available"
                    }
                  >
                    {formatTime(slot.time)}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    {!slot.isAvailable && (
                      <span className="absolute inset-0 flex items-center justify-center bg-[#aaadb0]/20 rounded-md">
                        <X className="h-3 w-3 text-[#999]" />
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
    </div>
  );
};

export default TimeSlotPicker;
