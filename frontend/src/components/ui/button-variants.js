import { cva } from "class-variance-authority";

export const cosmicButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-body font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        cosmic: "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-[0_0_20px_rgba(0,255,249,0.5)] hover:shadow-[0_0_30px_rgba(0,255,249,0.8)] hover:scale-105 active:scale-95",
        holographic: "holographic-card text-foreground hover:border-primary/60 hover:shadow-[0_0_25px_rgba(0,255,249,0.3)] hover:scale-105",
        ghost: "text-foreground/70 hover:text-primary hover:bg-primary/10",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "cosmic",
      size: "default",
    },
  }
);
