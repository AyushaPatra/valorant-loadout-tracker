import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Target, Search, X } from "lucide-react";
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
  const [search, setSearch] = useState(""); // search bar state
  const [mode, setMode] = useState<"AND" | "OR">("AND");


  const placeholders = [
  "Search: jett ghost pearl",
  "Search: ghost frenzy haven",
  "Search: duelist judge icebox",
  "Search: brimstone vandal pearl",
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Cycle placeholder text every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);


  // Fuzzy matching algorithm (simple + fast)
  function fuzzyMatch(text: string, term: string) {
    text = text.toLowerCase();
    term = term.toLowerCase();

    if (text.includes(term)) return true; // exact match

    let ti = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === term[ti]) ti++;
      if (ti === term.length) return true;
    }
    return false;
  }

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


  // MULTI-TERM + FUZZY SEARCH
  const terms = search.toLowerCase().trim().split(/\s+/);

const filtered = loadouts.filter((l) => {
  const fields = [
    l.agent,
    l.role,
    l.primary,
    l.sidearm,
    l.skin,
    l.map,
  ].map((f) => f.toLowerCase());

  // Fuzzy match helper
  const matches = (term: string) =>
    fields.some((field) => fuzzyMatch(field, term));

  if (mode === "AND") {
    // ALL terms must match
    return terms.every(matches);
  } else {
    // ANY term may match
    return terms.some(matches);
  }
});



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

  {/* SEARCH PANEL */}
<div className="glass-panel p-4 mb-6 flex items-center gap-4 relative">

  {/* SEARCH INPUT */}
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder={placeholders[placeholderIndex] + "  (space = multiple terms)"}
      className="w-full bg-neutral-900 p-3 pl-10 pr-10 rounded-md border text-foreground focus:outline-none"
    />

    {search && (
      <button
        onClick={() => setSearch("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>

  {/* MODE TOGGLE */}
  <div className="flex bg-neutral-800 border border-neutral-700 rounded-md overflow-hidden shadow-sm">
    <button
      onClick={() => setMode("AND")}
      className={`px-4 py-2 text-sm transition ${
        mode === "AND"
          ? "bg-valorant-red text-white"
          : "text-muted-foreground hover:text-foreground"
      }`}
      title="Match all search terms"
    >
      AND
    </button>

    <button
      onClick={() => setMode("OR")}
      className={`px-4 py-2 text-sm border-l border-neutral-700 transition ${
        mode === "OR"
          ? "bg-valorant-red text-white"
          : "text-muted-foreground hover:text-foreground"
      }`}
      title="Match any search term"
    >
      OR
    </button>
  </div>
</div>



        {/* RESULTS */}
        {loading ? (
          <div className="glass-panel p-12 text-center text-xl">Loading…</div>
        ) : filtered.length > 0 ? (
          <LoadoutTable loadouts={filtered} searchTerm={search} />
        ) : (
          <div className="glass-panel p-12 text-center">
            <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold uppercase mb-2">No Loadouts Found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search</p>
          </div>
        )}
      </main>
    </div>
  );
}
