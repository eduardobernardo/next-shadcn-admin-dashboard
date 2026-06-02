import { BadgePercent, Blocks, Box, CircleDollarSign, LayoutDashboard, type LucideIcon } from "lucide-react";

export interface SuperadminNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface SuperadminNavGroup {
  label: string;
  items: SuperadminNavItem[];
}

export const superadminSidebarItems: SuperadminNavGroup[] = [
  {
    label: "Visão geral",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Financeiro", url: "/financeiro", icon: CircleDollarSign },
    ],
  },
  {
    label: "Catálogo",
    items: [
      { title: "Planos", url: "/planos", icon: Box },
      { title: "Cupons", url: "/cupons", icon: BadgePercent },
    ],
  },
  {
    label: "Operações",
    items: [{ title: "Organizações", url: "/organizacoes", icon: Blocks }],
  },
];
