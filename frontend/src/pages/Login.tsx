import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

import axios from "@/api/axios";

import valorantHero from "@/assets/valorant-hero.gif";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // 1. Get CSRF cookie
    await axios.get("/api/csrf/");

    // 2. Send login request
    await axios.post("/api/login/", {
      username: formData.username,
      password: formData.password,
    });

    toast({
      title: "Logged in!",
      description: "Welcome back.",
    });

    navigate("/");
  } catch (error) {
    toast({
      title: "Login failed",
      description: "Invalid username or password.",
      variant: "destructive",
    });
  }
};

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background gradient */}
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

          {/* Sign In Header */}
          <h2 className="font-display text-4xl font-black uppercase mb-2">
            Sign In
          </h2>
          <p className="text-muted-foreground mb-8">
            Access your loadout configurations
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-muted-foreground uppercase text-xs font-bold tracking-wider">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="h-12 bg-input border-border text-foreground font-bold tracking-wide focus:border-primary focus:ring-2 focus:ring-primary/30 input-glow"
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground uppercase text-xs font-bold tracking-wider">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 bg-input border-border text-foreground font-bold tracking-wide pr-12 focus:border-primary focus:ring-2 focus:ring-primary/30 input-glow"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="xl" className="w-full mt-8">
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-muted-foreground text-sm mt-8">
            Don't have an account?{" "}
            <a href="/register" className="text-primary hover:underline font-semibold">
              Create one
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - Animated Valorant GIF */}
      <div className="hidden lg:block lg:w-3/5 relative bg-background overflow-hidden">
  
      {/* Gradient fade overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-20" />

      {/* Full-height GIF */}
      <img
        src={valorantHero}
        alt="Valorant animation"
        className="
          absolute inset-0 w-full h-full object-cover
          opacity-90
          animate-fade-in
          drop-shadow-[0_0_40px_rgba(255,60,60,0.6)]
        "
      />

      {/* Floating background glows */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl opacity-50 animate-float z-30" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent/30 rounded-full blur-3xl opacity-40 animate-float delay-150 z-30" />

    </div>

    </div>
  );
}
