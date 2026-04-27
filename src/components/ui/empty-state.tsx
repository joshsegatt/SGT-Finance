import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  compact?: boolean;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center relative",
      compact ? "py-10" : "py-20",
      className
    )}>
      {/* Background Mesh (Subtle) */}
      {!compact && (
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden rounded-xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
        </div>
      )}

      {/* Icon with Glassmorphism */}
      <div className={cn(
        "rounded-2xl border border-border/40 backdrop-blur-sm shadow-xl flex items-center justify-center mb-6",
        compact ? "w-12 h-12" : "w-20 h-20 bg-muted/30"
      )}>
        <Icon className={cn(
          "text-primary/60",
          compact ? "w-6 h-6" : "w-10 h-10"
        )} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="max-w-xs px-4">
        <h3 className={cn(
          "font-bold text-foreground tracking-tight",
          compact ? "text-sm" : "text-xl"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-muted-foreground mt-2 leading-relaxed mx-auto",
          compact ? "text-xs max-w-[200px]" : "text-sm"
        )}>
          {description}
        </p>
      </div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className={cn(
          "flex flex-col sm:flex-row items-center gap-3 mt-8",
          compact && "mt-4"
        )}>
          {action && (
            action.href ? (
              <Link
                href={action.href}
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-primary text-primary-foreground h-10 px-6 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                {action.label}
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-primary text-primary-foreground h-10 px-6 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                {action.label}
              </button>
            )
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground h-10 px-6 rounded-lg border border-border/60 hover:bg-muted/50 transition-all"
              >
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                onClick={secondaryAction.onClick}
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground h-10 px-6 rounded-lg border border-border/60 hover:bg-muted/50 transition-all"
              >
                {secondaryAction.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
