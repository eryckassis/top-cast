import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary/15 text-primary-300 shadow-sm',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive/15 text-destructive-foreground',
        outline: 'border-border/40 text-foreground',
        live: 'border-red-500/20 bg-red-500/15 text-red-300 shadow-sm',
        success: 'border-emerald-500/20 bg-emerald-500/15 text-emerald-300 shadow-sm',
        warning: 'border-amber-500/20 bg-amber-500/15 text-amber-300 shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

