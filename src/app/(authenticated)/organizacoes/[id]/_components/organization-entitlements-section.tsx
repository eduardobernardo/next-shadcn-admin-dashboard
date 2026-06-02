import type { OrganizationBillingOverview } from "@/lib/organization-detail";

type OrganizationEntitlementsSectionProps = {
  entitlements: NonNullable<OrganizationBillingOverview["planEntitlements"]>;
};

export function OrganizationEntitlementsSection({ entitlements }: OrganizationEntitlementsSectionProps) {
  if (entitlements.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-3 font-semibold text-base tracking-tight">Benefícios do plano</h2>
      <div className="flex flex-wrap gap-2">
        {entitlements.map((item) => (
          <span
            key={item.key}
            className={`rounded-full border px-3 py-1 text-xs ${
              item.included
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "border-border bg-muted/30 text-muted-foreground"
            }`}
          >
            {item.label}
          </span>
        ))}
      </div>
    </section>
  );
}
