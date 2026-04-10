import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import { getUser } from "@/lib/utils";
import {
  TrendingUp,
  Recycle,
  Leaf,
  DollarSign,
  PlusCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";

const API =
  import.meta.env.VITE_API ||
  "https://hackher-space-be.onrender.com";

export const Dashboard = () => {
  const { t } = useTranslation();

  const [user, setUser] = useState<any>(null);
  const [carbon, setCarbon] = useState<number>(0);
  const [impactData, setImpactData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    wasteListed: 0,
    wasteReused: 0,
    earnings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const u = getUser();

    if (!u) {
      setError(t("loginFirst"));
      setLoading(false);
      return;
    }

    setUser(u);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [carbonRes, impactRes, statsRes] = await Promise.all([
          fetch(`${API}/api/carbon`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "individual" }),
          }),
          fetch(`${API}/api/impact/${user.id}`),
          fetch(`${API}/api/stats/${user.id}`),
        ]);

        const carbonData = await carbonRes.json();
        const impact = await impactRes.json();
        const statsData = await statsRes.json();

        setCarbon(Number(carbonData?.total_carbon || 0));
        setImpactData(impact || []);

        setStats({
          wasteListed: statsData?.wasteListed || 0,
          wasteReused: statsData?.wasteReused || 0,
          earnings: statsData?.earnings || 0,
        });
      } catch {
        setError(t("requestFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading)
    return (
      <div className="text-center mt-10 text-muted">
        {t("loading")}
      </div>
    );

  if (error)
    return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            {t("dashboard")}
          </h1>

          <p className="text-sm md:text-base text-muted">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/dashboard/carbon">
            <Button variant="outline">{t("carbon")}</Button>
          </Link>

          <Link to="/dashboard/digital-twin">
            <Button variant="outline">
              {t("digitalTwin")}
            </Button>
          </Link>

          <Link to="/dashboard/add">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              {t("addWaste")}
            </Button>
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title={t("wasteListed")}
          value={`${stats.wasteListed} kg`}
          icon={<Recycle />}
        />

        <StatCard
          title={t("wasteReused")}
          value={`${stats.wasteReused} kg`}
          icon={<TrendingUp />}
        />

        <StatCard
          title={t("carbonSaved")}
          value={`${carbon} kg`}
          icon={<Leaf />}
        />

        <StatCard
          title={t("earnings")}
          value={`₹${stats.earnings}`}
          icon={<DollarSign />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("impactOverview")}</CardTitle>
          </CardHeader>

          <CardContent className="h-[280px] md:h-[320px]">
            <ResponsiveContainer>
              <AreaChart data={impactData}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="co2"
                  stroke="#16a34a"
                  fill="#16a34a"
                  fillOpacity={0.1}
                />

                <Area
                  type="monotone"
                  dataKey="waste"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("digitalTwin")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-sm text-muted">
              {t("simulationDesc")}
            </p>

            <Link to="/dashboard/digital-twin">
              <Button className="w-full">
                {t("runSimulation")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: any) => (
  <Card className="p-4 md:p-5 border border-border hover:shadow-sm transition">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs text-muted">{title}</p>
        <h2 className="text-lg md:text-xl font-semibold mt-1">
          {value}
        </h2>
      </div>

      <div className="text-primary">{icon}</div>
    </div>
  </Card>
);
