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
} from "lucide-react";
import { cn } from "@/lib/utils";

/* MENU */

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },

  { icon: ShoppingBag, label: "Marketplace", path: "/dashboard/marketplace" },
  { icon: PlusCircle, label: "Add Waste", path: "/dashboard/add" },
  { icon: History, label: "My Listings", path: "/dashboard/listings" },
  { icon: Globe, label: "Carbon", path: "/dashboard/carbon" },
  { icon: Cpu, label: "Digital Twin", path: "/dashboard/digital-twin" },
  { icon: MessageSquare, label: "Messages", path: "/dashboard/messages" },
];

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside
      className="
      fixed left-0 top-0 h-screen w-64 z-40
      flex flex-col
      bg-white/80 backdrop-blur-lg
      border-r border-slate-200
      shadow-sm
      "
    >
      {/* HEADER */}
      <div className="p-5 flex items-center space-x-2">
        <div className="bg-primary p-2 rounded-xl">
          <Leaf className="text-white w-5 h-5" />
        </div>

        <span className="text-lg font-bold text-slate-900">
          Waste<span className="text-primary">Ex</span>
        </span>
      </div>

      {/* USER */}
      {user && (
        <div className="px-5 pb-3 text-sm">
          <p className="font-semibold text-slate-900">{user?.name}</p>
          <p className="text-slate-500 text-xs">{user.email}</p>
        </div>
      )}

      {/* MENU */}
      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-3 rounded-xl transition-all",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="ml-3 text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-3 border-t border-slate-200 space-y-2">
        <button className="w-full flex items-center px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-100">
          <Settings className="w-5 h-5" />
          <span className="ml-3 text-sm">Settings</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-3 rounded-xl text-red-500 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3 text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};
