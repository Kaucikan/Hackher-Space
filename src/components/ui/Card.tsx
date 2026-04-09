import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  className?: string;
  children?: React.ReactNode;
  key?: React.Key;
}

export const Card = ({ className, glass, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-card p-6 shadow-sm transition-all hover:shadow-md',
        glass && 'glass',
        className
      )}
      {...props}
    />
  );
};

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4 flex flex-col space-y-1.5', className)} {...props} />
);

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-xl font-semibold leading-none tracking-tight', className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('pt-0', className)} {...props} />
);
