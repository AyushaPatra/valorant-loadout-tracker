import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="glass-panel p-10 rounded-2xl text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6 animate-pulse" />

        <h1 className="font-display text-3xl font-black uppercase mb-4">
          Account Created!
        </h1>
        <p className="text-muted-foreground mb-8">
          Your account has been successfully created. You may now log in.
        </p>

        <Button asChild className="w-full">
          <Link to="/login">Go to Login</Link>
        </Button>
      </div>
    </div>
  );
}
