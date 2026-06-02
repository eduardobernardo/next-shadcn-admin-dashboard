import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { FeedbackAlert } from "@/components/feedback-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getSaasCoupons } from "@/http/saas-billing";
import { getFeedback, toDateTimeLocalValue } from "@/lib/saas-formatters";

import { deleteCouponAction, updateCouponAction } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CupomEditPage({ params, searchParams }: Props) {
  const [{ id }, { coupons }, resolvedSearchParams] = await Promise.all([
    params,
    getSaasCoupons().catch(() => ({ coupons: [] })),
    searchParams ?? Promise.resolve({}),
  ]);

  const coupon = coupons.find((item: any) => item.id === id);
  const feedback = getFeedback(resolvedSearchParams);

  if (!coupon) {
    return (
      <div className="flex flex-col gap-8">
        <Link
          href="/cupons"
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para Cupons
        </Link>
        <p className="text-muted-foreground">Não foi possível carregar o cupom para edição.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <Link
          href={`/cupons/${coupon.id}`}
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para detalhes
        </Link>
        <div>
          <h1 className="font-mono font-semibold text-2xl tracking-tight">Editar {coupon.code}</h1>
          <p className="text-muted-foreground text-sm">Ajuste vigência, escopo e estado do cupom.</p>
        </div>
      </div>

      {feedback ? <FeedbackAlert status={feedback.status} message={feedback.message} /> : null}

      <section>
        <h2 className="font-semibold text-base tracking-tight">Configuração do cupom</h2>
        <p className="mb-4 text-muted-foreground text-sm">Campos que definem o desconto e a elegibilidade do cupom.</p>

        <form action={updateCouponAction.bind(null, coupon.id)} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="code">Código</Label>
            <Input id="code" name="code" defaultValue={coupon.code} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="discountType">Tipo de desconto</Label>
            <select
              id="discountType"
              name="discountType"
              defaultValue={coupon.discountType}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="PERCENTAGE">Percentual</option>
              <option value="FIXED_AMOUNT">Valor fixo</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="discountValue">Valor</Label>
            <Input id="discountValue" name="discountValue" type="number" defaultValue={coupon.discountValue} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="durationType">Duração</Label>
            <select
              id="durationType"
              name="durationType"
              defaultValue={coupon.durationType}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="FIRST_INVOICE">Primeira fatura</option>
              <option value="N_CYCLES">N ciclos</option>
              <option value="ONGOING">Contínuo</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="durationCycles">Ciclos</Label>
            <Input id="durationCycles" name="durationCycles" type="number" defaultValue={coupon.durationCycles ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="organizationReusePolicy">Reutilização</Label>
            <select
              id="organizationReusePolicy"
              name="organizationReusePolicy"
              defaultValue={coupon.organizationReusePolicy}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="SINGLE_USE">Uso único</option>
              <option value="REUSABLE">Reutilizável</option>
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="allowedPlanSlugs">Planos permitidos</Label>
            <Input
              id="allowedPlanSlugs"
              name="allowedPlanSlugs"
              defaultValue={coupon.allowedPlanSlugs?.join(", ") ?? ""}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="allowedCycles">Ciclos permitidos</Label>
            <Input id="allowedCycles" name="allowedCycles" defaultValue={coupon.allowedCycles?.join(", ") ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="validFrom">Válido de</Label>
            <Input
              id="validFrom"
              name="validFrom"
              type="datetime-local"
              defaultValue={toDateTimeLocalValue(coupon.validFrom)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="validUntil">Válido até</Label>
            <Input
              id="validUntil"
              name="validUntil"
              type="datetime-local"
              defaultValue={toDateTimeLocalValue(coupon.validUntil)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="globalRedemptionLimit">Limite global</Label>
            <Input
              id="globalRedemptionLimit"
              name="globalRedemptionLimit"
              type="number"
              defaultValue={coupon.globalRedemptionLimit ?? ""}
            />
          </div>
          <div className="flex items-center gap-2 self-end">
            <input name="isActive" type="hidden" value="false" />
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              defaultChecked={coupon.isActive}
              className="size-4 rounded border border-input"
            />
            <Label htmlFor="isActive">Cupom ativo</Label>
          </div>
          <div>
            <Button type="submit" size="sm">
              Salvar alterações
            </Button>
          </div>
        </form>
      </section>

      <Separator />

      <section id="danger-zone" className="space-y-4">
        <div>
          <h2 className="font-semibold text-base text-destructive tracking-tight">Zona de exclusão</h2>
          <p className="text-muted-foreground text-sm">
            Cupons com histórico de uso não podem ser excluídos. Nesses casos, desative o cupom acima.
          </p>
        </div>

        <form
          action={deleteCouponAction.bind(null, coupon.id, coupon.code)}
          className="flex flex-col gap-4 sm:max-w-md"
        >
          <div className="space-y-1.5">
            <Label htmlFor="confirmation">Confirme digitando o código do cupom</Label>
            <Input id="confirmation" name="confirmation" placeholder={coupon.code} />
          </div>
          <Button type="submit" variant="destructive" size="sm" className="w-fit">
            Excluir cupom
          </Button>
        </form>
      </section>
    </div>
  );
}
