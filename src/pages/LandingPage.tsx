import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Recycle, Globe, Cpu } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const LandingPage = () => {
  return (
    <div className="h-screen overflow-hidden relative text-white">
      {/* VIDEO BACKGROUND FIXED */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-20"
      >
        <source src="https://res.cloudinary.com/dblg4ofdt/video/upload/v1775736182/back_xqwzyp.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY */}
      <div className="fixed inset-0 bg-black/60 -z-10" />

      {/* CONTENT */}
      <section className="h-full flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Intelligent Waste Exchange Platform
          </h1>

          <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
            Track emissions, simulate environmental impact, and convert waste
            into reusable resources.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Link to="/register">
              <Button className="px-8 py-6 text-base rounded-xl">
                Create Account
                <ArrowRight className="ml-2 w-4" />
              </Button>
            </Link>

            <Link to="/dashboard/marketplace">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-6 rounded-xl"
              >
                Explore Marketplace
              </Button>
            </Link>
          </div>

          {/* FEATURES */}
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Globe />}
              title="Carbon Tracking"
              desc="Measure emissions in real time"
            />

            <FeatureCard
              icon={<Cpu />}
              title="Simulation Engine"
              desc="Optimize using digital twin models"
            />

            <FeatureCard
              icon={<Recycle />}
              title="Waste Exchange"
              desc="Convert waste into resources"
            />
          </div>
        </motion.div>
      </section>
    </div>
  );
};

/* ---------- FEATURE CARD ---------- */

const FeatureCard = ({ icon, title, desc }: any) => (
  <Card
    className="
  p-6 text-center
  bg-white/[0.05]
  backdrop-blur-md
  border border-white/15
  rounded-2xl
  text-white
  "
  >
    <div className="mb-4 flex justify-center text-green-400">{icon}</div>

    <h3 className="font-semibold">{title}</h3>

    <p className="text-sm text-gray-300 mt-2">{desc}</p>
  </Card>
);
