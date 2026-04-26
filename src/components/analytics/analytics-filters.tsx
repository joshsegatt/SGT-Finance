"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Entity {
  id: string;
  name: string;
}

interface AnalyticsFiltersProps {
  entities: Entity[];
}

export function AnalyticsFilters({ entities }: AnalyticsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  const periods = [
    { label: "30 days", value: "30d" },
    { label: "3 months", value: "90d" },
    { label: "6 months", value: "6m" },
    { label: "1 year", value: "1y" },
  ];

  const selectedEntity: string = searchParams.get("entityId") ?? "all";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex gap-1">
        {periods.map((p) => (
          <Button
            key={p.value}
            variant={searchParams.get("period") === p.value ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setParam("period", p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <Select
        defaultValue={selectedEntity}
        onValueChange={(v) => setParam("entityId", v)}
      >
        <SelectTrigger className="w-[180px] h-8">
          <SelectValue placeholder="All entities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All entities</SelectItem>
          {entities.map((e) => (
            <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
