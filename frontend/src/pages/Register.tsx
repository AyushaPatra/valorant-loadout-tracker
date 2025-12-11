import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Target, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import api from "@/api/axios";

import valorantHero from "@/assets/registeration-pic2.gif";


export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
    acceptTerms: false,
  });

  const passwordRules = [
  {
    label: "At least 8 characters",
    test: (pw: string) => pw.length >= 8,
  },
  {
    label: "Contains uppercase letter (A-Z)",
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    label: "Contains lowercase letter (a-z)",
    test: (pw: string) => /[a-z]/.test(pw),
  },
  {
    label: "Contains a number (0-9)",
    test: (pw: string) => /[0-9]/.test(pw),
  },
  {
    label: "Contains a special character (!@#$%^&*)",
    test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
  },
];


  // Password strength evaluation
  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { label: "Weak", color: "text-red-500" };
    if (score === 2) return { label: "Medium", color: "text-yellow-400" };
    return { label: "Strong", color: "text-green-400" };
  };

  const strength = getStrength(form.password);

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!form.acceptTerms) {
      toast({ title: "Please accept the terms", variant: "destructive" });
      return;
    }

    const allRulesPass = passwordRules.every((rule) =>
    rule.test(form.password)
    );

    if (!allRulesPass) {
    toast({
        title: "Weak password",
        description: "Please meet all password requirements.",
        variant: "destructive",
    });
    return;
    }


    if (form.password !== form.confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    try {
      await api.get("/api/csrf/");
      
      await api.post("/api/register/", {
        username: form.username,
        password: form.password,
      });

      navigate("/register/success");
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err.response?.data?.error || "Try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL - Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 shadow-glow-red">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black uppercase tracking-wide">
                Loadout Tracker
              </h1>
              <p className="text-primary font-semibold text-sm">VALORANT EDITION</p>
            </div>
          </div>

          {/* Register Header */}
          <h2 className="font-display text-4xl font-black uppercase mb-2">
            Create Account
          </h2>
          <p className="text-muted-foreground mb-8">
            Start tracking your Valorant loadouts
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div className="space-y-2">
              <Label className="uppercase text-xs font-bold tracking-wider">Username</Label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="h-12 bg-input border-border text-foreground font-bold tracking-wide input-glow"
                placeholder="Enter username"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="uppercase text-xs font-bold tracking-wider">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="h-12 bg-input border-border text-foreground font-bold tracking-wide pr-12 input-glow"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Password strength */}
              {form.password !== "" && (
                <p className={`text-xs font-bold ${strength.color}`}>
                    Password Strength: {strength.label}
                </p>
                )}

                {/* Password Rules */}
                <div className="mt-3 space-y-1">
                {passwordRules.map((rule, index) => {
                    const valid = rule.test(form.password);
                    return (
                    <p
                        key={index}
                        className={`text-xs flex items-center gap-2 ${
                        valid ? "text-green-400" : "text-muted-foreground"
                        }`}
                    >
                        {valid ? "✓" : "✗"} {rule.label}
                    </p>
                    );  
                })}
                </div>
            </div>
  
              {/* Confirm Password */}
              <div className="space-y-2">
              <Label className="uppercase text-xs font-bold tracking-wider">Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="h-12 bg-input border-border text-foreground font-bold tracking-wide pr-12 input-glow"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-3 mt-2">
              <Checkbox
                checked={form.acceptTerms}
                onCheckedChange={(c: any) => setForm({ ...form, acceptTerms: Boolean(c) })}
                id="terms"
              />
              <Label htmlFor="terms" className="text-muted-foreground">
                I accept the Terms & Conditions
              </Label>
            </div>

            <Button type="submit" size="xl" className="w-full mt-6">
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-muted-foreground text-sm mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - Fullscreen Valorant GIF */}
<div className="hidden lg:block lg:w-3/5 relative bg-background overflow-hidden">

  {/* Animated GIF fills entire panel */}
  <img
    src={valorantHero}
    alt="Valorant animation"
    className="
      absolute inset-0 w-full h-full object-cover
      opacity-90 animate-fade-in
      drop-shadow-[0_0_40px_rgba(255,60,60,0.6)]
    "
  />

  {/* Gradient overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-20" />

  {/* Floating glows */}
  <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl opacity-50 animate-float z-30" />
  <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent/30 rounded-full blur-3xl opacity-40 animate-float delay-150 z-30" />

</div>

    </div>
  );
}
