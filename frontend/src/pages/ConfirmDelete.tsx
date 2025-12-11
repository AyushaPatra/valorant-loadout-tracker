import { useParams, useNavigate, Link } from "react-router-dom";
import { AlertTriangle, Trash2, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/layout/GlassCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { deleteLoadout } from "@/api/loadouts";

export default function ConfirmDelete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
  try {
    await deleteLoadout(Number(id));     // REAL delete request

    toast({
      title: "Loadout Deleted",
      description: "The loadout has been permanently removed.",
      variant: "destructive",
    });

    navigate("/");                       // Go back to homepage
  } catch (err) {
    toast({
      title: "Error",
      description: "Failed to delete loadout.",
      variant: "destructive",
    });
  }
};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <PageHeader
          title="Delete Loadout"
          subtitle="This action cannot be undone"
        />

        <GlassCard className="text-center border-primary/30">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow">
            <AlertTriangle className="w-10 h-10 text-primary" />
          </div>

          <h2 className="font-display text-2xl font-bold uppercase text-primary mb-4">
            Confirm Deletion
          </h2>

          <p className="text-muted-foreground mb-8">
            Once deleted, this loadout will be{" "}
            <span className="text-primary font-semibold">permanently removed</span>{" "}
            from your account. This action cannot be undone.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={handleDelete}
              className="order-2 sm:order-1"
            >
              <Trash2 className="w-4 h-4" />
              Delete Loadout
            </Button>
            <Button
              variant="secondary"
              size="lg"
              asChild
              className="order-1 sm:order-2"
            >
              <Link to="/">
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </Link>
            </Button>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
