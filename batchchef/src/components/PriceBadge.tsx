import type { CostBadge } from "@/lib/types";

interface PriceBadgeProps {
  cost: number;
  badge: CostBadge;
  size?: "sm" | "md";
}

export default function PriceBadge({ cost, badge, size = "sm" }: PriceBadgeProps) {
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full ${sizeClasses} ${
        badge === "green"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {badge === "green" ? "🟢" : "🔵"} {cost.toFixed(2)}€/repas
    </span>
  );
}
