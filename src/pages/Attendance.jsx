import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Clock } from "lucide-react"
import { saveAttendance, loadAttendance } from "@/lib/storage"
import { formatDate, formatTime, formatDateLong } from "@/lib/dateUtils"

export function Attendance() {
  const [timeIn, setTimeIn] = useState(null)
  const [timeOut, setTimeOut] = useState(null)
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [attendanceRecords, setAttendanceRecords] = useState([])

  // Load saved attendance when component loads
  useEffect(() => {
    const saved = loadAttendance()
    setAttendanceRecords(saved)
  }, [])

  const handleTimeIn = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })
    const dateString = now.toISOString().split("T")[0]

    setTimeIn(timeString)
    setIsClockedIn(true)

    const newRecord = {
      id: Date.now(),
      date: dateString,
      timeIn: timeString,
      timeOut: null,
      totalHours: 0,
      status: "time-in-only"
    }

    const updated = [...attendanceRecords, newRecord]
    setAttendanceRecords(updated)
    saveAttendance(updated)

    alert(`Time In: ${timeString}`)
  }

  const handleTimeOut = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })

    setTimeOut(timeString)
    setIsClockedIn(false)

    const today = new Date().toISOString().split("T")[0]
    const openRecordIndex = [...attendanceRecords]
      .reverse()
      .findIndex(record => record.status === "time-in-only")

    if (openRecordIndex === -1) {
      alert("No open time-in record found.")
      return
    }

    const actualIndex = attendanceRecords.length - 1 - openRecordIndex
    const updated = attendanceRecords.map((record, index) => {
      if (index === actualIndex) {
        const timeInDate = new Date(`${record.date} ${record.timeIn}`)
        const timeOutDate = new Date(`${today} ${timeString}`)
        if (timeOutDate <= timeInDate) {
          timeOutDate.setDate(timeOutDate.getDate() + 1)
        }
        const hours = (timeOutDate - timeInDate) / (1000 * 60 * 60)

        return {
          ...record,
          timeOut: timeString,
          totalHours: hours.toFixed(2),
          status: "present"
        }
      }
      return record
    })

    setAttendanceRecords(updated)
    saveAttendance(updated)

    alert(`Time Out: ${timeString}`)
  }

  // Get today's date formatted
  const todayFormatted = formatDateLong(new Date().toISOString().split("T")[0])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Attendance</h1>

      <Card className="max-w-md mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Clock In/Out
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{todayFormatted}</p>
            <p className="text-sm text-muted-foreground mt-1">Current Time</p>
            <p className="text-2xl font-bold">
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              })}
            </p>
          </div>

          {timeIn && (
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">Time In</p>
              <p className="text-lg font-semibold">{formatTime(timeIn)}</p>
            </div>
          )}

          {timeOut && (
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">Time Out</p>
              <p className="text-lg font-semibold">{formatTime(timeOut)}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleTimeIn}
              disabled={isClockedIn}
              className="flex-1"
            >
              Time In
            </Button>
            <Button
              onClick={handleTimeOut}
              disabled={!isClockedIn}
              variant="outline"
              className="flex-1"
            >
              Time Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Show today's record */}
      {attendanceRecords.length > 0 && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Today's Record</CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceRecords
              .filter(record => record.date === new Date().toISOString().split("T")[0])
              .map(record => (
                <div key={record.id} className="space-y-2">
                  <p><strong>Date:</strong> {formatDate(record.date)}</p>
                  <p><strong>Time In:</strong> {formatTime(record.timeIn)}</p>
                  <p><strong>Time Out:</strong> {record.timeOut ? formatTime(record.timeOut) : "Not yet"}</p>
                  <p><strong>Hours:</strong> {record.totalHours || 0}h</p>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}