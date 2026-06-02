import Link from "next/link";

import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getSaasPlans } from "@/http/saas-billing";

import { createPlanVersionAction } from "../actions";

export default async function NovaVersaoPage() {
  const { plans } = await getSaasPlans().catch(() => ({ plans: [] }));

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
          <h1 className="font-semibold text-2xl tracking-tight">Nova versão de plano</h1>
          <p className="text-muted-foreground text-sm">
            Defina preço, limites e benefícios para uma nova versão do plano.
          </p>
        </div>
      </div>

      {plans.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhum plano cadastrado. Crie um plano antes de adicionar versões.
        </p>
      ) : (
        <form action={createPlanVersionAction} className="grid max-w-3xl gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="planId">Plano</Label>
            <select
              id="planId"
              name="planId"
              defaultValue={plans[0]?.id ?? ""}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {plans.map((plan: any) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="monthlyPriceCents">Preço mensal (em centavos)</Label>
              <Input id="monthlyPriceCents" name="monthlyPriceCents" type="number" placeholder="4990" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="annualPriceCents">Preço anual (em centavos)</Label>
              <Input id="annualPriceCents" name="annualPriceCents" type="number" placeholder="49900" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="marketingDescription">Descrição do plano</Label>
            <Textarea
              id="marketingDescription"
              name="marketingDescription"
              placeholder="Descreva para quem é este plano e o que ele oferece."
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ctaLabel">Texto do botão de compra</Label>
              <Input id="ctaLabel" name="ctaLabel" defaultValue="Teste grátis" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="publicBadges">Selos (separados por vírgula)</Label>
              <Input id="publicBadges" name="publicBadges" placeholder="Mais vendido, Anual com desconto" />
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-semibold text-base tracking-tight">Limites</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <div className="space-y-1.5">
                <Label htmlFor="members">Membros</Label>
                <Input id="members" name="members" type="number" placeholder="0" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="admins">Admins</Label>
                <Input id="admins" name="admins" type="number" placeholder="0" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="courses">Cursos</Label>
                <Input id="courses" name="courses" type="number" placeholder="0" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lessons">Aulas</Label>
                <Input id="lessons" name="lessons" type="number" placeholder="0" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="storageBytes">Armazenamento (bytes)</Label>
                <Input id="storageBytes" name="storageBytes" type="number" placeholder="0" required />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="entitlementsJson">Benefícios extras (JSON)</Label>
            <Textarea
              id="entitlementsJson"
              name="entitlementsJson"
              placeholder='{"certificates":true,"advanced_reports":false}'
              defaultValue='{"certificates":true}'
              className="min-h-32 font-mono text-xs"
            />
          </div>

          <div>
            <Button type="submit">
              <Plus className="mr-2 size-4" />
              Criar versão
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
