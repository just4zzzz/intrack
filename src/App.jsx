import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { Login } from "@/pages/Login"
import { Dashboard } from "@/pages/Dashboard"
import { Logbook } from "@/pages/Logbook"
import { History } from "@/pages/History"
import { Profile } from "@/pages/Profile"

function App() {
  const isAuthenticated = true

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="logbook" element={<Logbook />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App