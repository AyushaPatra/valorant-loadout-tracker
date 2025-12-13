import { Link } from "react-router-dom";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/layout/GlassCard";
import { Button } from "@/components/ui/button";

export default function TransactionFail() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-16 max-w-lg">
        <GlassCard className="text-center border-primary/30">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center relative">
            <XCircle className="w-14 h-14 text-primary animate-scale-in" />
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          </div>

          <h1 className="font-display text-3xl font-black uppercase text-primary mb-4 animate-fade-in-up">
            Transaction Rolled Back
          </h1>

          <div className="bg-secondary/50 rounded-lg p-4 mb-6 animate-fade-in-up delay-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground uppercase">Error Details</span>
            </div>
            <p className="text-foreground">
              Simulated database constraint violation
            </p>
          </div>

          <p className="text-muted-foreground mb-8 animate-fade-in-up delay-200">
            No changes were saved because the transaction failed. All modifications have been rolled back to maintain data integrity.
          </p>

          <Button variant="default" size="lg" asChild className="animate-fade-in-up delay-300">
            <Link to="/loadouts">
              <ArrowLeft className="w-4 h-4" />
              Back to Loadouts
            </Link>
          </Button>
        </GlassCard>
      </main>
    </div>
  );
}
