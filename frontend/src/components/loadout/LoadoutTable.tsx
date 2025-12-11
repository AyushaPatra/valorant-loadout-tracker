import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "./RoleBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Loadout {
  id: number;
  agent: string;
  role: "Duelist" | "Sentinel" | "Controller" | "Initiator";
  primary: string;
  sidearm: string;
  skin: string;
  map: string;
}

interface LoadoutTableProps {
  loadouts: Loadout[];
}

export function LoadoutTable({ loadouts }: LoadoutTableProps) {
  return (
    <div className="glass-panel overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="text-valorant-blue font-bold uppercase tracking-wider">Agent</TableHead>
              <TableHead className="text-valorant-blue font-bold uppercase tracking-wider">Role</TableHead>
              <TableHead className="text-valorant-blue font-bold uppercase tracking-wider">Primary</TableHead>
              <TableHead className="text-valorant-blue font-bold uppercase tracking-wider">Sidearm</TableHead>
              <TableHead className="text-valorant-blue font-bold uppercase tracking-wider">Skin</TableHead>
              <TableHead className="text-valorant-blue font-bold uppercase tracking-wider">Map</TableHead>
              <TableHead className="text-valorant-blue font-bold uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadouts.map((loadout, index) => (
              <TableRow
                key={loadout.id}
                className="table-row-interactive border-border animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="font-semibold text-foreground">{loadout.agent}</TableCell>
                <TableCell>
                  <RoleBadge role={loadout.role} />
                </TableCell>
                <TableCell className="text-muted-foreground">{loadout.primary}</TableCell>
                <TableCell className="text-muted-foreground">{loadout.sidearm}</TableCell>
                <TableCell className="text-muted-foreground">{loadout.skin}</TableCell>
                <TableCell className="text-muted-foreground">{loadout.map}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="edit" size="pill" asChild>
                      <Link to={`/loadout/${loadout.id}/transaction`}>
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="delete" size="pill" asChild>
                      <Link to={`/loadout/${loadout.id}/delete`}>
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
