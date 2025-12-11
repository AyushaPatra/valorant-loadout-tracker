import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "select";
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  options = [],
  placeholder,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={name}
        className="text-valorant-blue font-semibold uppercase text-sm tracking-wide"
      >
        {label}
      </Label>
      {type === "select" ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            className={cn(
              "bg-input border-border text-foreground h-12",
              "focus:ring-2 focus:ring-primary/30 focus:border-primary",
              "transition-all duration-200"
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-foreground focus:bg-primary/20 focus:text-foreground"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "bg-input border-border text-foreground h-12",
            "focus:ring-2 focus:ring-primary/30 focus:border-primary input-glow",
            "transition-all duration-200"
          )}
        />
      )}
    </div>
  );
}
