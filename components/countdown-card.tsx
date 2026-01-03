import type * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { getDateInfo } from "@/lib/date-utils"

export interface CustomEvent {
  id: string
  name: string
  date: string // ISO date string
  color: string
}

interface CountdownCardProps {
  accentColor?: string
  className?: string
  events?: CustomEvent[]
}

export function CountdownCard({ accentColor = "var(--primary)", className, events = [] }: CountdownCardProps) {
  const now = new Date()
  const timezone = "Asia/Jakarta"
  const year = 2026

  // Get comprehensive date information using the utility
  const dateInfo = getDateInfo(now, timezone, year)
  const { dayOfYear, daysRemaining, totalDays, progress: progressPercent } = dateInfo

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: timezone,
  }).format(now)

  const startOfYear = new Date(year, 0, 1)
  const oneDay = 1000 * 60 * 60 * 24

  const eventMarkers = events.map((event) => {
    const eventDate = new Date(event.date)
    const eventDiff = eventDate.getTime() - startOfYear.getTime()
    const eventDayOfYear = Math.floor(eventDiff / oneDay) + 1
    const daysToEvent = eventDayOfYear - dayOfYear
    const position = (eventDayOfYear / totalDays) * 100

    return {
      ...event,
      dayOfYear: eventDayOfYear,
      daysRemaining: daysToEvent,
      position: Math.max(0, Math.min(100, position)),
      isPast: daysToEvent < 0,
      isToday: daysToEvent === 0,
    }
  })

  return (
    <TooltipProvider>
      <Card className={cn("w-full max-w-md font-mono border-2", className)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            2026 Countdown
          </CardTitle>
          <div className="text-2xl font-bold tabular-nums" aria-label={`Current date: ${formattedDate}`}>
            {formattedDate}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground">Day of Year</span>
              <div className="text-xl font-bold" aria-label={`Day of year: ${dayOfYear}`}>
                {dayOfYear.toString().padStart(3, "0")}
              </div>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] uppercase text-muted-foreground">Days Remaining</span>
              <div className="text-xl font-bold" aria-label={`Days remaining: ${daysRemaining}`}>
                {daysRemaining}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase text-muted-foreground">
              <span>Progress</span>
              <span>{progressPercent.toFixed(1)}%</span>
            </div>

            <div className="relative">
              <Progress
                value={progressPercent}
                className="h-2"
                style={{ "--progress-foreground": accentColor } as React.CSSProperties}
                aria-label="Year 2026 completion progress"
              />

              {eventMarkers.map((marker) => (
                <Tooltip key={marker.id}>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-3 rounded-full border-2 border-background transition-transform hover:scale-125 focus-visible:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        marker.isPast && "opacity-50",
                      )}
                      style={{
                        left: `${marker.position}%`,
                        backgroundColor: marker.color,
                      }}
                      aria-label={`${marker.name}: ${marker.daysRemaining} days ${marker.daysRemaining >= 0 ? "remaining" : "ago"}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="font-mono text-[10px]">
                    <div className="font-bold">{marker.name}</div>
                    <div className="text-muted-foreground">
                      {marker.isToday
                        ? "Today"
                        : marker.isPast
                          ? `${Math.abs(marker.daysRemaining)}d ago`
                          : `${marker.daysRemaining}d remaining`}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            <div className="flex justify-between text-[8px] text-muted-foreground pt-1" aria-hidden="true">
              <span>JAN 01</span>
              <span className="font-bold" style={{ color: accentColor }}>
                MIDWAY
              </span>
              <span>DEC 31</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
