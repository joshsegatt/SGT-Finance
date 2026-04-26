"use client";

import { useRef, useState, useTransition } from "react";
import { Camera, Loader2, Check, X } from "lucide-react";
import { updateUserAvatar } from "@/lib/actions";

interface Props {
  currentImage: string | null;
  name: string;
}

function avatarInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

export function ProfileAvatar({ currentImage, name }: Props) {
  const [preview, setPreview] = useState<string | null>(currentImage);
  const [loading, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setStatus("error");
      setErrorMsg("File too large (max 2 MB)");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setErrorMsg("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreview(dataUrl);
      setStatus("idle");
      setErrorMsg("");
      startTransition(async () => {
        try {
          await updateUserAvatar(dataUrl);
          setStatus("success");
          setTimeout(() => setStatus("idle"), 3000);
        } catch (err: unknown) {
          setStatus("error");
          setErrorMsg(err instanceof Error ? err.message : "Upload failed");
          setPreview(currentImage);
        }
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-5">
      <div className="relative group shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center ring-2 ring-border">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-primary">{avatarInitials(name)}</span>
          )}
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          aria-label="Change photo"
        >
          {loading
            ? <Loader2 className="w-5 h-5 text-white animate-spin" />
            : <Camera className="w-5 h-5 text-white" />
          }
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      <div className="min-w-0">
        <p className="font-semibold text-foreground text-base">{name || "User"}</p>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="text-xs text-primary hover:text-primary/80 transition-colors mt-0.5 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Uploading…" : "Change photo"}
        </button>
        <p className="text-[11px] text-muted-foreground mt-0.5">JPEG, PNG or WebP · max 2 MB</p>
        {status === "success" && (
          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            <Check className="w-3 h-3" /> Photo updated
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-1 text-xs text-destructive mt-1">
            <X className="w-3 h-3" /> {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
