import Link from "next/link";

import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createCouponAction } from "../actions";

export default async function NovoCupomPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <Link
          href="/cupons"
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para Cupons
        </Link>
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Novo cupom</h1>
          <p className="text-muted-foreground text-sm">
            Configure o código de desconto, valor e regras de uso. Datas e limites podem ser ajustados depois.
          </p>
        </div>
      </div>

      <form action={createCouponAction} className="grid max-w-3xl gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="code">Código</Label>
          <Input id="code" name="code" placeholder="PROMO2026" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="discountType">Tipo de desconto</Label>
          <select
            id="discountType"
            name="discountType"
            defaultValue="PERCENTAGE"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="PERCENTAGE">Percentual</option>
            <option value="FIXED_AMOUNT">Valor fixo</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="discountValue">Valor do desconto</Label>
          <Input id="discountValue" name="discountValue" type="number" placeholder="10" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="durationType">Duração</Label>
          <select
            id="durationType"
            name="durationType"
            defaultValue="FIRST_INVOICE"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="FIRST_INVOICE">Primeira fatura</option>
            <option value="N_CYCLES">N ciclos</option>
            <option value="ONGOING">Contínuo</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="durationCycles">Número de ciclos</Label>
          <Input id="durationCycles" name="durationCycles" type="number" placeholder="Somente para N ciclos" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="organizationReusePolicy">Reutilização por organização</Label>
          <select
            id="organizationReusePolicy"
            name="organizationReusePolicy"
            defaultValue="SINGLE_USE"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="SINGLE_USE">Uso único</option>
            <option value="REUSABLE">Reutilizável</option>
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="allowedPlanSlugs">Planos permitidos (separados por vírgula)</Label>
          <Input id="allowedPlanSlugs" name="allowedPlanSlugs" placeholder="growth, scale" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="allowedCycles">Ciclos permitidos (separados por vírgula)</Label>
          <Input id="allowedCycles" name="allowedCycles" placeholder="MONTHLY, ANNUAL" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="globalRedemptionLimit">Limite total de usos</Label>
          <Input id="globalRedemptionLimit" name="globalRedemptionLimit" type="number" placeholder="Sem limite" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="validUntil">Data de expiração</Label>
          <Input id="validUntil" name="validUntil" type="datetime-local" />
        </div>
        <div>
          <Button type="submit">
            <Plus className="mr-2 size-4" />
            Criar cupom
          </Button>
        </div>
      </form>
    </div>
  );
}
