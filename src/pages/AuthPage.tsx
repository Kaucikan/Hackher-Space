import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, Lock, User, Leaf, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

const API =
  import.meta.env.VITE_API ||
  "https://hackher-space-be.onrender.com";

export const AuthPage = ({ type }: { type: "login" | "register" }) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.email.includes("@"))
      return t("invalidEmail");

    if (form.password.length < 6)
      return t("passwordLength");

    if (type === "register" && !form.name)
      return t("nameRequired");

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
          ? `${API}/api/auth/login`
          : `${API}/api/auth/register`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          type === "login"
            ? {
                email: form.email,
                password: form.password,
              }
            : form
        ),
      });

      const data = await res.json();

      if (!res.ok) throw new Error();

      const user = data.user || data;

      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch {
      setError(t("authFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md"
      >
        {/* HEADER */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-3 font-semibold"
          >
            <Leaf />
            WasteExchange
          </Link>

          <h2 className="text-xl md:text-2xl font-semibold">
            {type === "login"
              ? t("welcomeBack")
              : t("createAccount")}
          </h2>

          <p className="text-sm text-muted">
            {type === "login"
              ? t("loginContinue")
              : t("registerStart")}
          </p>
        </div>

        <Card className="p-5 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === "register" && (
              <Input
                placeholder={t("organizationName")}
                icon={<User />}
                value={form.name}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
              />
            )}

            <Input
              placeholder={t("email")}
              icon={<Mail />}
              value={form.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t("password")}
                icon={<Lock />}
                value={form.password}
                onChange={(e) =>
                  handleChange("password", e.target.value)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}

            <Button
              className="w-full py-5 text-base"
              disabled={isLoading}
            >
              {isLoading
                ? t("processing")
                : type === "login"
                ? t("signIn")
                : t("createAccount")}
            </Button>

            {type === "login" && (
              <Link
                to="/forgot-password"
                className="text-sm text-primary block text-center"
              >
                {t("forgotPassword")}
              </Link>
            )}

            <div className="text-sm text-center">
              {type === "login" ? (
                <>
                  {t("noAccount")}{" "}
                  <Link
                    to="/register"
                    className="text-primary"
                  >
                    {t("register")}
                  </Link>
                </>
              ) : (
                <>
                  {t("alreadyAccount")}{" "}
                  <Link
                    to="/login"
                    className="text-primary"
                  >
                    {t("signIn")}
                  </Link>
                </>
              )}
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
