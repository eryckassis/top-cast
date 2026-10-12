import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LoadingOverlayProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingOverlay({
  title = 'Carregando…',
  description,
  className,
}: LoadingOverlayProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md duration-200 animate-in fade-in-0',
        className,
      )}
    >
      <div className="relative flex min-w-56 flex-col items-center gap-3.5 rounded-2xl bg-slate-900/95 px-7 py-6 shadow-2xl shadow-black/70 backdrop-blur-xl">
        {/* Spinner simples, discreto e profissional com Lucide Loader2 */}
        <div className="flex h-10 w-10 items-center justify-center text-primary">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium tracking-tight text-slate-100">{title}</p>
          {description && (
            <p className="mt-1 max-w-xs text-xs text-slate-400 leading-normal">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

