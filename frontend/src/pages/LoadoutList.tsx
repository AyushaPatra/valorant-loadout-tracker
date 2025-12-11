import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Target } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadoutTable, Loadout } from "@/components/loadout/LoadoutTable";
import { Button } from "@/components/ui/button";

import { getLoadouts } from "@/api/loadouts";
import { getAgents } from "@/api/agents";
import { getWeapons } from "@/api/weapons";
import { getMaps } from "@/api/maps";
import { getSkins } from "@/api/skins";

export default function LoadoutList() {
  const [loadouts, setLoadouts] = useState<Loadout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [loadoutRes, agentRes, weaponRes, skinRes, mapRes] = await Promise.all([
          getLoadouts(),
          getAgents(),
          getWeapons(),
          getSkins(),
          getMaps(),
        ]);

        const agents = Object.fromEntries(agentRes.data.map((a: any) => [a.id, a]));
        const weapons = Object.fromEntries(weaponRes.data.map((w: any) => [w.id, w]));
        const skins = Object.fromEntries(skinRes.data.map((s: any) => [s.id, s]));
        const maps = Object.fromEntries(mapRes.data.map((m: any) => [m.id, m]));

        const formatted: Loadout[] = loadoutRes.data.map((l: any) => ({
          id: l.id,
          agent: agents[l.agent]?.name ?? "Unknown",
          role: agents[l.agent]?.role ?? "",
          primary: weapons[l.primary_weapon]?.name ?? "",
          sidearm: weapons[l.secondary_weapon]?.name ?? "",
          skin: skins[l.skin]?.name ?? "None",
          map: maps[l.map]?.name ?? "",
        }));

        console.log("Formatted loadouts:", formatted);
        setLoadouts(formatted);
      } catch (error) {
        console.error("Failed to fetch loadouts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <PageHeader
          title="Your Loadouts"
          subtitle="Manage your Valorant agent configurations and weapon setups"
          action={
            <Button variant="default" size="lg" asChild>
              <Link to="/loadout/new">
                <Plus className="w-5 h-5" />
                Add Loadout
              </Link>
            </Button>
          }
        />

        {loading ? (
          <div className="glass-panel p-12 text-center text-xl">Loading…</div>
        ) : loadouts.length > 0 ? (
          <LoadoutTable loadouts={loadouts} />
        ) : (
          <div className="glass-panel p-12 text-center">
            <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold uppercase mb-2">No Loadouts Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first loadout to get started
            </p>
            <Button variant="default" asChild>
              <Link to="/loadout/new">
                <Plus className="w-5 h-5" />
                Create Loadout
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
