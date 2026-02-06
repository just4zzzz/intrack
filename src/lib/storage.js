// ...existing code...

const CURRENT_USER_KEY = "currentUserId"

function getUserScopedKey(key) {
  const userId = localStorage.getItem(CURRENT_USER_KEY)
  return userId ? `${key}:${userId}` : key
}

// Save attendance records
export function saveAttendance(attendance) {
  localStorage.setItem(getUserScopedKey('attendance'), JSON.stringify(attendance))
}

// Load attendance records
export function loadAttendance() {
  const saved = localStorage.getItem(getUserScopedKey('attendance'))
  return saved ? JSON.parse(saved) : []
}

// Save logbook entries
export function saveLogbook(logbook) {
  localStorage.setItem(getUserScopedKey('logbook'), JSON.stringify(logbook))
}

// Load logbook entries
export function loadLogbook() {
  const saved = localStorage.getItem(getUserScopedKey('logbook'))
  return saved ? JSON.parse(saved) : []
}

// Save user profile
export function saveUserProfile(profile) {
  localStorage.setItem(getUserScopedKey('userProfile'), JSON.stringify(profile))
}

// Load user profile
export function loadUserProfile() {
  const saved = localStorage.getItem(getUserScopedKey('userProfile'))
  return saved ? JSON.parse(saved) : null
}

// Save attendance settings
export function saveAttendanceSettings(settings) {
  localStorage.setItem(getUserScopedKey('attendanceSettings'), JSON.stringify(settings))
}

// Load attendance settings
export function loadAttendanceSettings() {
  const saved = localStorage.getItem(getUserScopedKey('attendanceSettings'))
  return saved ? JSON.parse(saved) : {
    scheduledTimeIn: "08:00",
    graceWindowMinutes: 30,
  }
}