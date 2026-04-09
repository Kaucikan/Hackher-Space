import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Package, Trash2, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getUser } from "@/lib/utils";

/* -------------------- TYPES -------------------- */

type FormData = {
  material: string;
  category: string;
  quantity: number | "";
  unit: string;
  location: string;
  description: string;
};

/* -------------------- COMPONENT -------------------- */

export const AddWaste = () => {
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
  });

  /* -------------------- HANDLERS -------------------- */

  const handleChange = (key: keyof FormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === "quantity" ? Number(value) || "" : value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImages((prev) => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* -------------------- SUBMIT -------------------- */

 const handleSubmit = async () => {
   if (!form.material || !form.category || !form.quantity || !form.location) {
     setError("Please fill all required fields");
     return;
   }

   setLoading(true);
   setError("");

   try {
     const user = getUser();

     const res = await fetch("https://hackher-space-be.onrender.com/api/listings", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         title: form.material,
         material: form.material,

         category: form.category,

         // IMPORTANT: backend expects number
         quantity: Number(form.quantity),

         // send formatted also
         quantityLabel: `${form.quantity} ${form.unit}`,

         location: form.location,
         description: form.description,
         images: images,

         // IMPORTANT: backend uses userId
         userId: user?.id,
       }),
     });

     const data = await res.json();
     console.log(data);

     if (!res.ok) throw new Error();

     navigate("/dashboard/listings");
   } catch (err) {
     console.error(err);
     setError("Failed to create listing");
   } finally {
     setLoading(false);
   }
 };
  /* -------------------- UI -------------------- */

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Add Waste Listing</h1>
        <p className="text-sm text-muted">
          Create a listing to reuse or exchange materials
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* FORM */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Material Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* MATERIAL */}
              <div>
                <label className="text-sm font-medium">Material</label>
                <input
                  placeholder="e.g. Plastic bottles, Scrap metal"
                  value={form.material}
                  onChange={(e) => handleChange("material", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select material category</option>
                  <option>Metal</option>
                  <option>Plastic</option>
                  <option>Energy</option>
                  <option>Liquid</option>
                  <option>Chemical</option>
                  <option>Wood</option>
                </select>
              </div>

              {/* QUANTITY */}
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={form.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary"
                />

                <select
                  value={form.unit}
                  onChange={(e) => handleChange("unit", e.target.value)}
                  className="w-24 px-3 py-2 border border-border rounded-md"
                >
                  <option>kg</option>
                  <option>tons</option>
                  <option>L</option>
                  <option>kWh</option>
                </select>
              </div>

              {/* LOCATION */}
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted" />
                <input
                  placeholder="Enter location"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* DESCRIPTION */}
              <textarea
                placeholder="Add additional details"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* IMAGES */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-3 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} className="rounded-md object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <label className="border border-dashed border-border rounded-md flex flex-col items-center justify-center p-6 cursor-pointer text-muted">
                <Plus />
                <span className="text-xs mt-1">Upload</span>
                <input type="file" hidden onChange={handleFileUpload} />
              </label>
            </CardContent>
          </Card>
        </div>

        {/* PREVIEW */}
        <div>
          <Card className="p-4 space-y-4">
            <div className="h-40 bg-slate-100 flex items-center justify-center rounded-md overflow-hidden">
              {images[0] ? (
                <img src={images[0]} className="w-full h-full object-cover" />
              ) : (
                <Package className="text-muted" />
              )}
            </div>

            <h3 className="text-sm font-medium">
              {form.material || "Material name"}
            </h3>

            <p className="text-xs text-muted">
              {form.category || "Category"} •{" "}
              {form.quantity ? `${form.quantity} ${form.unit}` : "Quantity"}
            </p>

            <p className="text-xs text-muted">{form.location || "Location"}</p>
          </Card>

          <Button onClick={handleSubmit} className="w-full mt-4">
            {loading ? "Creating..." : "Publish Listing"}
          </Button>
        </div>
      </div>
    </div>
  );
};
