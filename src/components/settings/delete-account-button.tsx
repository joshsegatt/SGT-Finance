"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (res.ok) {
        await signOut({ callbackUrl: "/login" });
      } else {
        alert("Não foi possível apagar a conta. Tente novamente.");
        setConfirming(false);
      }
    });
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="w-full flex items-center justify-center gap-2 text-xs px-3 py-2 rounded-md border border-destructive/40 text-destructive hover:bg-destructive/5 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Apagar conta permanentemente
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-destructive font-medium">
        Esta ação é irreversível. Todos os seus dados serão eliminados permanentemente.
      </p>
      <p className="text-xs text-muted-foreground">
        Escreva <span className="font-mono font-bold text-foreground">APAGAR</span> para confirmar:
      </p>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="APAGAR"
        className="w-full h-9 px-3 rounded-md border border-destructive/40 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-destructive/30"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          onClick={() => { setConfirming(false); setValue(""); }}
          className="flex-1 text-xs px-3 py-2 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleDelete}
          disabled={value !== "APAGAR" || isPending}
          className="flex-1 text-xs px-3 py-2 rounded-md bg-destructive text-destructive-foreground font-semibold disabled:opacity-40 hover:bg-destructive/90 transition-colors flex items-center justify-center gap-1.5"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Apagar
        </button>
      </div>
    </div>
  );
}
