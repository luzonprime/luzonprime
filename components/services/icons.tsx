import {
  Briefcase,
  Building2,
  ClipboardCheck,
  Coins,
  FileText,
  Handshake,
  HardHat,
  Home,
  KeyRound,
  Landmark,
  LineChart,
  Scale,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

// Icon key → component. Keep keys stable; admin picks a key per service.
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  TrendingUp,
  LineChart,
  Building2,
  Home,
  KeyRound,
  HardHat,
  Wrench,
  Landmark,
  Coins,
  Scale,
  FileText,
  ClipboardCheck,
  Handshake,
  Users,
  Briefcase,
};

export const SERVICE_ICON_OPTIONS = Object.keys(SERVICE_ICONS).map((k) => ({
  value: k,
  label: k,
}));

// Fallback icon when a service has no icon set or an unknown key.
export const DEFAULT_SERVICE_ICON: LucideIcon = Briefcase;

export function serviceIcon(key: string | null | undefined): LucideIcon {
  return (key && SERVICE_ICONS[key]) || DEFAULT_SERVICE_ICON;
}
