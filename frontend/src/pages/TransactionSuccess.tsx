import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/layout/GlassCard";
import { Button } from "@/components/ui/button";

export default function TransactionSuccess() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-16 max-w-lg">
        <GlassCard className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center relative">
            <CheckCircle2 className="w-14 h-14 text-success animate-scale-in" />
            <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
          </div>

          <h1 className="font-display text-3xl font-black uppercase text-success mb-4 animate-fade-in-up">
            Edit Successful
          </h1>

          <p className="text-muted-foreground mb-2 animate-fade-in-up delay-100">
            Your loadout was updated.
          </p>
          

          <Button variant="default" size="lg" asChild className="animate-fade-in-up delay-300">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Back to Loadouts
            </Link>
          </Button>
        </GlassCard>
      </main>
    </div>
  );
}
