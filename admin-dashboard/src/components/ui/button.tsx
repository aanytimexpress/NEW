import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = cva(
  "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:opacity-90",
        outline: "border border-border bg-white hover:bg-muted"
      }
    },
    defaultVariants: { variant: "default" }
  }
);

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof variants> {}

export function Button({ className, variant, ...props }: Props) {
  return <button className={cn(variants({ variant }), className)} {...props} />;
}
