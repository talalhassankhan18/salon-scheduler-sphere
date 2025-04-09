
import React from "react";
import { TimeSlot } from "@/types/booking";
import { formatTime } from "@/data/salonData";
import { cn } from "@/lib/utils";

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

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-3">Select {requiredSlots} Time Slot{requiredSlots > 1 ? 's' : ''}</h3>
      <p className="text-sm text-muted-foreground mb-3">
        {selectedSlots.length} of {requiredSlots} slots selected
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {slots.map((slot) => {
          const isSelected = selectedSlots.includes(slot.id);
          const isSelectable = slot.isAvailable && (isSelected || canSelectSlot(slot.id) || selectedSlots.length < requiredSlots);
          
          return (
            <button
              key={slot.id}
              onClick={() => isSelectable && onSelectSlot(slot.id)}
              disabled={!isSelectable}
              className={cn(
                "py-2 px-3 rounded-md text-sm transition-all",
                isSelected
                  ? "bg-primary text-white"
                  : isSelectable
                    ? "bg-muted hover:bg-accent hover:text-accent-foreground"
                    : "bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed"
              )}
            >
              {formatTime(slot.time)}
            </button>
          );
        })}
      </div>
      {!slots.some(slot => slot.isAvailable) && (
        <p className="text-error mt-2 text-sm">No available slots for this day.</p>
      )}
    </div>
  );
};

export default TimeSlotPicker;
