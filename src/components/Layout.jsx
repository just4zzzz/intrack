import { Link, useLocation, Outlet, useNavigate } from "react-router-dom"
import { Button } from "./ui/Button"
import { authService } from "@/lib/auth"

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/logbook", label: "Logbook" },
    { path: "/history", label: "History" },
    { path: "/profile", label: "Profile" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">InTrack</h1>
            <nav className="flex items-center gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Button 
                variant="outline"
                size="sm"
                onClick={async () => {
                  await authService.signOut()
                  localStorage.removeItem("currentUserId")
                  navigate("/login", { replace: true })
                }}
              >
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <Outlet />
      </main>
    </div>
  )
}