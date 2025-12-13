import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/layout/GlassCard";
import { FormField } from "@/components/form/FormField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

import { createLoadout, updateLoadout, getLoadout } from "@/api/loadouts";
import { getAgents } from "@/api/agents";
import { getWeapons } from "@/api/weapons";
import { getMaps } from "@/api/maps";
import { getSkins } from "@/api/skins";

export default function LoadoutForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [agents, setAgents] = useState<any[]>([]);
  const [weapons, setWeapons] = useState<any[]>([]);
  const [skins, setSkins] = useState<any[]>([]);
  const [maps, setMaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<any>({
    agent: "",
    primary_weapon: "",
    secondary_weapon: "",
    skin: "",
    map: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const [agentsRes, weaponsRes, skinsRes, mapsRes] = await Promise.all([
          getAgents(),
          getWeapons(),
          getSkins(),
          getMaps(),
        ]);

        setAgents(agentsRes.data);
        setWeapons(weaponsRes.data);
        setSkins(skinsRes.data);
        setMaps(mapsRes.data);

        if (isEdit) {
          const loadout = await getLoadout(Number(id));
          setFormData({
            agent: loadout.data.agent.toString(),
            primary_weapon: loadout.data.primary_weapon.toString(),
            secondary_weapon: loadout.data.secondary_weapon.toString(),
            skin: loadout.data.skin ? loadout.data.skin.toString() : "",
            map: loadout.data.map.toString(),
          });
        }
      } catch (error) {
        console.error("Failed to load form:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isEdit]);

  function updateField(field: string) {
    return (value: string) =>
      setFormData((prev: any) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const payload = {
      agent: Number(formData.agent),
      primary_weapon: Number(formData.primary_weapon),
      secondary_weapon: Number(formData.secondary_weapon),
      skin: formData.skin === "none" ? null : Number(formData.skin),
      map: Number(formData.map),
    };

    try {
      if (isEdit) {
        await updateLoadout(Number(id), payload);
        toast({ title: "Loadout Updated", description: "Your loadout was updated successfully." });
      } else {
        await createLoadout(payload);
        toast({ title: "Loadout Created", description: "Your loadout was created successfully." });
      }
      navigate("/loadouts");
    } catch {
      toast({ title: "Error", description: "Unable to save loadout.", variant: "destructive" });
    }
  }

  if (loading) return <div className="p-8 text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <PageHeader
          title={isEdit ? "Edit Loadout" : "Create Loadout"}
          subtitle={isEdit ? "Make changes to your selected loadout" : "Set up your new Valorant loadout"}
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
              options={agents.map((a) => ({ value: a.id.toString(), label: a.name }))}
              placeholder="Select Agent"
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
                  .map((w) => ({ value: w.id.toString(), label: w.name }))}
                placeholder="Select Primary Weapon"
              />

              <FormField
                label="Sidearm"
                name="secondary_weapon"
                type="select"
                value={formData.secondary_weapon}
                onChange={updateField("secondary_weapon")}
                options={weapons
                  .filter((w) => w.type === "Secondary")
                  .map((w) => ({ value: w.id.toString(), label: w.name }))}
                placeholder="Select Sidearm"
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
                ...skins.map((s) => ({ value: s.id.toString(), label: s.name })),
              ]}
              placeholder="Select Skin"
            />

            {/* Map */}
            <FormField
              label="Map"
              name="map"
              type="select"
              value={formData.map}
              onChange={updateField("map")}
              options={maps.map((m) => ({ value: m.id.toString(), label: m.name }))}
              placeholder="Select Map"
            />

            <Button type="submit" size="xl" className="w-full">
              <Save className="w-5 h-5" /> {isEdit ? "Save Loadout" : "Create Loadout"}
            </Button>
          </form>
        </GlassCard>
      </main>
    </div>
  );
}
