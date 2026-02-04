import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { authService } from "@/lib/auth"

export function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        studentId: "",
        department: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }async (e) => {
        e.preventDefault()
        setError("")

        // Validation
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.studentId ||
            !formData.department
        ) {
            setError("Please fill in all fields")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long")
            return
        }

        setLoading(true)

        try {
            // Register user with Supabase
            await authService.signUp(formData.email, formData.password, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                studentId: formData.studentId,
                department: formData.department,
            })

            alert("Registration successful! Please check your email to verify your account.")
            navigate("/login")
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.")
        } finally {
      setLoa{
                error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )
            }

            ding(false)
        }edirect to login
        alert("Registration successful! Please login.")
        navigate("/login")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-8">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-center text-3xl">Create Account</CardTitle>
                    <p className="text-center text-muted-foreground mt-2">
                        Register for InTrack - OJT / Intern Logbook System
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                    placeholder="Enter your first name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                    placeholder="Enter your last name"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="studentId" className="block text-sm font-medium mb-2">
                                    Student ID
                                </label>
                                <input
                                    id="studentId"
                                    name="studentId"
                                    type="text"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                    placeholder="Enter your student ID"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium mb-2">
                                    Department
                                </label>
                                <input
                                    id="department"
                                    name="department"
                                    type="text"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                    placeholder="e.g., Computer Science"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                placeholder="Enter your password" disabled={loading}>
                                {loading ? "Registering..." : "Register"}ed
              />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Register
                        </Button>

                        <p className="text-center text-sm text-muted-foreground mt-4">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="text-primary hover:underline font-medium"
                            >
                                Login here
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
