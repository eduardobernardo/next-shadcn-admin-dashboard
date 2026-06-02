"use client";

import Link from "next/link";

import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EntityRowActionsProps = {
  viewHref: string;
  editHref: string;
  deleteHref: string;
  entityLabel: string;
};

export function EntityRowActions({ viewHref, editHref, deleteHref, entityLabel }: EntityRowActionsProps) {
  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={`Abrir ações para ${entityLabel}`}
            className="size-8 rounded-md text-muted-foreground hover:bg-muted/50"
            size="icon-sm"
            variant="ghost"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={viewHref}>
              <Eye className="size-4" />
              Ver detalhes
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={editHref}>
              <Edit className="size-4" />
              Editar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" asChild>
            <Link href={deleteHref}>
              <Trash2 className="size-4" />
              Excluir
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
