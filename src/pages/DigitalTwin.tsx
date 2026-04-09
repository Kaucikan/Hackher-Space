import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const API = import.meta.env.VITE_API || "https://hackher-space-be.onrender.com";

type TwinData = {
  _id: string;
  material: string;
  quantity: number;
  location: string;
  status: string;
  prediction?: string;
};

export const DigitalTwin = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<TwinData[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------------------- FETCH -------------------- */

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/digital-twin`);

        if (!res.ok) {
          console.error("Twin API failed:", res.status);
          setData([]);
          return;
        }

        const result = await res.json();
        setData(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Twin fetch error:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* -------------------- SIMULATION -------------------- */

  const latestCarbon =
    data.filter((d) => d.material === "Carbon Emission").slice(-1)[0]
      ?.quantity || 0;

  const improvedCarbon = latestCarbon * 0.6;

  const reduction =
    latestCarbon > 0
      ? ((1 - improvedCarbon / latestCarbon) * 100).toFixed(0)
      : 0;

  /* -------------------- UI -------------------- */

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Digital Twin Simulation</h1>

        <p className="text-sm text-muted">
          Analyze and optimize environmental impact
        </p>
      </div>

      {/* SIMULATION */}
      {latestCarbon > 0 && (
        <Card className="border border-primary/20">
          <CardHeader>
            <CardTitle>Simulation Result</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <p className="text-sm">
              Current Emission: <b>{latestCarbon} kg CO₂</b>
            </p>

            <p className="text-sm">
              Optimized Emission: <b>{improvedCarbon.toFixed(2)} kg CO₂</b>
            </p>

            <p className="text-sm text-primary">Reduction: {reduction}%</p>

            <Button
              className="mt-3"
              onClick={() => navigate("/dashboard/marketplace")}
            >
              View Marketplace
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && <p className="text-sm text-muted">Loading simulation...</p>}

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => {
          const prediction =
            item.prediction ||
            (item.quantity > 50
              ? "Recommended for reuse or marketplace listing"
              : "Suitable for sustainable usage");

          return (
            <Card key={item._id} className="p-5 border border-border">
              <h2 className="font-medium">{item.material}</h2>

              <p className="text-xs text-muted">{item.location}</p>

              <p className="mt-2 text-sm">Quantity: {item.quantity} kg</p>

              <Badge className="mt-2">{item.status}</Badge>

              <p className="mt-3 text-xs text-primary">{prediction}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
