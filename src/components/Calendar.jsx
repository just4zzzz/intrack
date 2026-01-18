import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { loadLogbook } from "@/lib/storage"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { formatDate } from "@/lib/dateUtils"

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [logbookData, setLogbookData] = useState([])

  useEffect(() => {
    const saved = loadLogbook()
    setLogbookData(saved)
  }, [])

  // Get dates with logbook entries
  const getLogbookDates = () => {
    const dates = new Set()
    logbookData.forEach(entry => {
      if (entry.date) {
        dates.add(entry.date)
      }
    })
    return dates
  }

  const logbookDates = getLogbookDates()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const formatDateString = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const hasLogbookEntry = (day) => {
    const dateString = formatDateString(currentYear, currentMonth, day)
    return logbookDates.has(dateString)
  }

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Logbook Calendar</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousMonth}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            <span className="text-sm font-semibold min-w-[120px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextMonth}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
            <div key={`${day}-${idx}`} className="text-center text-[10px] font-medium text-muted-foreground py-0.5">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const dateString = formatDateString(currentYear, currentMonth, day)
            const isToday = dateString === new Date().toISOString().split("T")[0]
            const hasEntry = hasLogbookEntry(day)

            return (
              <div
                key={day}
                className={`
                  aspect-square rounded border flex items-center justify-center text-[11px]
                  transition-all hover:scale-105 cursor-pointer
                  ${hasEntry 
                    ? "bg-gray-400 border-gray-500 hover:bg-gray-500" 
                    : "bg-muted border-border hover:bg-accent"
                  }
                  ${isToday ? "ring-1 ring-primary" : ""}
                `}
                title={hasEntry ? `${formatDate(dateString)} - Logged` : formatDate(dateString)}
              >
                {day}
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gray-400 border border-gray-500" />
            <span>Logged</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-muted border border-border" />
            <span>None</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
