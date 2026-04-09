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

/* -------------------- TYPES -------------------- */

type Stats = {
  wasteListed: number;
  wasteReused: number;
  earnings: number;
};

type Impact = {
  name: string;
  co2: number;
  waste: number;
};

/* -------------------- COMPONENT -------------------- */

export const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [carbon, setCarbon] = useState<number>(0);
  const [impactData, setImpactData] = useState<Impact[]>([]);
  const [stats, setStats] = useState<Stats>({
    wasteListed: 0,
    wasteReused: 0,
    earnings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* -------------------- LOAD USER -------------------- */


useEffect(() => {
  const user = getUser();

  if (!user) {
    setError("User not logged in");
    setLoading(false);
    return;
  }

  setUser(user);
}, []);

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [carbonRes, impactRes, statsRes] = await Promise.all([
          fetch("http://localhost:5000/api/carbon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "individual" }),
          }),
          fetch(`http://localhost:5000/api/impact/${user.id}`),
          fetch(`http://localhost:5000/api/stats/${user.id}`),
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
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* -------------------- STATES -------------------- */

  if (loading) {
    return (
      <div className="text-center mt-10 text-muted">Loading dashboard...</div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  /* -------------------- UI -------------------- */

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted">
            Overview of your sustainability metrics
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/dashboard/carbon">
            <Button variant="outline">Carbon</Button>
          </Link>

          <Link to="/dashboard/digital-twin">
            <Button variant="outline">Simulation</Button>
          </Link>

          <Link to="/dashboard/add">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Waste Listed"
          value={`${stats.wasteListed} kg`}
          icon={<Recycle />}
        />

        <StatCard
          title="Waste Reused"
          value={`${stats.wasteReused} kg`}
          icon={<TrendingUp />}
        />

        <StatCard title="Carbon Saved" value={`${carbon} kg`} icon={<Leaf />} />

        <StatCard
          title="Earnings"
          value={`₹${stats.earnings}`}
          icon={<DollarSign />}
        />
      </div>

      {/* GRID SECTION */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* CHART */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Impact Overview</CardTitle>
          </CardHeader>

          <CardContent className="h-[300px]">
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

        {/* DIGITAL TWIN CARD */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-sm text-muted">
              Run predictive analysis to optimize waste reuse and emissions.
            </p>

            <Link to="/dashboard/digital-twin">
              <Button className="w-full">Run Simulation</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/* -------------------- STAT CARD -------------------- */

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <Card className="p-5 border border-border hover:shadow-sm transition">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs text-muted">{title}</p>
        <h2 className="text-xl font-semibold mt-1">{value}</h2>
      </div>

      <div className="text-primary">{icon}</div>
    </div>
  </Card>
);
