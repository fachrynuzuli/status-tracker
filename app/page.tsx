"use client"

import { useState, useEffect } from "react"
import { CountdownCard, type CustomEvent } from "@/components/countdown-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const PRESET_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
]

const DEFAULT_EVENTS: CustomEvent[] = [
  { id: "1", name: "Ramadan", date: "2026-02-20", color: "#10b981" },
  { id: "2", name: "Idul Fitri", date: "2026-03-21", color: "#f59e0b" },
]

export default function Page() {
  const [events, setEvents] = useState<CustomEvent[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // New event state
  const [newName, setNewName] = useState("")
  const [newDate, setNewDate] = useState<Date>()
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])

  useEffect(() => {
    const saved = localStorage.getItem("countdown-events")
    if (saved) {
      try {
        setEvents(JSON.parse(saved))
      } catch (e) {
        console.error("[v0] Failed to parse saved events", e)
        setEvents(DEFAULT_EVENTS)
      }
    } else {
      setEvents(DEFAULT_EVENTS)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("countdown-events", JSON.stringify(events))
    }
  }, [events, isLoaded])

  const addEvent = () => {
    if (!newName || !newDate) return

    const event: CustomEvent = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      date: newDate.toISOString(),
      color: newColor,
    }

    setEvents([...events, event])
    setNewName("")
    setNewDate(undefined)
  }

  const removeEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id))
  }

  if (!isLoaded) return null

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter uppercase font-mono">Status</h1>
          <p className="text-muted-foreground font-mono text-sm">Real-time year progression tracking.</p>
        </div>

        <CountdownCard accentColor="#737373" events={events} />

        <div className="border-2 p-4 font-mono space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] uppercase text-muted-foreground block">Add Custom Event</span>
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label htmlFor="event-name" className="text-[10px] uppercase">
                  Name
                </Label>
                <Input
                  id="event-name"
                  placeholder="Ramadan, Launch, etc."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-8 text-xs rounded-none border-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-8 justify-start text-left font-mono text-xs rounded-none border-2 px-2",
                          !newDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {newDate ? format(newDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-none border-2" align="start">
                      <Calendar
                        mode="single"
                        selected={newDate}
                        onSelect={setNewDate}
                        initialFocus
                        className="font-mono"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] uppercase">Color</Label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewColor(color)}
                        className={cn(
                          "size-4 rounded-full border-2 border-background ring-offset-2 ring-offset-background transition-all",
                          newColor === color && "ring-2 ring-ring",
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={addEvent}
                disabled={!newName || !newDate}
                className="w-full h-8 rounded-none border-2 uppercase text-[10px] font-bold"
              >
                <Plus className="mr-2 h-3 w-3" /> Add Event
              </Button>
            </div>
          </div>

          {events.length > 0 && (
            <div className="space-y-2 pt-2 border-t-2 border-dashed">
              <span className="text-[10px] uppercase text-muted-foreground block">Active Events</span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full" style={{ backgroundColor: event.color }} />
                      <span className="text-xs font-bold uppercase">{event.name}</span>
                      <span className="text-[10px] text-muted-foreground">{format(new Date(event.date), "MMM d")}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeEvent(event.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border-2 font-mono text-[10px] uppercase">
            <span className="block text-muted-foreground mb-1">System</span>
            <span className="font-bold">Operational</span>
          </div>
          <div className="p-4 border-2 font-mono text-[10px] uppercase text-right">
            <span className="block text-muted-foreground mb-1">Timezone</span>
            <span className="font-bold">Asia/Jakarta</span>
          </div>
        </div>
      </div>
    </main>
  )
}
