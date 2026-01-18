// This file handles saving/loading data from browser's localStorage

// Save attendance records
export function saveAttendance(attendance) {
  localStorage.setItem('attendance', JSON.stringify(attendance))
}

// Load attendance records
export function loadAttendance() {
  const saved = localStorage.getItem('attendance')
  return saved ? JSON.parse(saved) : []
}

// Save logbook entries
export function saveLogbook(logbook) {
  localStorage.setItem('logbook', JSON.stringify(logbook))
}

// Load logbook entries
export function loadLogbook() {
  const saved = localStorage.getItem('logbook')
  return saved ? JSON.parse(saved) : []
}

// Save user profile
export function saveUserProfile(profile) {
  localStorage.setItem('userProfile', JSON.stringify(profile))
}

// Load user profile
export function loadUserProfile() {
  const saved = localStorage.getItem('userProfile')
  return saved ? JSON.parse(saved) : null
}

// Save attendance settings
export function saveAttendanceSettings(settings) {
  localStorage.setItem('attendanceSettings', JSON.stringify(settings))
}

// Load attendance settings
export function loadAttendanceSettings() {
  const saved = localStorage.getItem('attendanceSettings')
  return saved ? JSON.parse(saved) : {
    scheduledTimeIn: "08:00",
    graceWindowMinutes: 30,
  }
}