import { CreditCard, Shield, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrganizationBillingOverview, OrganizationTeamMember } from "@/lib/organization-detail";
import { formatDateTime, formatLabel } from "@/lib/saas-formatters";

function formatRoleLabel(role: OrganizationTeamMember["role"]) {
  switch (role) {
    case "ADMIN":
      return "Administrador";
    case "MANAGER":
      return "Gerente";
    case "BILLING":
      return "Financeiro";
    default:
      return formatLabel(role);
  }
}

function TeamMemberList({ members, emptyLabel }: { members: OrganizationTeamMember[]; emptyLabel: string }) {
  if (members.length === 0) {
    return <p className="text-muted-foreground text-sm">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-3">
      {members.map((member) => (
        <li key={member.userId} className="flex items-start justify-between gap-3 text-sm">
          <div className="min-w-0">
            <p className="truncate font-medium">{member.name ?? member.email}</p>
            <p className="truncate text-muted-foreground text-xs">{member.email}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-muted-foreground text-xs">{formatRoleLabel(member.role)}</p>
            <p className="text-muted-foreground text-xs">último acesso {formatDateTime(member.lastLoginAt)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

type OrganizationTeamSectionProps = {
  overview: OrganizationBillingOverview;
  team: {
    admins: OrganizationTeamMember[];
    managers: OrganizationTeamMember[];
    billingUsers: OrganizationTeamMember[];
  };
};

export function OrganizationTeamSection({ overview, team }: OrganizationTeamSectionProps) {
  const billingProfile = overview.billingProfile;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="size-4 text-muted-foreground" />
          Pessoas e responsáveis
        </CardTitle>
        <CardDescription>Administradores da org, equipe interna e contato financeiro de cobrança.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Shield className="size-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Administradores ({team.admins.length})</h3>
            </div>
            <TeamMemberList members={team.admins} emptyLabel="Nenhum administrador cadastrado." />
          </div>

          {team.managers.length > 0 ? (
            <div>
              <h3 className="mb-3 font-medium text-sm">Gerentes ({team.managers.length})</h3>
              <TeamMemberList members={team.managers} emptyLabel="Nenhum gerente cadastrado." />
            </div>
          ) : null}

          {team.billingUsers.length > 0 ? (
            <div>
              <h3 className="mb-3 font-medium text-sm">Usuários financeiros ({team.billingUsers.length})</h3>
              <TeamMemberList members={team.billingUsers} emptyLabel="Nenhum usuário com papel financeiro." />
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-muted-foreground" />
            <h3 className="font-medium text-sm">Responsável financeiro (cobrança SaaS)</h3>
          </div>

          {billingProfile ? (
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wider">Titular</dt>
                <dd className="font-medium">{billingProfile.nameOrCorporateName}</dd>
              </div>
              {billingProfile.tradeName ? (
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wider">Nome fantasia</dt>
                  <dd className="font-medium">{billingProfile.tradeName}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wider">Documento</dt>
                <dd className="font-medium">{billingProfile.cpfCnpj}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wider">E-mail financeiro</dt>
                <dd className="font-medium">{billingProfile.financialEmail}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wider">Telefone</dt>
                <dd className="font-medium">{billingProfile.phone}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-muted-foreground text-sm">Perfil de cobrança ainda não preenchido pela organização.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
