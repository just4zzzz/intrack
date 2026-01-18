// Export utilities for Excel/CSV

import { getWeekOfMonth, calculateTotalHours } from "./weekUtils"
import { formatDate, formatTime } from "./dateUtils"
import ExcelJS from "exceljs"

// Convert array of objects to CSV string
function convertToCSV(data, headers) {
  const headerRow = headers.map(h => `"${h.label}"`).join(",")
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = row[header.key]
      if (value === null || value === undefined) return '""'
      const stringValue = String(value).replace(/"/g, '""')
      return `"${stringValue}"`
    }).join(",")
  })
  return [headerRow, ...dataRows].join("\n")
}

// Download CSV file
function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Download Excel file
async function downloadExcel(workbook, filename) {
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export attendance records to Excel/CSV
export function exportAttendanceToExcel(attendanceRecords) {
  if (!attendanceRecords || attendanceRecords.length === 0) {
    alert("No attendance records to export")
    return
  }

  const headers = [
    { key: "date", label: "Date" },
    { key: "timeIn", label: "Time In" },
    { key: "timeOut", label: "Time Out" },
    { key: "totalHours", label: "Total Hours" },
    { key: "status", label: "Status" },
  ]

  const csvContent = convertToCSV(attendanceRecords, headers)
  const filename = `attendance_${new Date().toISOString().split("T")[0]}.csv`
  downloadCSV(csvContent, filename)
}

// Export logbook entries to Excel/CSV
export function exportLogbookToExcel(logbookEntries) {
  if (!logbookEntries || logbookEntries.length === 0) {
    alert("No logbook entries to export")
    return
  }

  const headers = [
    { key: "date", label: "Date" },
    { key: "workDescription", label: "Work Description" },
    { key: "startTime", label: "Start Time" },
    { key: "endTime", label: "End Time" },
    { key: "hours", label: "Hours" },
  ]

  const csvContent = convertToCSV(logbookEntries, headers)
  const filename = `logbook_${new Date().toISOString().split("T")[0]}.csv`
  downloadCSV(csvContent, filename)
}

// Export all data to Excel/CSV
export function exportAllToExcel(attendanceRecords, logbookEntries) {
  if ((!attendanceRecords || attendanceRecords.length === 0) &&
    (!logbookEntries || logbookEntries.length === 0)) {
    alert("No data to export")
    return
  }

  let csvContent = ""

  if (attendanceRecords && attendanceRecords.length > 0) {
    csvContent += "ATTENDANCE RECORDS\n"
    csvContent += convertToCSV(attendanceRecords, [
      { key: "date", label: "Date" },
      { key: "timeIn", label: "Time In" },
      { key: "timeOut", label: "Time Out" },
      { key: "totalHours", label: "Total Hours" },
      { key: "status", label: "Status" },
    ])
    csvContent += "\n\n"
  }

  if (logbookEntries && logbookEntries.length > 0) {
    csvContent += "LOGBOOK ENTRIES\n"
    csvContent += convertToCSV(logbookEntries, [
      { key: "date", label: "Date" },
      { key: "tasks", label: "Tasks Accomplished" },
    ])
  }

  const filename = `intrack_export_${new Date().toISOString().split("T")[0]}.csv`
  downloadCSV(csvContent, filename)
}

// Export in OJT Logbook Format (Styled Excel)
export async function exportOJTLogbookFormat(logbookEntries, userProfile) {
  if (!userProfile) {
    alert("Please complete your profile first!")
    return
  }

  if (!logbookEntries || logbookEntries.length === 0) {
    alert("No data to export")
    return
  }

  // Create a new workbook
  const workbook = new ExcelJS.Workbook()

  // Define styles
  const headerStyle = {
    font: { bold: true, size: 14, color: { argb: "FFFFFFFF" } },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" } // Blue background
    },
    alignment: { horizontal: "center", vertical: "middle" },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    }
  }

  const companyHeaderStyle = {
    font: { bold: true, size: 16, color: { argb: "FF000000" } },
    alignment: { horizontal: "center", vertical: "middle" }
  }

  const labelStyle = {
    font: { bold: true, size: 11 },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE7E6E6" } // Light gray
    },
    alignment: { horizontal: "center", vertical: "middle" },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    }
  }

  const dataStyle = {
    font: { size: 10 },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    },
    alignment: { vertical: "top", wrapText: true }
  }

  const summaryHeaderStyle = {
    font: { bold: true, size: 12, color: { argb: "FFFFFFFF" } },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF70AD47" } // Green background
    },
    alignment: { horizontal: "center", vertical: "middle" },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    }
  }



  // Group logbook entries by month and week (using manually entered week)
  const grouped = {}
  logbookEntries.forEach(entry => {
    if (entry.date && entry.startTime && entry.endTime) {
      // Use manually entered week and month, or calculate from date if not available
      const month = entry.month || new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", { month: "long" })
      const week = entry.week || getWeekOfMonth(entry.date)
      const key = `${month}_Week${week}`

      if (!grouped[key]) {
        grouped[key] = {
          month,
          week,
          entries: []
        }
      }
      grouped[key].entries.push(entry)
    }
  })

  // Get all unique month-week combinations
  const monthWeeks = Object.keys(grouped)
    .map(key => ({
      key,
      month: grouped[key].month,
      week: grouped[key].week,
      entries: grouped[key].entries,
      totalHours: calculateTotalHours(grouped[key].entries)
    }))
    .sort((a, b) => {
      const monthOrder = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"]
      const monthDiff = monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
      if (monthDiff !== 0) return monthDiff
      return a.week - b.week
    })

  // Create a sheet for each week
  monthWeeks.forEach(mw => {
    const weekWorksheet = workbook.addWorksheet(`${mw.month} Week ${mw.week}`)
    let weekRow = 1

    // Row 1: Company Name (centered, merged)
    weekWorksheet.mergeCells(1, 1, 1, 5)
    const companyCell = weekWorksheet.getCell(1, 1)
    companyCell.value = userProfile.companyName
    companyCell.style = companyHeaderStyle
    weekWorksheet.getRow(1).height = 25

    // Row 3: Header Section (labels on top, values below)
    weekRow = 3

    // Name, Program, Section - headers in one row
    weekWorksheet.getCell(weekRow, 1).value = "Lastname"
    weekWorksheet.getCell(weekRow, 1).style = labelStyle
    weekWorksheet.getCell(weekRow, 2).value = "Firstname"
    weekWorksheet.getCell(weekRow, 2).style = labelStyle
    weekWorksheet.getCell(weekRow, 3).value = "M.I."
    weekWorksheet.getCell(weekRow, 3).style = labelStyle
    weekWorksheet.getCell(weekRow, 4).value = "Program"
    weekWorksheet.getCell(weekRow, 4).style = labelStyle
    weekWorksheet.getCell(weekRow, 5).value = "Section"
    weekWorksheet.getCell(weekRow, 5).style = labelStyle
    weekWorksheet.getRow(weekRow).height = 20
    weekRow++

    // Name, Program, Section - values in one row
    weekWorksheet.getCell(weekRow, 1).value = userProfile.lastName || ""
    weekWorksheet.getCell(weekRow, 1).style = { ...dataStyle, alignment: { horizontal: "center", vertical: "middle" } }
    weekWorksheet.getCell(weekRow, 2).value = userProfile.firstName || ""
    weekWorksheet.getCell(weekRow, 2).style = { ...dataStyle, alignment: { horizontal: "center", vertical: "middle" } }
    weekWorksheet.getCell(weekRow, 3).value = userProfile.middleInitial || ""
    weekWorksheet.getCell(weekRow, 3).style = { ...dataStyle, alignment: { horizontal: "center", vertical: "middle" } }
    weekWorksheet.getCell(weekRow, 4).value = userProfile.program || ""
    weekWorksheet.getCell(weekRow, 4).style = { ...dataStyle, alignment: { horizontal: "center", vertical: "middle" } }
    weekWorksheet.getCell(weekRow, 5).value = userProfile.section || ""
    weekWorksheet.getCell(weekRow, 5).style = { ...dataStyle, alignment: { horizontal: "center", vertical: "middle" } }
    weekRow += 2

    // Assigned Task, Week, Month, Total Hours - headers in one row
    weekWorksheet.getCell(weekRow, 1).value = "Assigned Task / Designated Position"
    weekWorksheet.getCell(weekRow, 1).style = labelStyle
    weekWorksheet.mergeCells(weekRow, 1, weekRow, 2)
    weekWorksheet.getCell(weekRow, 3).value = "Week"
    weekWorksheet.getCell(weekRow, 3).style = labelStyle
    weekWorksheet.getCell(weekRow, 4).value = "Month"
    weekWorksheet.getCell(weekRow, 4).style = labelStyle
    weekWorksheet.getCell(weekRow, 5).value = "Total Hours"
    weekWorksheet.getCell(weekRow, 5).style = labelStyle
    weekWorksheet.getRow(weekRow).height = 20
    weekRow++

    // Assigned Task, Week, Month, Total Hours - values in one row
    weekWorksheet.getCell(weekRow, 1).value = userProfile.assignedTask || ""
    weekWorksheet.getCell(weekRow, 1).style = { ...dataStyle, alignment: { horizontal: "center", vertical: "middle" } }
    weekWorksheet.mergeCells(weekRow, 1, weekRow, 2)
    weekWorksheet.getCell(weekRow, 3).value = `Week ${mw.week}`
    weekWorksheet.getCell(weekRow, 3).style = { ...dataStyle, alignment: { horizontal: "center", vertical: "middle" } }
    weekWorksheet.getCell(weekRow, 4).value = mw.month
    weekWorksheet.getCell(weekRow, 4).style = { ...dataStyle, alignment: { horizontal: "center", vertical: "middle" } }
    weekWorksheet.getCell(weekRow, 5).value = parseFloat(mw.totalHours.toFixed(2))
    weekWorksheet.getCell(weekRow, 5).style = { ...dataStyle, alignment: { horizontal: "center", vertical: "middle" } }
    weekRow += 2

    // Detailed Log Section Header
    const logStartRow = weekRow
    weekWorksheet.getCell(weekRow, 1).value = "DATE"
    weekWorksheet.getCell(weekRow, 1).style = headerStyle
    weekWorksheet.getCell(weekRow, 2).value = "Work (Task) Description"
    weekWorksheet.getCell(weekRow, 2).style = headerStyle
    weekWorksheet.getCell(weekRow, 3).value = "Start Time"
    weekWorksheet.getCell(weekRow, 3).style = headerStyle
    weekWorksheet.getCell(weekRow, 4).value = "End Time"
    weekWorksheet.getCell(weekRow, 4).style = headerStyle
    weekWorksheet.getCell(weekRow, 5).value = "Hours"
    weekWorksheet.getCell(weekRow, 5).style = headerStyle
    weekWorksheet.getRow(weekRow).height = 25
    weekRow++

    // Sort entries for this week by date
    const weekEntries = mw.entries.sort((a, b) => new Date(a.date) - new Date(b.date))

    // Add log entries for this week
    weekEntries.forEach(entry => {
      weekWorksheet.getCell(weekRow, 1).value = formatDate(entry.date)
      weekWorksheet.getCell(weekRow, 1).style = { ...dataStyle, alignment: { horizontal: "center", vertical: "middle" } }

      weekWorksheet.getCell(weekRow, 2).value = entry.workDescription || entry.tasks || ""
      weekWorksheet.getCell(weekRow, 2).style = dataStyle

      weekWorksheet.getCell(weekRow, 3).value = formatTime(entry.startTime)
      weekWorksheet.getCell(weekRow, 3).style = { ...dataStyle, alignment: { horizontal: "center", vertical: "middle" } }

      weekWorksheet.getCell(weekRow, 4).value = formatTime(entry.endTime)
      weekWorksheet.getCell(weekRow, 4).style = { ...dataStyle, alignment: { horizontal: "center", vertical: "middle" } }

      weekWorksheet.getCell(weekRow, 5).value = parseFloat(entry.hours || 0)
      weekWorksheet.getCell(weekRow, 5).style = { ...dataStyle, alignment: { horizontal: "center", vertical: "middle" } }

      weekRow++
    })

    // Set column widths
    weekWorksheet.getColumn(1).width = 15  // DATE
    weekWorksheet.getColumn(2).width = 50  // Work Description
    weekWorksheet.getColumn(3).width = 12  // Start Time
    weekWorksheet.getColumn(4).width = 12  // End Time
    weekWorksheet.getColumn(5).width = 10  // Hours

    // Set row heights for better readability
    for (let i = logStartRow + 1; i < weekRow; i++) {
      weekWorksheet.getRow(i).height = 20
    }
  })

  // Delete the default empty sheet
  workbook.removeWorksheet(workbook.worksheets[1])

  // Download the file
  const filename = `OJT_Logbook_${userProfile.lastName}_${new Date().toISOString().split("T")[0]}.xlsx`
  await downloadExcel(workbook, filename)
}