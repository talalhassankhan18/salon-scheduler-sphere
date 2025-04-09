
import React from "react";
import { TimeSlot } from "@/types/booking";
import { formatTime } from "@/data/salonData";
import { cn } from "@/lib/utils";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: string | null;
  onSelectSlot: (slotId: string) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ 
  slots, 
  selectedSlot, 
  onSelectSlot 
}) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-3">Select a Time</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => slot.isAvailable && onSelectSlot(slot.id)}
            disabled={!slot.isAvailable}
            className={cn(
              "py-2 px-3 rounded-md text-sm transition-all",
              slot.isAvailable 
                ? selectedSlot === slot.id
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-accent hover:text-accent-foreground" 
                : "bg-gray-100 text-gray-400 line-through opacity-60 cursor-not-allowed"
            )}
          >
            {formatTime(slot.time)}
          </button>
        ))}
      </div>
      {!slots.some(slot => slot.isAvailable) && (
        <p className="text-error mt-2 text-sm">No available slots for this day.</p>
      )}
    </div>
  );
};

export default TimeSlotPicker;
