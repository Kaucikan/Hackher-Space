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
    if (!email) return setMsg("Enter email");

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStep(2);
      setMsg("OTP sent to your email");
    } catch (err: any) {
      setMsg(err.message || "Failed to send OTP");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStep(3);
      setMsg("OTP verified");
    } catch (err: any) {
      setMsg(err.message || "Invalid OTP");
    }

    setLoading(false);
  };

  /* RESET PASSWORD */
  const resetPassword = async () => {
    if (!password) return setMsg("Enter new password");

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg("Password updated. Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      setMsg(err.message || "Reset failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold text-center">Forgot Password</h2>

        {step === 1 && (
          <>
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button onClick={sendOtp} className="w-full">
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <Button onClick={verifyOtp} className="w-full">
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={resetPassword} className="w-full">
              {loading ? "Updating..." : "Reset Password"}
            </Button>
          </>
        )}

        {msg && <p className="text-sm text-center text-muted">{msg}</p>}
      </Card>
    </div>
  );
};
