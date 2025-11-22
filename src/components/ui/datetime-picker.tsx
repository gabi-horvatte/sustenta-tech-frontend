import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateTimePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  min?: Date
}

// Custom Time Picker Component
function CustomTimePicker({
  value,
  onChange,
  selectedDate,
  onDateChange,
  className
}: {
  value: string
  onChange: (value: string) => void
  selectedDate?: Date
  onDateChange?: (date: Date | undefined) => void
  className?: string
}) {
  const [selectedHour, setSelectedHour] = React.useState("00")
  const [selectedMinute, setSelectedMinute] = React.useState("00")
  const [isTimePickerOpen, setIsTimePickerOpen] = React.useState(false)

  React.useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(":")
      setSelectedHour(hour || "00")
      setSelectedMinute(minute || "00")
    }
  }, [value])

  const handleTimeSelect = (hour: string, minute: string) => {
    const timeString = `${hour}:${minute}`
    setSelectedHour(hour)
    setSelectedMinute(minute)
    onChange(timeString)

    // Update the combined date if we have a selected date
    if (selectedDate) {
      const combinedDate = new Date(selectedDate)
      combinedDate.setHours(parseInt(hour), parseInt(minute))
      onDateChange?.(combinedDate)
    }

    setIsTimePickerOpen(false)
  }

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        value={`${selectedHour}:${selectedMinute}`}
        onClick={() => setIsTimePickerOpen(true)}
        className="cursor-pointer"
        readOnly
      />
      {isTimePickerOpen && (
        <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 w-48 p-3">
          <div className="flex gap-2">
            {/* Hours */}
            <div className="flex-1">
              <Label className="text-xs font-medium text-muted-foreground mb-1 block">Hora</Label>
              <div className="h-32 overflow-y-auto border rounded">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={cn(
                      "px-2 py-1 cursor-pointer hover:bg-accent text-center text-sm",
                      selectedHour === hour && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => {
                      setSelectedHour(hour)
                      handleTimeSelect(hour, selectedMinute)
                    }}
                  >
                    {hour}
                  </div>
                ))}
              </div>
            </div>
            {/* Minutes */}
            <div className="flex-1">
              <Label className="text-xs font-medium text-muted-foreground mb-1 block">Minuto</Label>
              <div className="h-32 overflow-y-auto border rounded">
                {minutes.map((minute) => (
                  <div
                    key={minute}
                    className={cn(
                      "px-2 py-1 cursor-pointer hover:bg-accent text-center text-sm",
                      selectedMinute === minute && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => {
                      setSelectedMinute(minute)
                      handleTimeSelect(selectedHour, minute)
                    }}
                  >
                    {minute}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsTimePickerOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function DateTimePicker({
  date,
  onDateChange,
  placeholder = "Selecione data e hora",
  className,
  min,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [time, setTime] = React.useState<string>("")
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (date) {
      setSelectedDate(date)
      setTime(format(date, "HH:mm"))
    }
  }, [date])


  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate)
    if (newDate && time) {
      const [hours, minutes] = time.split(":")
      const combinedDate = new Date(newDate)
      combinedDate.setHours(parseInt(hours), parseInt(minutes))
      onDateChange?.(combinedDate)
    } else if (newDate) {
      onDateChange?.(newDate)
    } else {
      onDateChange?.(undefined)
    }
  }


  const displayValue = selectedDate
    ? `${format(selectedDate, "PPP", { locale: ptBR })} ${time || "00:00"}`
    : placeholder

  const isMinDate = (date: Date) => {
    if (!min) return false
    return date < min
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 overflow-visible z-50 pointer-events-auto" align="start" side="bottom">
          <div className="p-3 pb-16">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isMinDate}
              locale={ptBR}
              initialFocus
            />
            <div className="mt-3 border-t pt-3">
              <Label className="text-sm font-medium">
                Hora
              </Label>
              <div className="mt-1">
                <CustomTimePicker
                  value={time}
                  onChange={setTime}
                  selectedDate={selectedDate}
                  onDateChange={onDateChange}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
