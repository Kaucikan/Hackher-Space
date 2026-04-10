import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Recycle, Globe, Cpu } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const LandingPage = () => {
  return (
    <div className="min-h-screen relative text-white overflow-x-hidden">
      {/* VIDEO BACKGROUND */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-20"
      >
        <source
          src="https://res.cloudinary.com/dblg4ofdt/video/upload/v1775736182/back_xqwzyp.mp4"
          type="video/mp4"
        />
      </video>

      {/* OVERLAY */}
      <div className="fixed inset-0 bg-black/60 -z-10" />

      {/* CONTENT */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl text-center"
        >
          {/* TITLE */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Intelligent Waste Exchange Platform
          </h1>

          {/* SUBTEXT */}
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            Track Emissions, Simulate Environmental Impact, And Convert Waste
            Into Reusable Resources.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link to="/register">
              <Button className="w-full sm:w-auto px-6 py-5 sm:px-8 sm:py-6 text-sm sm:text-base rounded-xl">
                Create Account
                <ArrowRight className="ml-2 w-4" />
              </Button>
            </Link>

            <Link to="/dashboard/marketplace">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-black px-6 py-5 sm:px-8 sm:py-6 rounded-xl"
              >
                Explore Marketplace
              </Button>
            </Link>
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <FeatureCard
              icon={<Globe />}
              title="Carbon Tracking"
              desc="Measure Emissions In Real Time"
            />

            <FeatureCard
              icon={<Cpu />}
              title="Simulation Engine"
              desc="Optimize Using Digital Twin Models"
            />

            <FeatureCard
              icon={<Recycle />}
              title="Waste Exchange"
              desc="Convert Waste Into Resources"
            />
          </div>
        </motion.div>
      </section>
    </div>
  );
};

/* FEATURE CARD */

const FeatureCard = ({ icon, title, desc }: any) => (
  <Card
    className="
    p-5 sm:p-6
    text-center
    bg-white/[0.05]
    backdrop-blur-md
    border border-white/15
    rounded-2xl
    text-white
    hover:scale-[1.02]
    transition
    "
  >
    <div className="mb-3 sm:mb-4 flex justify-center text-green-400">
      {icon}
    </div>

    <h3 className="font-semibold text-sm sm:text-base">{title}</h3>

    <p className="text-xs sm:text-sm text-gray-300 mt-2">{desc}</p>
  </Card>
);
