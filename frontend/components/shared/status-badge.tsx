import { cn } from "@/lib/utils";

// ============================================
// STATUS BADGE COMPONENT
// ============================================
type StatusVariant = "default" | "success" | "warning" | "error" | "info";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  default: "bg-secondary text-secondary-foreground",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

// Auto-detect variant based on status string
const statusToVariant: Record<string, StatusVariant> = {
  active: "success",
  present: "success",
  paid: "success",
  pass: "success",
  published: "success",
  inactive: "error",
  absent: "error",
  overdue: "error",
  fail: "error",
  suspended: "error",
  pending: "warning",
  partial: "warning",
  late: "warning",
  draft: "warning",
  excused: "info",
  graduated: "info",
  on_leave: "info",
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const detectedVariant = variant || statusToVariant[status.toLowerCase()] || "default";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        variantStyles[detectedVariant],
        className
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
