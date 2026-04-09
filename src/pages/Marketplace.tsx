import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, MessageCircle, Info, Phone } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

/* -------------------- TYPES -------------------- */
type Listing = {
  _id: string;
  title?: string;
  name?: string;
  category: string;
  quantity: string;
  location: string;
  images: string[];
  phone?: string;
  status?: string;
};

const API_URL = "http://localhost:5000/api";
const categories = ["All", "Metal", "Energy", "Chemical", "Plastic", "Wood"];

/* -------------------- COMPONENT -------------------- */
export const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------------------- FETCH -------------------- */
  useEffect(() => {
    fetch(`${API_URL}/listings`)
      .then((res) => res.json())
      .then((data) => setListings(data || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  /* -------------------- FILTER -------------------- */
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const text = search.toLowerCase();

      const title = item.title || item.name || "";

      return (
        (title.toLowerCase().includes(text) ||
          item.location?.toLowerCase().includes(text)) &&
        (activeCategory === "All" ||
          item.category?.toLowerCase() === activeCategory.toLowerCase())
      );
    });
  }, [search, activeCategory, listings]);

  /* -------------------- REQUEST -------------------- */
  const sendRequest = async (id: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user?.id) {
        alert("Please login first");
        return;
      }

      const res = await fetch(`${API_URL}/listings/${id}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          name: user.name,
          phone: user.phone,
          message: "Interested in this material",
        }),
      });

      if (!res.ok) throw new Error();

      alert("Request sent successfully");
    } catch (err) {
      console.error(err);
      alert("Request failed");
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Marketplace</h1>
        <p className="text-sm text-muted">
          Browse and exchange reusable materials
        </p>
      </div>

      {/* SEARCH */}
      <Input
        placeholder="Search materials or location"
        icon={<Search />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CATEGORY */}
      <div className="flex gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 text-sm rounded-md border ${
              activeCategory === cat
                ? "bg-primary text-white border-primary"
                : "bg-white border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* STATES */}
      {loading ? (
        <p className="text-sm text-muted text-center">Loading listings...</p>
      ) : filteredListings.length === 0 ? (
        <p className="text-sm text-muted text-center">No listings available</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => {
            const title = item.title || item.name || "Material";

            return (
              <Card
                key={item._id}
                className="overflow-hidden border border-border hover:shadow-md transition"
              >
                {/* IMAGE */}
                <div className="relative h-44 bg-slate-100">
                  <img
                    src={item.images?.[0] || "https://picsum.photos/400"}
                    className="w-full h-full object-cover"
                  />

                  <Badge className="absolute top-2 left-2">
                    {item.category}
                  </Badge>

                  <Badge className="absolute top-2 right-2 bg-secondary/10 text-secondary">
                    {item.status || "available"}
                  </Badge>
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{title}</h3>
                    <Info size={16} className="text-muted" />
                  </div>

                  <p className="text-xs text-muted flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {item.location}
                  </p>

                  <p className="text-sm font-medium text-primary">
                    {(item as any).quantityLabel || `${item.quantity} kg`}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-2 pt-2">
                    <a href={`tel:${item.phone || ""}`} className="flex-1">
                      <Button className="w-full">
                        <Phone size={14} className="mr-1" />
                        Call
                      </Button>
                    </a>

                    <Button
                      variant="outline"
                      onClick={() => sendRequest(item._id)}
                    >
                      Request
                    </Button>

                    <Button variant="outline" size="icon">
                      <MessageCircle size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
