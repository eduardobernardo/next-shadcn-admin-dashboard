"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { type SuperadminNavItem, superadminSidebarItems } from "@/navigation/superadmin-sidebar";

type SearchItem = {
  group: string;
  label: string;
  url: string;
  icon?: SuperadminNavItem["icon"];
};

const searchItems: SearchItem[] = superadminSidebarItems.flatMap((group) =>
  group.items.map((item) => ({
    group: group.label,
    label: item.title,
    url: item.url,
    icon: item.icon,
  })),
);

function groupBy(items: SearchItem[]) {
  const groups = [...new Set(items.map((item) => item.group))];

  return groups.map((group) => ({
    group,
    items: items.filter((item) => item.group === group),
  }));
}

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "j" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) setQuery("");
  };

  const handleSelect = (item: SearchItem) => {
    handleOpenChange(false);
    router.push(item.url);
  };

  const filteredItems = query
    ? searchItems.filter((item) => `${item.group} ${item.label}`.toLowerCase().includes(query.toLowerCase()))
    : searchItems;

  const renderGroups = (items: SearchItem[]) =>
    groupBy(items).map(({ group, items: groupItems }, index) => (
      <React.Fragment key={group}>
        {index > 0 ? <CommandSeparator /> : null}
        <CommandGroup heading={group}>
          {groupItems.map((item) => (
            <CommandItem
              key={`${group}-${item.url}-${item.label}`}
              value={`${item.group} ${item.label}`}
              onSelect={() => handleSelect(item)}
            >
              {item.icon ? <item.icon /> : null}
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </React.Fragment>
    ));

  return (
    <>
      <Button
        onClick={() => handleOpenChange(true)}
        variant="link"
        className="px-0! font-normal text-muted-foreground hover:no-underline"
      >
        <Search data-icon="inline-start" />
        Buscar
        <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium text-[10px]">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <Command>
          <CommandInput placeholder="Buscar páginas e módulos…" value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            {renderGroups(filteredItems)}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
