import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Button } from "./button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this data.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-950/20 p-8 text-center sm:p-12",
        className
      )}
      role="alert"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-950/80 text-red-400 shadow-inner">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-bold text-white sm:text-lg">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs text-red-300 sm:text-sm">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-6 border-red-500/40 text-red-300 hover:bg-red-950/50"
          size="sm"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
