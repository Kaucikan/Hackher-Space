import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const API =
  import.meta.env.VITE_API ||
  "https://hackher-space-be.onrender.com";

type TwinData = {
  _id: string;
  material: string;
  quantity: number;
  location: string;
  status: string;
  prediction?: string;
};

export const DigitalTwin = () => {
  const { t } = useTranslation();
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
          {t("digitalTwin")}
        </h1>

        <p className="text-sm md:text-base text-muted">
          {t("simulationDesc")}
        </p>
      </div>

      {/* SIMULATION RESULT */}
      {latestCarbon > 0 && (
        <Card className="border border-primary/20">
          <CardHeader>
            <CardTitle>{t("simulationResult")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <p className="text-sm">
              {t("currentEmission")}{" "}
              <b>{latestCarbon} kg CO₂</b>
            </p>

            <p className="text-sm">
              {t("optimizedEmission")}{" "}
              <b>{improvedCarbon.toFixed(2)} kg CO₂</b>
            </p>

            <p className="text-sm text-primary font-medium">
              {t("reduction")} {reduction}%
            </p>

            <Button
              className="mt-3"
              onClick={() =>
                navigate("/dashboard/marketplace")
              }
            >
              {t("viewMarketplace")}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-muted">
          {t("loadingSimulation")}
        </p>
      )}

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => {
          const prediction =
            item.prediction ||
            (item.quantity > 50
              ? t("reuseSuggestion")
              : t("sustainableSuggestion"));

          return (
            <Card key={item._id} className="p-5 border space-y-2">
              <h2 className="font-semibold">
                {item.material}
              </h2>

              <p className="text-xs text-muted">
                {item.location}
              </p>

              <p className="text-sm">
                {t("quantity")} {item.quantity} kg
              </p>

              <Badge className="w-fit">
                {t(item.status || "available")}
              </Badge>

              <p className="text-xs text-primary pt-2">
                {prediction}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
