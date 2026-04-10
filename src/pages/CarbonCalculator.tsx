import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Zap, Truck, Factory } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type CarbonResult = {
  total_carbon: string;
  suggestion: string;
};

export default function CarbonCalculator() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [type, setType] = useState<"individual" | "industry">("individual");

  const [form, setForm] = useState({
    transport: 0,
    electricity: 0,
    waste: 0,
    industryEnergy: 0,
  });

  const [result, setResult] = useState<CarbonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: Number(e.target.value),
    });
  };

  const calculate = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://hackher-space-be.onrender.com/api/carbon",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            type,
          }),
        },
      );

      const data = await res.json();
      setResult(data);

      await fetch("https://hackher-space-be.onrender.com/api/digital-twin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          material: "Carbon Emission",
          quantity: Number(data.total_carbon),
          location: type,
          status: data.suggestion,
        }),
      });
    } catch {
      setError("Carbon Calculation Failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm({
      transport: 0,
      electricity: 0,
      waste: 0,
      industryEnergy: 0,
    });
    setResult(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Carbon Calculator
        </h1>

        <p className="text-sm md:text-base text-muted">
          Estimate Your Carbon Emissions From Daily Activities
        </p>
      </div>

      {/* TYPE SELECT */}
      <div className="grid grid-cols-2 gap-3">
        <TypeButton
          active={type === "individual"}
          onClick={() => setType("individual")}
          label="Individual"
        />

        <TypeButton
          active={type === "industry"}
          onClick={() => setType("industry")}
          label="Industry"
        />
      </div>

      {/* FORM */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Usage Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {type === "individual" ? (
            <>
              <InputField
                icon={<Truck />}
                name="transport"
                placeholder="Travel Distance (km)"
                onChange={handleChange}
              />

              <InputField
                icon={<Zap />}
                name="electricity"
                placeholder="Electricity Usage (kWh)"
                onChange={handleChange}
              />

              <InputField
                icon={<Leaf />}
                name="waste"
                placeholder="Waste Generated (kg)"
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <InputField
                icon={<Factory />}
                name="industryEnergy"
                placeholder="Industry Energy Usage (kWh)"
                onChange={handleChange}
              />

              <InputField
                icon={<Leaf />}
                name="waste"
                placeholder="Industrial Waste (kg)"
                onChange={handleChange}
              />
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button onClick={calculate} className="flex-1 py-5 text-base">
              {loading ? "Calculating..." : "Calculate Carbon"}
            </Button>

            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* RESULT */}
      {result && (
        <Card className="border border-primary/20 bg-primary/5">
          <CardContent className="text-center space-y-2 py-6">
            <h2 className="text-2xl font-semibold">
              {result.total_carbon} kg CO₂
            </h2>

            <p className="text-sm text-muted">{result.suggestion}</p>

            <Button
              className="mt-3"
              onClick={() => navigate("/dashboard/digital-twin")}
            >
              View Digital Twin
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* TYPE BUTTON */

const TypeButton = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`py-3 rounded-md text-sm font-medium border transition ${
      active
        ? "bg-primary text-white border-primary"
        : "bg-white border-border hover:bg-muted"
    }`}
  >
    {label}
  </button>
);

/* INPUT FIELD */

const InputField = ({ icon, name, placeholder, onChange }: any) => (
  <div className="relative">
    <div className="absolute left-3 top-2.5 text-muted">{icon}</div>

    <input
      type="number"
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full pl-10 px-3 py-2 border border-border rounded-md bg-background"
    />
  </div>
);
