import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const API = import.meta.env.VITE_API || "https://hackher-space-be.onrender.com";

export const ForgotPassword = () => {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  /* SEND OTP */
  const sendOtp = async () => {
    if (!email) return setMsg("Enter Email Address");

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStep(2);
      setMsg("OTP Sent To Your Email");
    } catch (err: any) {
      setMsg(err.message || "Failed To Send OTP");
    }

    setLoading(false);
  };

  /* VERIFY OTP */
  const verifyOtp = async () => {
    if (!otp) return setMsg("Enter OTP");

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStep(3);
      setMsg("OTP Verified Successfully");
    } catch (err: any) {
      setMsg(err.message || "Invalid OTP");
    }

    setLoading(false);
  };

  /* RESET PASSWORD */
  const resetPassword = async () => {
    if (password.length < 6)
      return setMsg("Password Must Be At Least 6 Characters");

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg("Password Updated. Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      setMsg(err.message || "Reset Failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="p-6 md:p-8 w-full max-w-md space-y-4">
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-semibold">Forgot Password</h2>

          <p className="text-sm text-muted">Reset Your Account Password</p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex justify-center gap-2 pb-2">
          <div
            className={`w-2 h-2 rounded-full ${
              step >= 1 ? "bg-primary" : "bg-muted"
            }`}
          />

          <div
            className={`w-2 h-2 rounded-full ${
              step >= 2 ? "bg-primary" : "bg-muted"
            }`}
          />

          <div
            className={`w-2 h-2 rounded-full ${
              step >= 3 ? "bg-primary" : "bg-muted"
            }`}
          />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <Input
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              onClick={sendOtp}
              className="w-full py-5"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <Input
              placeholder="Enter OTP Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <Button
              onClick={verifyOtp}
              className="w-full py-5"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <Input
              type="password"
              placeholder="Enter New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              onClick={resetPassword}
              className="w-full py-5"
              disabled={loading}
            >
              {loading ? "Updating..." : "Reset Password"}
            </Button>
          </>
        )}

        {msg && <p className="text-sm text-center text-muted">{msg}</p>}
      </Card>
    </div>
  );
};
