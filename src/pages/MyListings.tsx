import { useEffect, useState } from "react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Phone } from "lucide-react";

/* -------------------- CONFIG -------------------- */

const API = import.meta.env.VITE_API || "https://hackher-space-be.onrender.com";

/* -------------------- TYPES -------------------- */

type Request = {
  phone: string;
  name: string;
};

type Listing = {
  _id: string;
  title: string;
  quantity: number;
  status?: "available" | "reserved" | "delivered";
  requests?: Request[];
};

/* -------------------- COMPONENT -------------------- */

export const MyListings = () => {
  const [data, setData] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const stored = localStorage.getItem("user");

        if (!stored) throw new Error("User not logged in");

        const user = JSON.parse(stored);

        const res = await fetch(`${API}/api/listings/user/${user?.id}`);

        if (!res.ok) throw new Error();

        const result = await res.json();
        setData(result || []);
      } catch {
        setError("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  /* ---------------- DELETE ---------------- */

  const deleteListing = async (id: string) => {
    try {
      await fetch(`${API}/api/listings/${id}`, {
        method: "DELETE",
      });

      setData((prev) => prev.filter((i) => i._id !== id));
    } catch {
      console.error("Delete failed");
    }
  };

  /* ---------------- UPDATE ---------------- */

  const updateStatus = async (id: string, status: Listing["status"]) => {
    try {
      await fetch(`${API}/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      setData((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
    } catch {
      console.error("Update failed");
    }
  };

  /* ---------------- STATUS STYLE ---------------- */

  const statusStyle = (status?: string) => {
    switch (status) {
      case "reserved":
        return "bg-amber-100 text-amber-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  /* ---------------- STATES ---------------- */

  if (loading)
    return <p className="text-center text-muted mt-10">Loading listings...</p>;

  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Listings</h1>
        <p className="text-sm text-muted">Manage your materials and requests</p>
      </div>

      {data.length === 0 ? (
        <div className="text-center text-sm text-muted py-10">
          No listings available
        </div>
      ) : (
        <div className="grid gap-5">
          {data.map((item) => (
            <Card key={item._id} className="p-4 md:p-5 border border-border">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-xs text-muted">{item.quantity} kg</p>
                </div>

                <Badge className={statusStyle(item.status)}>
                  {item.status || "available"}
                </Badge>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4 flex-wrap">
                <Button onClick={() => updateStatus(item._id, "reserved")}>
                  Reserve
                </Button>

                <Button onClick={() => updateStatus(item._id, "delivered")}>
                  Deliver
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => deleteListing(item._id)}
                >
                  Delete
                </Button>
              </div>

              {/* REQUESTS */}
              {item.requests && item.requests.length > 0 && (
                <div className="mt-4 bg-slate-50 p-3 rounded-md">
                  <p className="text-xs font-medium mb-2">
                    Requests ({item.requests.length})
                  </p>

                  <div className="space-y-2">
                    {item.requests.map((req, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>
                          {req.name} — {req.phone}
                        </span>

                        <a href={`tel:${req.phone}`}>
                          <Button size="sm" variant="outline">
                            <Phone size={14} />
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
