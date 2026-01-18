import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { User, Building2 } from "lucide-react"
import { saveUserProfile, loadUserProfile } from "@/lib/storage"
import { useNavigate } from "react-router-dom"

export function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState({
    companyName: "",
    lastName: "",
    firstName: "",
    middleInitial: "",
    program: "",
    section: "",
    assignedTask: "",
    designatedPosition: "",
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const saved = loadUserProfile()
    if (saved) {
      setProfile(saved)
    } else {
      setIsEditing(true) // If no profile, allow editing
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    saveUserProfile(profile)
    setIsEditing(false)
    alert("Profile saved successfully!")
  }

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile & Registration</h1>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Company Information */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Building2 className="w-4 h-4" />
                  Company Name
                </label>
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Enter company name"
                  required
                />
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder="Last Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    M.I.
                  </label>
                  <input
                    type="text"
                    value={profile.middleInitial}
                    onChange={(e) => handleChange("middleInitial", e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder="M"
                    maxLength={1}
                  />
                </div>
              </div>

              {/* Program and Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Program
                  </label>
                  <input
                    type="text"
                    value={profile.program}
                    onChange={(e) => handleChange("program", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder="e.g., BS Information Technology"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Section
                  </label>
                  <input
                    type="text"
                    value={profile.section}
                    onChange={(e) => handleChange("section", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder="e.g., IT-4A"
                    required
                  />
                </div>
              </div>

              {/* Assigned Task / Position */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Assigned Task / Designated Position
                </label>
                <input
                  type="text"
                  value={profile.assignedTask}
                  onChange={(e) => handleChange("assignedTask", e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="e.g., Frontend Developer Intern"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Save Profile
                </Button>
                {loadUserProfile() && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const saved = loadUserProfile()
                      if (saved) setProfile(saved)
                      setIsEditing(false)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{profile.companyName || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {profile.lastName && profile.firstName
                      ? `${profile.lastName}, ${profile.firstName}${profile.middleInitial ? ` ${profile.middleInitial}.` : ""}`
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Program</p>
                  <p className="font-medium">{profile.program || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Section</p>
                  <p className="font-medium">{profile.section || "Not set"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Assigned Task / Position</p>
                  <p className="font-medium">{profile.assignedTask || "Not set"}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}