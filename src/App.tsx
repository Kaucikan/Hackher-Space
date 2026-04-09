import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { ForgotPassword } from "./pages/ForgotPassword";

import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";
import { Marketplace } from "./pages/Marketplace";
import { AddWaste } from "./pages/AddWaste";
import { Messages } from "./pages/Messages";
import { MyListings } from "./pages/MyListings";
import CarbonCalculator from "./pages/CarbonCalculator";
import { DigitalTwin } from "./pages/DigitalTwin";

import { Bell, Search, User } from "lucide-react";
import { Button } from "./components/ui/Button";

/* -------------------- AUTH -------------------- */


const getUser = () => {
  try {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/* -------------------- ROUTES -------------------- */

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getUser();
  return user?.id ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getUser();
  return user?.id ? <Navigate to="/dashboard" replace /> : children;
};

/* -------------------- LAYOUT -------------------- */

const DashboardLayout = () => {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const u = getUser();
    setUser(u);

    if (u) {
      setForm({
        name: u.name || "",
        phone: u.phone || "",
        email: u.email || "",
      });
    }
  }, []);

  const saveProfile = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/update-profile/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // update local storage
      localStorage.setItem("user", JSON.stringify(data));

      // update UI
      setUser(data);
      setEdit(false);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 ml-20 md:ml-64">
        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5 text-muted" />
            </Button>

            {/* PROFILE */}
            <div
              onClick={() => setOpen(true)}
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 px-3 py-1 rounded-lg"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted">
                  {user?.phone || "Add phone"}
                </p>
              </div>

              <div className="w-9 h-9 bg-primary/10 rounded-md flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* PROFILE MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[380px]">
            <h2 className="text-lg font-semibold mb-4">Profile</h2>

            {!edit ? (
              <>
                <div className="space-y-3 mb-5">
                  <div>
                    <p className="text-xs text-muted">Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted">Phone</p>
                    <p className="font-medium">{user?.phone || "Not added"}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => setEdit(true)}>
                    Edit Profile
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <>
                <input
                  className="w-full mb-3 p-2 border rounded-md"
                  value={form.name}
                  placeholder="Name"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                  className="w-full mb-3 p-2 border rounded-md"
                  value={form.phone}
                  placeholder="Phone"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />

                <input
                  className="w-full mb-4 p-2 border rounded-md"
                  value={form.email}
                  placeholder="Email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={saveProfile}>
                    Save
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setEdit(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------- APP -------------------- */

export default function App() {
  return (
    <Router>
      <Routes>
        {/* LANDING */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <LandingPage />
            </>
          }
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthPage type="login" />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <AuthPage type="register" />
            </PublicRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add" element={<AddWaste />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="listings" element={<MyListings />} />
          <Route path="digital-twin" element={<DigitalTwin />} />
          <Route path="carbon" element={<CarbonCalculator />} />
          <Route path="messages" element={<Messages />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

