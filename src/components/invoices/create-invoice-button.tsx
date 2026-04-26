"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateInvoiceDialog } from "./create-invoice-dialog";
import { Plus } from "lucide-react";

interface Client { id: string; name: string }
interface Entity { id: string; name: string }

interface CreateInvoiceButtonProps {
  clients: Client[];
  entities: Entity[];
  nextNumber: string;
}

export function CreateInvoiceButton({ clients, entities, nextNumber }: CreateInvoiceButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        New Invoice
      </Button>
      {open && (
        <CreateInvoiceDialog
          clients={clients}
          entities={entities}
          nextNumber={nextNumber}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
