import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type Listing = {
  _id: string;
  title?: string;
  name?: string;
  category?: string;
  quantity: string;
  location: string;
  images: string[];
  phone?: string;
  status?: string;
};

const API_URL =
  import.meta.env.VITE_API || "https://hackher-space-be.onrender.com/api";

const categories = ["All", "Metal", "Energy", "Chemical", "Plastic", "Wood"];

export const Marketplace = () => {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/listings`)
      .then((res) => res.json())
      .then((data) => setListings(data || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

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

  const sendRequest = async (id: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user?.id) {
        alert("Please Login First");
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
          message: "Interested In This Material",
        }),
      });

      if (!res.ok) throw new Error();

      alert("Request Sent Successfully");
    } catch {
      alert("Request Failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">Marketplace</h1>

        <p className="text-sm text-muted">
          Browse And Exchange Reusable Materials
        </p>
      </div>

      {/* SEARCH */}
      <Input
        placeholder="Search Materials Or Location"
        icon={<Search />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CATEGORY */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 text-sm rounded-md border whitespace-nowrap ${
              activeCategory === cat
                ? "bg-primary text-white border-primary"
                : "bg-white border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-sm text-muted text-center">Loading Listings...</p>
      ) : filteredListings.length === 0 ? (
        <p className="text-sm text-muted text-center">No Listings Available</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((item) => {
            const title = item.title || item.name || "Material";

            return (
              <Card key={item._id}>
                <div className="relative h-44 bg-slate-100">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400">No Image Available</span>
                    </div>
                  )}

                  <Badge className="absolute top-2 left-2">
                    {item.category}
                  </Badge>

                  <Badge className="absolute top-2 right-2">
                    {item.status || "Available"}
                  </Badge>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-medium">{title}</h3>

                  <p className="text-xs flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {item.location}
                  </p>

                  <p className="text-sm font-medium text-primary">
                    {item.quantity} kg
                  </p>

                  {item.phone && (
                    <p className="text-sm flex items-center">
                      <Phone size={14} className="mr-1" />
                      {item.phone}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    {item.phone && (
                      <a href={`tel:${item.phone}`} className="flex-1">
                        <Button className="w-full">Call</Button>
                      </a>
                    )}

                    <Button
                      variant="outline"
                      className="flex-1"
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
