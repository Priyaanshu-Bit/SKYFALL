import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function LoadingIndicator({
  text = "Loading...",
  className,
  size = "md",
}: {
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 text-center text-slate-400",
        className
      )}
      role="status"
    >
      <Loader2 className={cn("animate-spin text-skyfall-500", sizeClasses)} />
      {text && (
        <p className="text-xs font-medium tracking-wide sm:text-sm">{text}</p>
      )}
      <span className="sr-only">Loading</span>
    </div>
  );
}
