import Link from "next/link";

import { BadgePercent, Blocks, Box } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const shortcuts = [
  { id: "orgs", label: "Organizações", icon: Blocks, href: "/organizacoes" },
  { id: "plans", label: "Planos", icon: Box, href: "/planos" },
  { id: "coupons", label: "Cupons", icon: BadgePercent, href: "/cupons" },
] as const;

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Operações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;

            return (
              <div key={shortcut.id} className="flex flex-col items-center gap-2.5">
                <Button variant="outline" className="size-12 rounded-full" asChild>
                  <Link href={shortcut.href}>
                    <Icon className="size-5" />
                  </Link>
                </Button>
                <span className="text-center text-muted-foreground text-xs">{shortcut.label}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
