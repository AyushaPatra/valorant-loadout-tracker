import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "@/api/axios";
import { ArrowLeft, Save, AlertTriangle } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/layout/GlassCard";
import { FormField } from "@/components/form/FormField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { getLoadout } from "@/api/loadouts";
import { getAgents } from "@/api/agents";
import { getWeapons } from "@/api/weapons";
import { getMaps } from "@/api/maps";
import { getSkins } from "@/api/skins";

export default function TransactionUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [forceError, setForceError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [agents, setAgents] = useState<any[]>([]);
  const [weapons, setWeapons] = useState<any[]>([]);
  const [skins, setSkins] = useState<any[]>([]);
  const [maps, setMaps] = useState<any[]>([]);

  // IMPORTANT: No empty strings — Radix Select breaks
  const [formData, setFormData] = useState({
    agent: "none",
    primary_weapon: "none",
    secondary_weapon: "none",
    skin: "none",
    map: "none",
  });

  // Load everything
  useEffect(() => {
    async function load() {
      try {
        const [loadoutRes, agentsRes, weaponsRes, skinsRes, mapsRes] =
          await Promise.all([
            getLoadout(Number(id)),
            getAgents(),
            getWeapons(),
            getSkins(),
            getMaps(),
          ]);

        setAgents(agentsRes.data);
        setWeapons(weaponsRes.data);
        setSkins(skinsRes.data);
        setMaps(mapsRes.data);

        const loadout = loadoutRes.data;

        setFormData({
          agent: loadout.agent.toString(),
          primary_weapon: loadout.primary_weapon.toString(),
          secondary_weapon: loadout.secondary_weapon.toString(),
          skin: loadout.skin ? loadout.skin.toString() : "none",
          map: loadout.map.toString(),
        });
      } catch (err) {
        console.error("Failed to load transaction page:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  function updateField(field: string) {
    return (value: string) =>
      setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const payload = {
      agent: Number(formData.agent),
      primary_weapon: Number(formData.primary_weapon),
      secondary_weapon: Number(formData.secondary_weapon),
      skin: formData.skin === "none" ? null : Number(formData.skin),
      map: Number(formData.map),
      force_error: forceError,
    };

    try {
      await axios.post(`/api/loadouts/${id}/transaction-update/`, payload);
      navigate("/transaction/success");
    } catch {
      navigate("/transaction/fail");
    }
  }

  if (loading) return <div className="p-8 text-center text-white">Loading…</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <PageHeader
          title="Edit Loadout"
          subtitle="Make changes to your current selected loadout."
          action={
            <Button variant="secondary" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </Button>
          }
        />

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agent */}
            <FormField
              label="Agent"
              name="agent"
              type="select"
              value={formData.agent}
              onChange={updateField("agent")}
              options={agents.map((a) => ({
                value: a.id.toString(),
                label: a.name,
              }))}
              placeholder="Select agent"
            />

            {/* Weapons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Primary Weapon"
                name="primary_weapon"
                type="select"
                value={formData.primary_weapon}
                onChange={updateField("primary_weapon")}
                options={weapons
                  .filter((w) => w.type === "Primary")
                  .map((w) => ({
                    value: w.id.toString(),
                    label: w.name,
                  }))}
                placeholder="Select primary"
              />

              <FormField
                label="Sidearm"
                name="secondary_weapon"
                type="select"
                value={formData.secondary_weapon}
                onChange={updateField("secondary_weapon")}
                options={weapons
                  .filter((w) => w.type === "Secondary")
                  .map((w) => ({
                    value: w.id.toString(),
                    label: w.name,
                  }))}
                placeholder="Select sidearm"
              />
            </div>

            {/* Skin */}
            <FormField
              label="Skin"
              name="skin"
              type="select"
              value={formData.skin}
              onChange={updateField("skin")}
              options={[
                { value: "none", label: "None" },
                ...skins.map((s) => ({
                  value: s.id.toString(),
                  label: s.name,
                })),
              ]}
              placeholder="Select skin"
            />

            {/* Map */}
            <FormField
              label="Map"
              name="map"
              type="select"
              value={formData.map}
              onChange={updateField("map")}
              options={maps.map((m) => ({
                value: m.id.toString(),
                label: m.name,
              }))}
              placeholder="Select map"
            />

            {/* Force Error */}
            <div className="p-4 bg-amber-900/30 border border-amber-700 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-bold text-amber-300">Rollback Demo</h4>
                <p className="text-amber-200/70 text-sm">
                  Enable this to intentionally trigger a failure so the entire
                  transaction is rolled back.
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <Checkbox
                    id="forceError"
                    checked={forceError}
                    onCheckedChange={(c) => setForceError(!!c)}
                  />
                  <Label htmlFor="forceError" className="text-amber-200">
                    Force Error (Rollback)
                  </Label>
                </div>
              </div>
            </div>

            <Button type="submit" size="xl" className="w-full">
              <Save className="w-5 h-5" /> Save Loadout
            </Button>
          </form>
        </GlassCard>
      </main>
    </div>
  );
}
