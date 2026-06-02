import Link from "next/link";

import { ArrowLeft, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSaasCoupons } from "@/http/saas-billing";
import { formatDateOnly, formatDateTime, formatLabel } from "@/lib/saas-formatters";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CupomDetalhePage({ params }: Props) {
  const { id } = await params;
  const { coupons } = await getSaasCoupons().catch(() => ({ coupons: [] }));
  const coupon = coupons.find((item: any) => item.id === id);

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
        <p className="text-muted-foreground">Não foi possível carregar o cupom.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Link
            href="/cupons"
            className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar para Cupons
          </Link>
          <div>
            <h1 className="font-mono font-semibold text-2xl tracking-tight">{coupon.code}</h1>
            <p className="text-muted-foreground text-sm">
              {coupon.isActive ? "Ativo" : "Inativo"} • {formatLabel(coupon.discountType)} •{" "}
              {formatLabel(coupon.durationType)}
            </p>
          </div>
        </div>

        <Button asChild size="sm">
          <Link href={`/cupons/${coupon.id}/edit`}>
            <Edit className="mr-2 size-4" />
            Editar cupom
          </Link>
        </Button>
      </div>

      <section>
        <h2 className="font-semibold text-base tracking-tight">Configuração do desconto</h2>
        <p className="mb-4 text-muted-foreground text-sm">Tipo, valor e duração do cupom.</p>

        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Tipo</dt>
            <dd className="font-medium">{formatLabel(coupon.discountType)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Valor</dt>
            <dd className="font-medium">{coupon.discountValue}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Duração</dt>
            <dd className="font-medium">{formatLabel(coupon.durationType)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Ciclos</dt>
            <dd className="font-medium">{coupon.durationCycles ?? "-"}</dd>
          </div>
        </dl>
      </section>

      <Separator />

      <section>
        <h2 className="font-semibold text-base tracking-tight">Escopo e limites</h2>
        <p className="mb-4 text-muted-foreground text-sm">Regras de uso e validade do cupom.</p>

        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Reutilização</dt>
            <dd className="font-medium">{formatLabel(coupon.organizationReusePolicy)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Resgates</dt>
            <dd className="font-medium">
              {coupon.redemptionCount}
              {coupon.globalRedemptionLimit ? ` / ${coupon.globalRedemptionLimit}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Válido de</dt>
            <dd className="font-medium">{formatDateOnly(coupon.validFrom)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Válido até</dt>
            <dd className="font-medium">{formatDateOnly(coupon.validUntil)}</dd>
          </div>
        </dl>
      </section>

      <Separator />

      <section>
        <h2 className="font-semibold text-base tracking-tight">Restrições e metadados</h2>
        <p className="mb-4 text-muted-foreground text-sm">Planos, ciclos aceitos e datas de auditoria.</p>

        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Planos aceitos</dt>
            <dd className="font-medium">
              {coupon.allowedPlanSlugs?.length ? coupon.allowedPlanSlugs.join(", ") : "Todos os planos"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Ciclos aceitos</dt>
            <dd className="font-medium">
              {coupon.allowedCycles?.length ? coupon.allowedCycles.join(", ") : "Todos os ciclos"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Criado em</dt>
            <dd className="font-medium">{formatDateTime(coupon.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Atualizado em</dt>
            <dd className="font-medium">{formatDateTime(coupon.updatedAt)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
