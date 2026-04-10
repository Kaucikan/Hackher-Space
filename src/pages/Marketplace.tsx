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

const API =
  import.meta.env.VITE_API ||
  "https://hackher-space-be.onrender.com";

export const Marketplace = () => {
  const { t } = useTranslation();

  const categories = [
    t("all"),
    t("metal"),
    t("energy"),
    t("chemical"),
    t("plastic"),
    t("wood"),
  ];

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(t("all"));
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
        (activeCategory === t("all") ||
          item.category?.toLowerCase() ===
            activeCategory.toLowerCase())
      );
    });
  }, [search, activeCategory, listings, t]);

  const sendRequest = async (id: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user?.id) {
        alert(t("loginFirst"));
        return;
      }

      const res = await fetch(`${API}/api/listings/${id}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          message: t("interestedMaterial"),
        }),
      });

      if (!res.ok) throw new Error();

      alert(t("requestSent"));
    } catch {
      alert(t("requestFailed"));
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">
          {t("marketplace")}
        </h1>

        <p className="text-sm text-muted">
          {t("subtitle")}
        </p>
      </div>

      {/* SEARCH */}
      <Input
        placeholder={t("search")}
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
        <p className="text-sm text-muted text-center">
          {t("loading")}
        </p>
      ) : filteredListings.length === 0 ? (
        <p className="text-sm text-muted text-center">
          {t("noListings")}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((item) => {
            const title = item.title || item.name || t("material");

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
                      <span className="text-gray-400">
                        {t("noListings")}
                      </span>
                    </div>
                  )}

                  <Badge className="absolute top-2 left-2">
                    {item.category}
                  </Badge>

                  <Badge className="absolute top-2 right-2">
                    {item.status || t("available")}
                  </Badge>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-medium">{title}</h3>

                  <p className="text-xs flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {item.location}
                  </p>

                  <p className="text-sm font-medium text-primary">
                    {t("quantity")} {item.quantity} kg
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
                        <Button className="w-full">
                          {t("call")}
                        </Button>
                      </a>
                    )}

                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => sendRequest(item._id)}
                    >
                      {t("request")}
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
