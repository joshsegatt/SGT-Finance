"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ConnectBankModal } from "@/components/accounts/connect-bank-modal";

interface Entity {
  id: string;
  name: string;
  country: string;
}

export function ConnectBankButton({ entities }: { entities: Entity[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2"
        size="sm"
      >
        <Plus className="w-4 h-4" />
        Connect Bank
      </Button>
      <ConnectBankModal
        open={open}
        onClose={() => setOpen(false)}
        entities={entities}
      />
    </>
  );
}
