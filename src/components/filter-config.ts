import type { ComponentType, SVGProps } from "react";
import type { TaskFilter } from "@/types/task";
import { CheckCircleIcon, ClockIcon, LayoutIcon } from "./ui/icons";

interface FilterConfig {
  label: string;
  navLabel: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const FILTER_CONFIG: Record<TaskFilter, FilterConfig> = {
  all: { label: "Toutes", navLabel: "Tableau de bord", icon: LayoutIcon },
  pending: { label: "En cours", navLabel: "En cours", icon: ClockIcon },
  completed: { label: "Terminées", navLabel: "Terminées", icon: CheckCircleIcon },
};
