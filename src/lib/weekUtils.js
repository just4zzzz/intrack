// Week calculation utilities

// Get week number of month (1-5)
export function getWeekOfMonth(dateString) {
    const date = new Date(dateString + "T00:00:00")
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const firstDayOfWeek = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    const dayOfMonth = date.getDate()
    const weekNumber = Math.ceil((dayOfMonth + firstDayOfWeek) / 7)
    
    return weekNumber
  }
  
  // Get month name
  export function getMonthName(dateString) {
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("en-US", { month: "long" })
  }
  
  // Get month abbreviation
  export function getMonthAbbr(dateString) {
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("en-US", { month: "short" })
  }
  
  // Group records by month and week
  export function groupByMonthAndWeek(records) {
    const grouped = {}
    
    records.forEach(record => {
      const month = getMonthName(record.date)
      const week = getWeekOfMonth(record.date)
      const key = `${month}_Week${week}`
      
      if (!grouped[key]) {
        grouped[key] = {
          month,
          week,
          records: []
        }
      }
      
      grouped[key].records.push(record)
    })
    
    // Sort by date
    Object.keys(grouped).forEach(key => {
      grouped[key].records.sort((a, b) => new Date(a.date) - new Date(b.date))
    })
    
    return grouped
  }
  
  // Calculate total hours for a period
  export function calculateTotalHours(records) {
    return records.reduce((total, record) => {
      // Support both "hours" (logbook) and "totalHours" (attendance) fields
      return total + (parseFloat(record.hours || record.totalHours) || 0)
    }, 0)
  }