import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";

/* GET USER */
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const Navbar = () => {
  const { t } = useTranslation();

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
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl">
            <Leaf className="text-white w-5 h-5" />
          </div>

          <span className="text-lg md:text-xl font-bold">
            Waste<span className="text-primary">Exchange</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 text-sm md:text-base">
          <Link className="hover:text-primary transition" to="/">
            {t("home") || "Home"}
          </Link>

          <Link
            className="hover:text-primary transition"
            to="/dashboard/marketplace"
          >
            {t("marketplace") || "Marketplace"}
          </Link>

          <Link className="hover:text-primary transition" to="/about">
            {t("howItWorks") || "How It Works"}
          </Link>

          <div className="h-5 w-px bg-white/20" />

          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDark ? <Sun /> : <Moon />}
          </Button>

          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-sm md:text-base">
                  {t("dashboard") || "Dashboard"}
                </Button>
              </Link>

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-sm md:text-base"
              >
                {t("logout") || "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-sm md:text-base">
                  {t("login") || "Login"}
                </Button>
              </Link>

              <Link to="/register">
                <Button className="px-5 py-2 md:text-base">
                  {t("getStarted") || "Get Started"}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <div className="md:hidden flex items-center gap-2">
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
        <div className="md:hidden backdrop-blur-xl bg-black/90 border-t border-white/10 px-6 py-6 space-y-5 text-base">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            {t("home") || "Home"}
          </Link>

          <Link
            to="/dashboard/marketplace"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t("marketplace") || "Marketplace"}
          </Link>

          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
            {t("howItWorks") || "How It Works"}
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                {t("dashboard") || "Dashboard"}
              </Link>

              <Button onClick={handleLogout} className="w-full">
                {t("logout") || "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">{t("login") || "Login"}</Link>

              <Link to="/register">
                <Button className="w-full">
                  {t("getStarted") || "Get Started"}
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
