import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/layout/GlassCard";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <GlassCard className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-primary" />
        </div>

        <h1 className="font-display text-6xl font-black text-primary mb-4">404</h1>
        <h2 className="font-display text-2xl font-bold uppercase mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Button variant="default" size="lg" asChild>
          <Link to="/">
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </Button>
      </GlassCard>
    </div>
  );
};

export default NotFound;
