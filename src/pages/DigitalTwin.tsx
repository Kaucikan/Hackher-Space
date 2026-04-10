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

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/digital-twin`);

        if (!res.ok) {
          setData([]);
          return;
        }

        const result = await res.json();
        setData(Array.isArray(result) ? result : []);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const latestCarbon =
    data.filter((d) => d.material === "Carbon Emission").slice(-1)[0]
      ?.quantity || 0;

  const improvedCarbon = latestCarbon * 0.6;

  const reduction =
    latestCarbon > 0
      ? ((1 - improvedCarbon / latestCarbon) * 100).toFixed(0)
      : 0;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Digital Twin Simulation
        </h1>

        <p className="text-sm md:text-base text-muted">
          Analyze And Optimize Environmental Impact
        </p>
      </div>

      {/* SIMULATION RESULT */}
      {latestCarbon > 0 && (
        <Card className="border border-primary/20">
          <CardHeader>
            <CardTitle>Simulation Result</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <p className="text-sm">
              Current Emission <b>{latestCarbon} kg CO₂</b>
            </p>

            <p className="text-sm">
              Optimized Emission <b>{improvedCarbon.toFixed(2)} kg CO₂</b>
            </p>

            <p className="text-sm text-primary font-medium">
              Reduction {reduction}%
            </p>

            <Button
              className="mt-3"
              onClick={() => navigate("/dashboard/marketplace")}
            >
              View Marketplace
            </Button>
          </CardContent>
        </Card>
      )}

      {/* LOADING */}
      {loading && <p className="text-sm text-muted">Loading Simulation...</p>}

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => {
          const prediction =
            item.prediction ||
            (item.quantity > 50
              ? "Recommended For Reuse"
              : "Suitable For Sustainable Use");

          return (
            <Card key={item._id} className="p-5 border space-y-2">
              <h2 className="font-semibold">{item.material}</h2>

              <p className="text-xs text-muted">{item.location}</p>

              <p className="text-sm">Quantity {item.quantity} kg</p>

              <Badge className="w-fit">{item.status || "Available"}</Badge>

              <p className="text-xs text-primary pt-2">{prediction}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
