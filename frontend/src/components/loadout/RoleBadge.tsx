import { cn } from "@/lib/utils";

type Role = "Duelist" | "Sentinel" | "Controller" | "Initiator";

interface RoleBadgeProps {
  role: Role;
}

const roleStyles: Record<Role, string> = {
  Duelist: "role-duelist",
  Sentinel: "role-sentinel",
  Controller: "role-controller",
  Initiator: "role-initiator",
};

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide",
        roleStyles[role]
      )}
    >
      {role}
    </span>
  );
}
