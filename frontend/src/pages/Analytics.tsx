import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/layout/GlassCard";

import { PieChart, BarChart3, Users, Map as MapIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RoleBadge } from "@/components/loadout/RoleBadge";

import apiClient from "@/api/apiClient";

import Jett from "@/assets/agents/Jett.png";

import Pearl from "@/assets/maps/Pearl.jpg";

import LoadoutsBG from "@/assets/loadout-bg.png";


const agentImages: Record<string, string> = {
  Jett,
  // Sova,
  // Omen,
};

const mapImages: Record<string, string> = {
  Pearl,
  // Breeze,
  // Icebox,
};



// ----------------------------
// Types
// ----------------------------
interface Loadout {
  id: number;
  agent: number;
  primary_weapon: number;
  secondary_weapon: number;
  skin: number | null;
  map: number;
}

interface Agent {
  id: number;
  name: string;
  role: "Duelist" | "Initiator" | "Controller" | "Sentinel";
}

interface Weapon {
  id: number;
  name: string;
  type: string;
}

interface Map {
  id: number;
  name: string;
}

// ----------------------------
// Component
// ----------------------------
export default function Analytics() {
  const [loadouts, setLoadouts] = useState<Loadout[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [maps, setMaps] = useState<Map[]>([]);

  const [loading, setLoading] = useState(true);

  // ==========================
  // Fetch all data
  // ==========================
  useEffect(() => {
    async function fetchData() {
      try {
        const [loadoutRes, agentRes, weaponRes, mapRes] = await Promise.all([
          apiClient.get("/loadouts/"),
          apiClient.get("/agents/"),
          apiClient.get("/weapons/"),
          apiClient.get("/maps/")
        ]);

        setLoadouts(loadoutRes.data);
        setAgents(agentRes.data);
        setWeapons(weaponRes.data);
        setMaps(mapRes.data);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ==========================
  // Derived Analytics Data
  // ==========================
  const analytics = useMemo(() => {
    if (loading) return null;

    const mapCounts: Record<string, number> = {};
    const agentCounts: Record<string, { count: number; role: string }> = {};
    const weaponCounts: Record<string, number> = {};

    loadouts.forEach((ld) => {
      // --- Maps
      const map = maps.find((m) => m.id === ld.map);
      if (map) {
        mapCounts[map.name] = (mapCounts[map.name] || 0) + 1;
      }

      // --- Agents
      const agent = agents.find((a) => a.id === ld.agent);
      if (agent) {
        agentCounts[agent.name] = {
          count: (agentCounts[agent.name]?.count || 0) + 1,
          role: agent.role
        };
      }

      // --- Weapons
      const primary = weapons.find((w) => w.id === ld.primary_weapon);
      const secondary = weapons.find((w) => w.id === ld.secondary_weapon);
      if (primary) weaponCounts[primary.name] = (weaponCounts[primary.name] || 0) + 1;
      if (secondary) weaponCounts[secondary.name] = (weaponCounts[secondary.name] || 0) + 1;
    });

    // Convert to sorted arrays
    const mapData = Object.entries(mapCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / loadouts.length) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    const agentData = Object.entries(agentCounts)
      .map(([name, info]) => ({
        name,
        count: info.count,
        role: info.role as Agent["role"]
      }))
      .sort((a, b) => b.count - a.count);

    const weaponData = Object.entries(weaponCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return { mapData, agentData, weaponData };
  }, [loading, loadouts, agents, weapons, maps]);

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        Loading analytics...
      </div>
    );
  }

  const { mapData, agentData, weaponData } = analytics;

  // ==========================
  // UI Rendering
  // ==========================
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <PageHeader
          title="Loadout Analytics"
          subtitle="Visual breakdown of your Valorant loadouts"
        />

        {/* ===== TOP KPI ROW ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Loadouts */}
      <GlassCard
        className="relative overflow-hidden text-center py-10 h-80 flex flex-col items-center justify-center"
      >
        {/* Background Image */}
        <img
          src={LoadoutsBG}
          alt="Loadouts Background"
          className="absolute inset-0 w-full h-full object-cover opacity-100 scale-110"
        />

        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-background/80" />

        {/* Foreground Content */}
        <div className="relative z-10">
          <h3 className="text-base md:text-lg uppercase font-bold text-white/90 tracking-wide mb-3 drop-shadow-sm">
            Total Loadouts
          </h3>

          <div className="text-5xl font-display font-bold text-primary drop-shadow-lg">
            {loadouts.length}
          </div>
        </div>
      </GlassCard>


        {/* Top Agent */}
        <GlassCard className="text-center py-10 h-80 relative overflow-hidden animate-fade-in-up [animation-delay:80ms]">
        <h3 className="text-base md:text-lg uppercase font-bold text-white/90 tracking-wide mb-3 drop-shadow">
          Favorite Agent
        </h3>
        {agentData.length > 0 ? (
          <>
            {/* Background fade image */}
            <img
        src={agentImages[agentData[0].name]}
        alt={agentData[0].name}
        className="absolute inset-0 w-full h-full object-cover opacity-25 scale-110"
      />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />

            {/* Foreground content */}
            <div className="relative z-10">
              <div className="text-base md:text-lg uppercase font-bold text-white/90 tracking-wide mb-3 drop-shadow">
                {agentData[0].name}
              </div>
              <RoleBadge role={agentData[0].role} />
            </div>
          </>
        ) : (
          <div className="text-muted-foreground">--</div>
        )}
      </GlassCard>

        {/* Most Played Map */}
      <GlassCard className="text-center py-10 h-80 relative overflow-hidden animate-fade-in-up [animation-delay:160ms]">
        <h3 className="text-base md:text-lg uppercase font-bold text-white/90 tracking-wide mb-3 drop-shadow">
          Most Played Map
        </h3>

        {mapData.length > 0 ? (
          <>
            {/* Background map image */}
            <img
        src={mapImages[mapData[0].name]}
        alt={mapData[0].name}
        className="absolute inset-0 w-full h-full object-cover opacity-25 scale-110"
      />


      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />

      <div className="relative z-10">
        <div className="text-base md:text-lg uppercase font-bold text-white/90 tracking-wide mb-3 drop-shadow">
          {mapData[0].name}
        </div>
        <p className="text-muted-foreground text-sm">
          {mapData[0].count} loadouts
        </p>
      </div>
    </>
  ) : (
    <div className="text-muted-foreground">--</div>
  )}
</GlassCard>

</div>


        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Map Distribution */}
          <GlassCard hover>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <MapIcon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display text-lg font-bold uppercase text-valorant-blue">
                Map Distribution
              </h3>
            </div>

            <div className="space-y-3">
              {mapData.map((item, index) => (
                <div key={item.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground font-medium">{item.name}</span>
                    <span className="text-muted-foreground">{item.count} loadouts</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Agent Distribution */}
          <GlassCard hover>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold uppercase text-valorant-blue">
                Most Picked Agents
              </h3>
            </div>

            <div className="space-y-4">
              {agentData.map((agent, index) => (
                <div
                  key={agent.name}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center font-display font-bold text-lg text-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{agent.name}</div>
                      <RoleBadge role={agent.role} />
                    </div>
                  </div>
                  <div className="text-2xl font-display font-bold text-primary">
                    {agent.count}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Agent Table */}
          <GlassCard hover>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
              <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="font-display text-lg font-bold uppercase text-valorant-blue">
                Most Used Agents
              </h3>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Agent</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentData.map((agent) => (
                  <TableRow key={agent.name} className="border-border">
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell><RoleBadge role={agent.role} /></TableCell>
                    <TableCell className="text-right">{agent.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassCard>

          {/* Weapons Table */}
          <GlassCard hover>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-display text-lg font-bold uppercase text-valorant-blue">
                Weapon Preferences
              </h3>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Weapon</TableHead>
                  <TableHead className="text-right">Times Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weaponData.map((weapon) => (
                  <TableRow key={weapon.name} className="border-border">
                    <TableCell className="font-medium">{weapon.name}</TableCell>
                    <TableCell className="text-right">{weapon.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </GlassCard>
        </div>
      </main>
    </div>
  );
}
