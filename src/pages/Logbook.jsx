import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { BookOpen, CheckCircle2 } from "lucide-react"
import { saveLogbook, loadLogbook, loadAttendanceSettings } from "@/lib/storage"
import { formatDate, getRelativeDate, formatTime } from "@/lib/dateUtils"

export function Logbook() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [week, setWeek] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [workDescription, setWorkDescription] = useState("")
  const [savedEntries, setSavedEntries] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [settings, setSettings] = useState({
    scheduledTimeIn: "08:00",
    graceWindowMinutes: 30,
  })

  // Load saved entries and settings
  useEffect(() => {
    const saved = loadLogbook()
    const savedSettings = loadAttendanceSettings()
    setSavedEntries(saved)
    setSettings(savedSettings)
  }, [])

  // Calculate hours with grace window
  const calculateHours = (startTime, endTime, scheduledTimeIn, graceWindowMinutes) => {
    if (!startTime || !endTime) return { hours: 0, adjustedStartTime: startTime, wasAdjusted: false }

    const startDate = new Date(`2000-01-01 ${startTime}`)
    const endDate = new Date(`2000-01-01 ${endTime}`)
    const scheduledDate = new Date(`2000-01-01 ${scheduledTimeIn}`)

    // Check if within grace window
    const diffMinutes = (startDate - scheduledDate) / (1000 * 60)
    let timeInForCalculation = startTime

    if (diffMinutes > 0 && diffMinutes <= graceWindowMinutes) {
      // Within grace window - use scheduled time
      timeInForCalculation = scheduledTimeIn
    } else if (diffMinutes < 0) {
      // Clocked in early - use actual time
      timeInForCalculation = startTime
    }
    // If late beyond grace window, use actual time

    // Calculate hours
    const timeInCalc = new Date(`2000-01-01 ${timeInForCalculation}`)
    const hours = (endDate - timeInCalc) / (1000 * 60 * 60)

    return {
      hours: Math.max(0, hours),
      adjustedStartTime: timeInForCalculation,
      wasAdjusted: timeInForCalculation !== startTime
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (date && week && startTime && endTime && workDescription) {
      // Check if an entry with the same date already exists
      const duplicateEntry = savedEntries.some(entry => entry.date === date)
      if (duplicateEntry) {
        alert("An entry for this date already exists. Please choose a different date.")
        return
      }

      const calculation = calculateHours(
        startTime,
        endTime,
        settings.scheduledTimeIn,
        settings.graceWindowMinutes
      )

      // Get month name from date
      const month = new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "long" })

      const newEntry = {
        id: Date.now(),
        date: date,
        week: parseInt(week) || 1,
        month: month,
        startTime: startTime,
        endTime: endTime,
        adjustedStartTime: calculation.adjustedStartTime,
        wasAdjusted: calculation.wasAdjusted,
        hours: parseFloat(calculation.hours.toFixed(2)),
        workDescription: workDescription.trim(),
        createdAt: new Date().toISOString()
      }

      const updated = [...savedEntries, newEntry]
      setSavedEntries(updated)
      saveLogbook(updated)

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      // Reset form
      setDate(new Date().toISOString().split("T")[0])
      setWeek("")
      setStartTime("")
      setEndTime("")
      setWorkDescription("")
    } else {
      alert("Please fill in Date, Week, Start Time, End Time, and Work Description")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Daily Logbook</h1>

      {/* Success Message */}
      {showSuccess && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              <p className="font-medium">Entry saved successfully!</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            New Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Date *
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              />
              {date && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {formatDate(date)}
                </p>
              )}
            </div>

            {/* Week */}
            <div>
              <label htmlFor="week" className="block text-sm font-medium mb-2">
                Week (1-5) *
              </label>
              <input
                id="week"
                type="number"
                min="1"
                max="5"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                placeholder="Enter week number (1-5)"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter which week of the month (e.g., 1 for Week 1, 2 for Week 2, etc.)
              </p>
            </div>

            {/* Time Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium mb-2">
                  Start Time *
                </label>
                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                />
                {startTime && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(startTime)}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium mb-2">
                  End Time *
                </label>
                <input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                />
                {endTime && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(endTime)}
                  </p>
                )}
              </div>
            </div>

            {/* Hours Preview */}
            {startTime && endTime && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">Calculated Hours</p>
                <p className="text-lg font-semibold">
                  {calculateHours(startTime, endTime, settings.scheduledTimeIn, settings.graceWindowMinutes).hours.toFixed(2)} hours
                </p>
                {calculateHours(startTime, endTime, settings.scheduledTimeIn, settings.graceWindowMinutes).wasAdjusted && (
                  <p className="text-xs text-primary mt-1">
                    Grace window applied: Using scheduled time ({formatTime(settings.scheduledTimeIn)})
                  </p>
                )}
              </div>
            )}

            {/* Work Description */}
            <div>
              <label htmlFor="workDescription" className="block text-sm font-medium mb-2">
                Work (Task) Description *
              </label>
              <textarea
                id="workDescription"
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                placeholder="Describe the tasks/work you accomplished..."
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Save Entry
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Show Recent Entries */}
      {savedEntries.length > 0 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-base">Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedEntries
                .slice(-3)
                .reverse()
                .map((entry) => (
                  <Card key={entry.id} className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-sm">{formatDate(entry.date)}</p>
                          <p className="text-xs text-muted-foreground">
                            {getRelativeDate(entry.date)} • Week {entry.week || "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{entry.hours || 0}h</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Work Description</p>
                          <p className="mt-0.5">{entry.workDescription}</p>
                        </div>
                        {entry.learnings && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Learnings</p>
                            <p className="mt-0.5">{entry.learnings}</p>
                          </div>
                        )}
                        {entry.issues && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Issues</p>
                            <p className="mt-0.5">{entry.issues}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
