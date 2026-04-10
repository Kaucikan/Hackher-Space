import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Package, Trash2, Plus, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getUser } from "@/lib/utils";

const API = import.meta.env.VITE_API || "https://hackher-space-be.onrender.com";

type FormData = {
  material: string;
  category: string;
  quantity: number | "";
  unit: string;
  location: string;
  description: string;
  phone: string;
};

export const AddWaste = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>({
    material: "",
    category: "",
    quantity: "",
    unit: "kg",
    location: "",
    description: "",
    phone: "",
  });

  const handleChange = (key: keyof FormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === "quantity" ? Number(value) || "" : value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (
      !form.material ||
      !form.category ||
      !form.quantity ||
      !form.location ||
      !form.phone
    ) {
      setError("Please Fill Required Fields");
      return;
    }

    if (form.phone.length < 8) {
      setError("Enter Valid Phone Number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = getUser();

      const res = await fetch(`${API}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.material,
          material: form.material,
          category: form.category,
          quantity: Number(form.quantity),
          quantityLabel: `${form.quantity} ${form.unit}`,
          location: form.location,
          description: form.description,
          images,
          phone: form.phone,
          userId: user?.id,
        }),
      });

      if (!res.ok) throw new Error();

      navigate("/dashboard/listings");
    } catch {
      setError("Failed To Create Listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Add Waste Listing
        </h1>

        <p className="text-sm md:text-base text-muted">
          Create Listing For Reusable Materials
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border p-3 rounded">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Material Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <input
                placeholder="Material Name (Eg: Steel Scrap)"
                value={form.material}
                onChange={(e) => handleChange("material", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />

              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Category</option>
                <option>Metal</option>
                <option>Plastic</option>
                <option>Energy</option>
                <option>Chemical</option>
                <option>Wood</option>
              </select>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md"
                />

                <select
                  value={form.unit}
                  onChange={(e) => handleChange("unit", e.target.value)}
                  className="w-24 px-3 py-2 border rounded-md"
                >
                  <option>kg</option>
                  <option>tons</option>
                  <option>L</option>
                  <option>kWh</option>
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4" />
                <input
                  placeholder="Pickup Location"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full pl-10 px-3 py-2 border rounded-md"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4" />
                <input
                  placeholder="Contact Phone Number"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full pl-10 px-3 py-2 border rounded-md"
                />
              </div>

              <textarea
                placeholder="Describe Material Condition, Quality..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-3 py-2 border rounded-md min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* IMAGES */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    className="rounded-md w-full h-24 object-cover"
                  />

                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <label className="border border-dashed rounded-md flex flex-col items-center justify-center p-6 cursor-pointer">
                <Plus />
                <span className="text-xs">Upload</span>
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleFileUpload}
                />
              </label>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PREVIEW */}
        <div>
          <Card className="p-4 space-y-3">
            <div className="h-40 bg-slate-100 flex items-center justify-center">
              {images[0] ? (
                <img src={images[0]} className="w-full h-full object-cover" />
              ) : (
                <Package />
              )}
            </div>

            <h3 className="font-semibold">{form.material || "Material"}</h3>

            <p className="text-xs">
              {form.category || "Category"} •{" "}
              {form.quantity ? `${form.quantity} ${form.unit}` : "Quantity"}
            </p>

            <p className="text-xs">{form.location || "Location"}</p>

            <p className="text-xs">{form.phone || "Phone"}</p>
          </Card>

          <Button
            onClick={handleSubmit}
            className="w-full mt-4 py-5 text-base"
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish Listing"}
          </Button>
        </div>
      </div>
    </div>
  );
};
