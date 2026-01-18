import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { loadLogbook, saveLogbook, loadUserProfile } from "@/lib/storage"
import { formatDate, formatTime } from "@/lib/dateUtils"
import { exportOJTLogbookFormat } from "@/lib/exportUtils"
import { Trash2, Edit2, Download, Search } from "lucide-react"

export function History() {
  const [logbookEntries, setLogbookEntries] = useState([])
  const [searchLogbook, setSearchLogbook] = useState("")
  
  // Edit states
  const [editingLogbook, setEditingLogbook] = useState(null)
  const [editLogbookForm, setEditLogbookForm] = useState({
    date: "",
    week: "",
    startTime: "",
    endTime: "",
    workDescription: "",
    learnings: "",
    issues: "",
  })

  useEffect(() => {
    const logbook = loadLogbook()
    setLogbookEntries(logbook)
  }, [])

  // Filter logbook entries
  const filteredLogbook = logbookEntries.filter(entry => {
    if (!searchLogbook) return true
    
    const searchLower = searchLogbook.toLowerCase()
    return (
      entry.date.toLowerCase().includes(searchLower) ||
      (entry.workDescription && entry.workDescription.toLowerCase().includes(searchLower)) ||
      (entry.learnings && entry.learnings.toLowerCase().includes(searchLower)) ||
      (entry.issues && entry.issues.toLowerCase().includes(searchLower))
    )
  })

  // Delete logbook entry
  const handleDeleteLogbook = (id) => {
    if (window.confirm("Are you sure you want to delete this logbook entry?")) {
      const updated = logbookEntries.filter(entry => entry.id !== id)
      setLogbookEntries(updated)
      saveLogbook(updated)
    }
  }

  // Start editing logbook
  const startEditLogbook = (entry) => {
    setEditingLogbook(entry.id)
    // Get month name from date if not already stored
    const month = entry.month || new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", { month: "long" })
    setEditLogbookForm({
      date: entry.date,
      week: entry.week || "",
      startTime: entry.startTime || "",
      endTime: entry.endTime || "",
      workDescription: entry.workDescription || entry.tasks || "",
      learnings: entry.learnings || "",
      issues: entry.issues || "",
    })
  }

  // Calculate hours
  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0
    const start = new Date(`2000-01-01 ${startTime}`)
    const end = new Date(`2000-01-01 ${endTime}`)
    return (end - start) / (1000 * 60 * 60)
  }

  // Save edited logbook
  const saveEditLogbook = () => {
    const updated = logbookEntries.map(entry => {
      if (entry.id === editingLogbook) {
        const hours = calculateHours(editLogbookForm.startTime, editLogbookForm.endTime)
        // Get month name from date
        const month = new Date(editLogbookForm.date + "T00:00:00").toLocaleDateString("en-US", { month: "long" })
        return {
          ...entry,
          date: editLogbookForm.date,
          week: parseInt(editLogbookForm.week) || 1,
          month: month,
          startTime: editLogbookForm.startTime,
          endTime: editLogbookForm.endTime,
          workDescription: editLogbookForm.workDescription.trim(),
          learnings: editLogbookForm.learnings.trim(),
          issues: editLogbookForm.issues.trim(),
          hours: parseFloat(hours.toFixed(2)),
        }
      }
      return entry
    })
    
    setLogbookEntries(updated)
    saveLogbook(updated)
    setEditingLogbook(null)
  }

  const cancelEditLogbook = () => {
    setEditingLogbook(null)
    setEditLogbookForm({ date: "", week: "", startTime: "", endTime: "", workDescription: "", learnings: "", issues: "" })
  }

  // Sort filtered results
  const sortedLogbook = [...filteredLogbook].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">History</h1>
        <Button
          onClick={async () => {
            const profile = loadUserProfile()
            await exportOJTLogbookFormat(logbookEntries, profile)
          }}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export OJT Format
        </Button>
      </div>
      
      {/* Logbook History */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Logbook History</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search logbook..."
                  value={searchLogbook}
                  onChange={(e) => setSearchLogbook(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-input rounded-md bg-background text-sm"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedLogbook.length > 0 ? (
            <>
              {searchLogbook && (
                <p className="text-xs text-muted-foreground mb-4">
                  Found {sortedLogbook.length} result{sortedLogbook.length !== 1 ? 's' : ''}
                </p>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Week</TableHead>
                    <TableHead>Work Description</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLogbook.map((entry) => (
                    <TableRow key={entry.id}>
                      {editingLogbook === entry.id ? (
                        <>
                          <TableCell>
                            <input
                              type="date"
                              value={editLogbookForm.date}
                              onChange={(e) => setEditLogbookForm({...editLogbookForm, date: e.target.value})}
                              className="w-full px-2 py-1 border border-input rounded text-sm bg-background"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="number"
                              min="1"
                              max="5"
                              value={editLogbookForm.week}
                              onChange={(e) => setEditLogbookForm({...editLogbookForm, week: e.target.value})}
                              className="w-full px-2 py-1 border border-input rounded text-sm bg-background"
                              placeholder="Week"
                            />
                          </TableCell>
                          <TableCell>
                            <textarea
                              value={editLogbookForm.workDescription}
                              onChange={(e) => setEditLogbookForm({...editLogbookForm, workDescription: e.target.value})}
                              rows={2}
                              className="w-full px-2 py-1 border border-input rounded text-sm bg-background"
                              placeholder="Work description"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="time"
                              value={editLogbookForm.startTime}
                              onChange={(e) => setEditLogbookForm({...editLogbookForm, startTime: e.target.value})}
                              className="w-full px-2 py-1 border border-input rounded text-sm bg-background"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="time"
                              value={editLogbookForm.endTime}
                              onChange={(e) => setEditLogbookForm({...editLogbookForm, endTime: e.target.value})}
                              className="w-full px-2 py-1 border border-input rounded text-sm bg-background"
                            />
                          </TableCell>
                          <TableCell>
                            {editLogbookForm.startTime && editLogbookForm.endTime ? (
                              <span className="text-sm">
                                {calculateHours(editLogbookForm.startTime, editLogbookForm.endTime).toFixed(2)}h
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={saveEditLogbook}
                                className="flex-1"
                              >
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEditLogbook}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="font-medium">
                            {formatDate(entry.date)}
                          </TableCell>
                          <TableCell className="text-center">
                            {entry.week ? `Week ${entry.week}` : "-"}
                          </TableCell>
                          <TableCell className="max-w-md">
                            <p className="text-sm">{entry.workDescription || entry.tasks || "-"}</p>
                            {entry.learnings && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Learnings: {entry.learnings.substring(0, 50)}...
                              </p>
                            )}
                          </TableCell>
                          <TableCell>{entry.startTime ? formatTime(entry.startTime) : "-"}</TableCell>
                          <TableCell>{entry.endTime ? formatTime(entry.endTime) : "-"}</TableCell>
                          <TableCell>{entry.hours || 0}h</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditLogbook(entry)}
                                className="text-primary hover:text-primary"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteLogbook(entry.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <p className="text-sm text-muted-foreground py-4">
              {searchLogbook 
                ? "No logbook entries found matching your search." 
                : "No logbook entries yet. Start documenting your daily work!"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
