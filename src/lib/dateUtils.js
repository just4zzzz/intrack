// Date formatting utilities

// Format date from YYYY-MM-DD to readable format
export function formatDate(dateString) {
    if (!dateString) return ""
    
    const date = new Date(dateString + "T00:00:00") // Add time to avoid timezone issues
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
    // Example: "Jan 15, 2024"
  }
  
  // Format date to long format
  export function formatDateLong(dateString) {
    if (!dateString) return ""
    
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
    // Example: "Monday, January 15, 2024"
  }
  
  // Format date to short format (MM/DD/YYYY)
  export function formatDateShort(dateString) {
    if (!dateString) return ""
    
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric"
    })
    // Example: "01/15/2024"
  }
  
  // Get relative date (e.g., "2 days ago", "Today", "Yesterday")
  export function getRelativeDate(dateString) {
    if (!dateString) return ""
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const date = new Date(dateString + "T00:00:00")
    date.setHours(0, 0, 0, 0)
    
    const diffTime = today - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays === -1) return "Tomorrow"
    if (diffDays > 0 && diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 0 && diffDays > -7) return `In ${Math.abs(diffDays)} days`
    
    return formatDate(dateString)
  }
  
  // Format time (HH:MM AM/PM)
  export function formatTime(timeString) {
    if (!timeString) return ""
    
    // If already formatted, return as is
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString
    }
    
    // Convert 24-hour to 12-hour format
    const [hours, minutes] = timeString.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    
    return `${hour12}:${minutes} ${ampm}`
  }