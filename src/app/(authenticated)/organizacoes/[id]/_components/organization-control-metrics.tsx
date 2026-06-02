import { BookOpen, Clapperboard, HardDrive, UserSquare2, Users } from "lucide-react";

import { StatCard } from "@/components/ui/stat-card";
import { StatsGrid } from "@/components/ui/stats-grid";
import type { OrganizationControlSnapshot } from "@/lib/organization-detail";
import { formatBytes } from "@/lib/saas-formatters";

const numberFormatter = new Intl.NumberFormat("pt-BR");

type OrganizationControlMetricsProps = {
  snapshot: OrganizationControlSnapshot;
};

export function OrganizationControlMetrics({ snapshot }: OrganizationControlMetricsProps) {
  const { counts, storage } = snapshot;
  const staffTotal = counts.admins + counts.managers + counts.billingUsers;

  return (
    <StatsGrid columns={5}>
      <StatCard
        title="Usuários"
        value={numberFormatter.format(counts.totalUsers)}
        icon={Users}
        comparison={`${numberFormatter.format(counts.members)} membros · ${numberFormatter.format(staffTotal)} equipe`}
      />
      <StatCard
        title="Cursos ativos"
        value={numberFormatter.format(counts.courses)}
        icon={BookOpen}
        comparison={
          counts.archivedCourses > 0
            ? `${numberFormatter.format(counts.archivedCourses)} arquivados · ${numberFormatter.format(counts.lessons)} aulas`
            : `${numberFormatter.format(counts.lessons)} aulas`
        }
      />
      <StatCard
        title="Vídeos"
        value={numberFormatter.format(counts.videos)}
        icon={Clapperboard}
        comparison={`${numberFormatter.format(counts.videosProcessed)} ok · ${numberFormatter.format(counts.videosProcessing)} em fila`}
      />
      <StatCard
        title="Matrículas"
        value={numberFormatter.format(counts.enrollments)}
        icon={UserSquare2}
        comparison={`${numberFormatter.format(counts.products)} produtos · ${numberFormatter.format(counts.orders)} pedidos`}
      />
      <StatCard
        title="Armazenamento"
        value={formatBytes(storage.totalBytes)}
        icon={HardDrive}
        comparison={`${formatBytes(storage.mediaBytes)} vídeos · ${formatBytes(storage.attachmentBytes)} anexos`}
      />
    </StatsGrid>
  );
}
