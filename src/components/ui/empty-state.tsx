import { type LucideIcon } from "lucide-react";
import Link from "next/link";

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
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? "py-10 gap-3" : "py-20 gap-4"}`}>
      {/* Icon container */}
      <div className={`rounded-2xl bg-muted/50 border border-border/60 flex items-center justify-center ${compact ? "w-12 h-12" : "w-16 h-16"}`}>
        <Icon className={`text-muted-foreground/60 ${compact ? "w-5 h-5" : "w-7 h-7"}`} strokeWidth={1.5} />
      </div>

      {/* Text */}
      <div className="max-w-xs">
        <p className={`font-semibold text-foreground ${compact ? "text-sm" : "text-base"}`}>{title}</p>
        <p className={`text-muted-foreground mt-1 leading-relaxed ${compact ? "text-xs" : "text-sm"}`}>{description}</p>
      </div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-1">
          {action && (
            action.href ? (
              <Link
                href={action.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {action.label}
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {action.label}
              </button>
            )
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                onClick={secondaryAction.onClick}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
