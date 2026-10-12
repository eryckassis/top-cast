import * as React from 'react';
import { useState } from 'react';
import { AppWindow, Monitor } from 'lucide-react';
import type { CaptureSource } from '../../shared/types/desktop-api';

export interface SourceThumbnailProps {
  source: CaptureSource;
  sourceKind: 'screen' | 'window';
}

/**
 * Placeholder simples e padronizado para telas ou janelas (apenas com ícone).
 */
export function SourceThumbnailPlaceholder({
  source,
  sourceKind,
}: SourceThumbnailProps) {
  const isWindow = sourceKind === 'window';

  return (
    <div
      aria-label={`Pré-visualização de ${source.name}`}
      className="flex h-full w-full items-center justify-center bg-slate-900/60 select-none text-slate-500"
    >
      {isWindow ? (
        <AppWindow className="h-10 w-10" strokeWidth={1.5} />
      ) : (
        <Monitor className="h-10 w-10" strokeWidth={1.5} />
      )}
    </div>
  );
}

/**
 * Renderiza o thumbnail da fonte ou aciona o placeholder caso a imagem esteja ausente ou falhe ao carregar.
 */
export function SourceThumbnail({ source, sourceKind }: SourceThumbnailProps) {
  const [hasError, setHasError] = useState(false);
  const hasValidThumbnail =
    Boolean(source.thumbnailDataUrl) &&
    source.thumbnailDataUrl !== 'data:image/png;base64,' &&
    !hasError;

  if (hasValidThumbnail) {
    return (
      <img
        src={source.thumbnailDataUrl}
        alt={source.name}
        onError={() => setHasError(true)}
        className="h-full w-full object-cover"
      />
    );
  }

  return <SourceThumbnailPlaceholder source={source} sourceKind={sourceKind} />;
}
