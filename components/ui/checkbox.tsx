"use client";

import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  indeterminate?: boolean;
  className?: string;
  title?: string;
}

export function Checkbox({ checked, onChange, indeterminate, className, title }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      onClick={onChange}
      title={title}
      className={cn(
        "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        checked || indeterminate
          ? "bg-primary border-primary"
          : "border-gray-300 bg-white hover:border-primary/60",
        className
      )}
    >
      {indeterminate && !checked ? (
        <Minus className="w-2.5 h-2.5 text-white" strokeWidth={3} />
      ) : checked ? (
        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
      ) : null}
    </button>
  );
}
