import { Link, useLocation } from "react-router-dom";
import { Target, BarChart3, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";




const navItems = [
  { label: "Loadouts", href: "/", icon: Target },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
  async function fetchUser() {
    try {
      const res = await axios.get("/api/current-user/");
      setUsername(res.data.username);
    } catch (err) {
      setUsername(null);
    }
  }
  fetchUser();
}, []);




  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b-2 border-primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30 group-hover:shadow-glow-red transition-all duration-300">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display text-xl font-bold uppercase tracking-wider text-foreground">
              Loadout <span className="text-primary">Tracker</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "relative px-4 py-2 font-semibold uppercase text-sm tracking-wider transition-all duration-300",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">

          {/* Username Display */}
          {username && (
            <span className="text-sm font-bold uppercase tracking-wide text-primary hidden md:block">
              {username}
            </span>
          )}

          {/* Sign Out Button */}
          <Button
            variant="default"
            size="sm"
            className="hidden md:flex"
            asChild
          >
            <Link to="/login">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in-up">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 font-semibold uppercase text-sm",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <Button variant="default" size="sm" className="w-full mt-4" asChild>
              <Link to="/login">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
