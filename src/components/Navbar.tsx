import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "./ui/Button";

/* -------------------- HELPERS -------------------- */

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<any>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getUser());

    const dark = localStorage.getItem("theme") === "dark";
    setIsDark(dark);

    if (dark) document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);

    document.documentElement.classList.toggle("dark");

    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isDashboard = location.pathname.startsWith("/dashboard");
  if (isDashboard) return null;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 
    backdrop-blur-2xl bg-black/40 
    border-b border-white/10 text-white"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl">
            <Leaf className="text-white w-5 h-5" />
          </div>

          <span className="text-lg font-bold tracking-wide">
            Waste<span className="text-primary">Exchange</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          <Link className="font-semibold hover:text-primary transition" to="/">
            Home
          </Link>

          <Link
            className="font-semibold hover:text-primary transition"
            to="/dashboard/marketplace"
          >
            Marketplace
          </Link>

          <Link
            className="font-semibold hover:text-primary transition"
            to="/about"
          >
            How it Works
          </Link>

          <Link to="/dashboard/carbon">
            <Button variant="ghost" className="text-blue-400">
              Carbon
            </Button>
          </Link>

          <Link to="/dashboard/digital-twin">
            <Button variant="ghost" className="text-blue-400">
              Digital Twin
            </Button>
          </Link>

          <div className="h-4 w-px bg-white/20" />

          {/* DARK MODE */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDark ? <Sun /> : <Moon />}
          </Button>

          {/* AUTH */}
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-blue-400">
                  Dashboard
                </Button>
              </Link>

              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-blue-400">
                  Login
                </Button>
              </Link>

              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <div className="md:hidden flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDark ? <Sun /> : <Moon />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden backdrop-blur-2xl bg-black/80 
        border-t border-white/10 px-6 py-6 space-y-4"
        >
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>

          <Link
            to="/dashboard/marketplace"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Marketplace
          </Link>

          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
            How it Works
          </Link>

          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">
                <Button className="w-full">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
