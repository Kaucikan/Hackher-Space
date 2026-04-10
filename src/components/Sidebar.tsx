import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ShoppingBag,
  History,
  MessageSquare,
  Settings,
  LogOut,
  Leaf,
  Cpu,
  Globe,
  Menu,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

/* MENU */

const menuItems = [
  { icon: LayoutDashboard, key: "dashboard", path: "/dashboard" },
  { icon: ShoppingBag, key: "marketplace", path: "/dashboard/marketplace" },
  { icon: PlusCircle, key: "addWaste", path: "/dashboard/add" },
  { icon: History, key: "myListings", path: "/dashboard/listings" },
  { icon: Globe, key: "carbon", path: "/dashboard/carbon" },
  { icon: Cpu, key: "digitalTwin", path: "/dashboard/digital-twin" },
  { icon: MessageSquare, key: "messages", path: "/dashboard/messages" },
];

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const Sidebar = () => {
  const { t, i18n } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
    setLang(lng);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow"
      >
        <Menu size={18} />
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen z-50 flex flex-col",
          "w-[85%] max-w-[280px] md:w-64",
          "bg-white border-r border-slate-200 shadow-sm",
          "transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        {/* HEADER */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-xl">
              <Leaf className="text-white w-5 h-5" />
            </div>

            <span className="text-lg font-bold">
              Waste<span className="text-primary">Ex</span>
            </span>
          </div>

          <button onClick={() => setOpen(false)} className="md:hidden">
            <X size={18} />
          </button>
        </div>

        {/* USER */}
        {user && (
          <div className="px-5 pb-3 text-sm">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-slate-500 text-xs">{user?.email}</p>
          </div>
        )}

        {/* MENU */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center px-3 py-3 rounded-xl transition text-sm md:text-base",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="ml-3">{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-3 border-t space-y-2">
          {/* LANGUAGE SWITCH */}
          <select
            value={lang}
            onChange={(e) => changeLang(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm"
          >
            <option value="en">English</option>
            <option value="ta">தமிழ்</option>
          </select>

          {/* SETTINGS */}
          <button className="w-full flex items-center px-3 py-3 rounded-xl hover:bg-slate-100">
            <Settings className="w-5 h-5" />
            <span className="ml-3 text-sm md:text-base">
              {t("settings")}
            </span>
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 rounded-xl text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3 text-sm md:text-base">
              {t("logout")}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
