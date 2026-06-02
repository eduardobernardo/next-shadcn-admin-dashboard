import Link from "next/link";

import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createPlanAction } from "../actions";

export default async function NovoPlanoPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <Link
          href="/planos"
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para Planos
        </Link>
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Novo plano</h1>
          <p className="text-muted-foreground text-sm">
            Crie o plano base com nome e configurações iniciais. Preços e limites são definidos depois, nas versões.
          </p>
        </div>
      </div>

      <form action={createPlanAction} className="grid max-w-2xl gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" placeholder="ex: growth" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" placeholder="ex: Growth" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="salesMode">Modo de venda</Label>
          <select
            id="salesMode"
            name="salesMode"
            defaultValue="SELF_SERVICE"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="SELF_SERVICE">Self Service</option>
            <option value="ASSISTED">Assistido</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="visibility">Visibilidade</Label>
          <select
            id="visibility"
            name="visibility"
            defaultValue="PUBLIC"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="PUBLIC">Público</option>
            <option value="HIDDEN">Oculto</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="displayOrder">Ordem de exibição</Label>
          <Input id="displayOrder" name="displayOrder" type="number" defaultValue={0} />
        </div>
        <div className="flex items-center gap-2 self-end">
          <input id="highlighted" name="highlighted" type="checkbox" className="size-4 rounded border border-input" />
          <Label htmlFor="highlighted">Destacar no catálogo</Label>
        </div>
        <div>
          <Button type="submit">
            <Plus className="mr-2 size-4" />
            Criar plano
          </Button>
        </div>
      </form>
    </div>
  );
}
