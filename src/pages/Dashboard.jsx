import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { loadLogbook } from "@/lib/storage"
import { Calendar } from "@/components/Calendar"
import { formatDate, formatTime, getRelativeDate } from "@/lib/dateUtils"

export function Dashboard() {
  const [logbookEntries, setLogbookEntries] = useState([])

  useEffect(() => {
    const saved = loadLogbook()
    setLogbookEntries(saved)
  }, [])

  // Calculate totals from logbook entries
  const totalHours = logbookEntries.reduce((total, entry) => {
    return total + (parseFloat(entry.hours) || 0)
  }, 0)

  const totalDays = logbookEntries.length

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Hours</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-bold">{totalHours.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">hours logged</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Days</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-bold">{totalDays}</p>
              <p className="text-xs text-muted-foreground">days logged</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <div className="lg:col-span-2">
          <Calendar />
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {logbookEntries.length > 0 ? (
            <div className="space-y-1.5">
              {logbookEntries
                .slice(-5)
                .reverse()
                .map(entry => (
                  <div key={entry.id} className="flex justify-between items-center p-2 border rounded text-sm hover:bg-accent/50 transition-colors">
                    <div>
                      <p className="font-medium text-xs">
                        {getRelativeDate(entry.date)} • {formatDate(entry.date)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{entry.hours || 0}h</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                        {entry.workDescription?.substring(0, 30)}...
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No logbook entries yet. Start by creating your first entry!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
