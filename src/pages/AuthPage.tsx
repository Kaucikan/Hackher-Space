import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, Lock, User, Leaf, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export const AuthPage = ({ type }: { type: "login" | "register" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  /* -------------------- HANDLERS -------------------- */

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.email.includes("@")) return "Enter a valid email address";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";
    if (type === "register" && !form.name) return "Name is required";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const url =
        type === "login"
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/auth/register";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          type === "login"
            ? { email: form.email, password: form.password }
            : form,
        ),
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.error || data.message || "Authentication failed");
      }

      /* -------------------- SAFE USER EXTRACTION -------------------- */

      let userId: string | null = null;
      let userName: string = "User";

      if (data?.user) {
        userId = data.user.id || data.user._id;
        userName = data.user.name;
      } else if (data?.data) {
        userId = data.data.id || data.data._id;
        userName = data.data.name;
      } else {
        userId = data.id || data._id;
        userName = data.name;
      }

      if (!userId) {
        console.error("INVALID BACKEND RESPONSE:", data);
        throw new Error("Server did not return user ID");
      }

      /* -------------------- STORE USER -------------------- */

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userId,
          name: userName || "User",
        }),
      );

      /* -------------------- REDIRECT -------------------- */

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };
  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background relative overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* HEADER */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-primary p-2 rounded-lg">
              <Leaf className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-semibold">
              Waste<span className="text-primary">Exchange</span>
            </span>
          </Link>

          <h2 className="text-xl font-semibold">
            {type === "login" ? "Welcome back" : "Create an account"}
          </h2>

          <p className="text-sm text-muted">
            {type === "login"
              ? "Access your dashboard and manage listings"
              : "Register to start managing waste efficiently"}
          </p>
        </div>

        {/* FORM */}
        <Card className="p-6 border border-border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === "register" && (
              <Input
                placeholder="Organization name"
                icon={<User />}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            )}

            <Input
              type="email"
              placeholder="Email address"
              icon={<Mail />}
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            {/* PASSWORD */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                icon={<Lock />}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded-md text-center">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <Button className="w-full h-11">
              {isLoading
                ? "Processing..."
                : type === "login"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>
        </Card>

        {/* FOOTER */}
        <div className="text-center text-sm mt-6 text-muted space-y-1">
          {type === "login" ? (
            <>
              <Link to="/forgot-password" className="text-primary block">
                Forgot Password?
              </Link>

              <p>
                No account?{" "}
                <Link to="/register" className="text-primary font-medium">
                  Register
                </Link>
              </p>
            </>
          ) : (
            <p>
              Already registered?{" "}
              <Link to="/login" className="text-primary font-medium">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
