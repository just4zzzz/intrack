// Mock user data
export const mockUser = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "intern",
  }
  
  // Mock attendance records
  export const mockAttendance = [
    {
      id: 1,
      date: "2024-01-15",
      timeIn: "09:00 AM",
      timeOut: "05:00 PM",
      totalHours: 8,
      status: "present",
    },
    {
      id: 2,
      date: "2024-01-16",
      timeIn: "09:15 AM",
      timeOut: "05:30 PM",
      totalHours: 8.25,
      status: "present",
    },
    {
      id: 3,
      date: "2024-01-17",
      timeIn: "09:00 AM",
      timeOut: null,
      totalHours: 0,
      status: "time-in-only",
    },
  ]
  
  // Mock logbook entries
  export const mockLogbook = [
    {
      id: 1,
      date: "2024-01-15",
      tasks: "Worked on user authentication feature, reviewed code with mentor",
      learnings: "Learned about JWT tokens and secure password hashing",
      issues: "Had trouble understanding async/await patterns",
    },
    {
      id: 2,
      date: "2024-01-16",
      tasks: "Fixed bugs in dashboard component, wrote unit tests",
      learnings: "Understanding React testing library and Jest",
      issues: "None",
    },
    {
      id: 3,
      date: "2024-01-17",
      tasks: "Attended team meeting, started working on API integration",
      learnings: "Learned about RESTful API design principles",
      issues: "API endpoint was returning 404 error",
    },
  ]
  
  // Calculate totals from mock data
  export const getTotalHours = () => {
    return mockAttendance.reduce((total, record) => total + record.totalHours, 0)
  }
  
  export const getTotalDays = () => {
    return mockAttendance.filter(record => record.status === "present").length
  }