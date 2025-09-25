import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "warning" | "info";
  className?: string;
}

export function CircularProgress({ value, size = "md", color = "primary", className }: CircularProgressProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-20 h-20",
  };

  const colorClasses = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    info: "text-info",
  };

  const backgroundColors = {
    primary: "bg-primary/10",
    success: "bg-success/10",
    warning: "bg-warning/10", 
    info: "bg-info/10",
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(value / 100) * circumference} ${circumference}`;

  return (
    <div className={cn("relative flex items-center justify-center rounded-full", sizeClasses[size], backgroundColors[color], className)}>
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 44 44"
      >
        <circle
          cx="22"
          cy="22"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          className="opacity-20"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className={colorClasses[color]}
        />
      </svg>
      <span className={cn("text-sm font-semibold", colorClasses[color])}>
        {value}%
      </span>
    </div>
  );
}