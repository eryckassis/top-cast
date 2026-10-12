import { useState, useEffect } from 'react';
import { Sparkles, Mic, VolumeX, Sliders, AudioLines, RotateCcw, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { cn } from '../lib/utils';

export interface AudioEffectsConfig {
  enabled: boolean;
  noiseSuppression: boolean;
  echoCancellation: boolean;
  autoGainControl: boolean;
  highFidelity: boolean;
}

export const DEFAULT_AUDIO_EFFECTS: AudioEffectsConfig = {
  enabled: true,
  noiseSuppression: true,
  echoCancellation: true,
  autoGainControl: true,
  highFidelity: false,
};

const AUDIO_EFFECTS_STORAGE_KEY = 'topcast:audio-effects';

export function getSavedAudioEffects(): AudioEffectsConfig {
  if (typeof window === 'undefined') return DEFAULT_AUDIO_EFFECTS;
  try {
    const raw = window.localStorage.getItem(AUDIO_EFFECTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AudioEffectsConfig>;
      return {
        enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : DEFAULT_AUDIO_EFFECTS.enabled,
        noiseSuppression: typeof parsed.noiseSuppression === 'boolean' ? parsed.noiseSuppression : DEFAULT_AUDIO_EFFECTS.noiseSuppression,
        echoCancellation: typeof parsed.echoCancellation === 'boolean' ? parsed.echoCancellation : DEFAULT_AUDIO_EFFECTS.echoCancellation,
        autoGainControl: typeof parsed.autoGainControl === 'boolean' ? parsed.autoGainControl : DEFAULT_AUDIO_EFFECTS.autoGainControl,
        highFidelity: typeof parsed.highFidelity === 'boolean' ? parsed.highFidelity : DEFAULT_AUDIO_EFFECTS.highFidelity,
      };
    }
  } catch {
    // Retorna padrões em caso de erro no parse
  }
  return DEFAULT_AUDIO_EFFECTS;
}

export function saveAudioEffects(config: AudioEffectsConfig): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AUDIO_EFFECTS_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('topcast:audio-effects-changed', { detail: config }));
  } catch {
    // Ignora erro no localStorage
  }
}

interface AudioEffectsDialogProps {
  children?: React.ReactNode;
  triggerClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AudioEffectsDialog({
  children,
  triggerClassName,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AudioEffectsDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [effects, setEffects] = useState<AudioEffectsConfig>(getSavedAudioEffects);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    controlledOnOpenChange?.(newOpen);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setEffects(getSavedAudioEffects());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('topcast:audio-effects-changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('topcast:audio-effects-changed', handleStorageChange);
    };
  }, []);

  const updateEffects = (updater: (prev: AudioEffectsConfig) => AudioEffectsConfig) => {
    setEffects((prev) => {
      const next = updater(prev);
      saveAudioEffects(next);
      return next;
    });
  };

  const handleToggleMaster = () => {
    updateEffects((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleToggleNoiseSuppression = () => {
    updateEffects((prev) => ({ ...prev, noiseSuppression: !prev.noiseSuppression }));
  };

  const handleToggleEchoCancellation = () => {
    updateEffects((prev) => ({ ...prev, echoCancellation: !prev.echoCancellation }));
  };

  const handleToggleAutoGainControl = () => {
    updateEffects((prev) => ({ ...prev, autoGainControl: !prev.autoGainControl }));
  };

  const handleToggleHighFidelity = () => {
    updateEffects((prev) => ({ ...prev, highFidelity: !prev.highFidelity }));
  };

  const handleResetDefaults = () => {
    setEffects(DEFAULT_AUDIO_EFFECTS);
    saveAudioEffects(DEFAULT_AUDIO_EFFECTS);
  };

  const activeCount = [
    effects.noiseSuppression,
    effects.echoCancellation,
    effects.autoGainControl,
    effects.highFidelity,
  ].filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Configurar efeitos de áudio da transmissão"
                className={cn(
                  'relative h-8 w-8 rounded-xl border transition-all duration-150 focus-visible:ring-primary',
                  effects.enabled
                    ? 'border-primary/30 bg-primary/10 text-primary shadow-sm hover:border-primary/50 hover:bg-primary/20 hover:text-primary active:scale-95'
                    : 'border-border/40 bg-slate-900/60 text-slate-400 hover:border-border/70 hover:bg-slate-800 hover:text-slate-100 active:scale-95',
                  triggerClassName,
                )}
              >
                <Sparkles className="h-4 w-4" />
                {effects.enabled && (
                  <span
                    className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-slate-950"
                    aria-hidden="true"
                  />
                )}
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">
            {effects.enabled ? `Efeitos de Áudio (${activeCount} ativos)` : 'Efeitos de Áudio (Desativado)'}
          </TooltipContent>
        </Tooltip>
      )}

      <DialogContent className="max-w-md overflow-hidden rounded-2xl border border-border/40 bg-slate-900/95 p-0 text-slate-100 shadow-2xl backdrop-blur-xl sm:max-w-md">
        {/* Luz ambiente superior suave */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-primary/5 to-transparent blur-2xl"
        />

        {/* Header */}
        <div className="relative z-10 border-b border-border/40 px-6 py-5">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-sm">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-base font-semibold tracking-tight text-slate-100 sm:text-lg">
                  Efeitos de Áudio
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-xs text-slate-400">
                  Filtros e processamento em tempo real da transmissão
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col gap-4 px-6 py-5">
          {/* Card Master: Ativar/Desativar todos */}
          <div
            onClick={handleToggleMaster}
            className={cn(
              'flex cursor-pointer items-center justify-between gap-3.5 rounded-xl border p-3.5 transition-all select-none',
              effects.enabled
                ? 'border-primary/40 bg-primary/10 shadow-sm'
                : 'border-border/40 bg-slate-950/40 hover:border-border/70 hover:bg-slate-900/40',
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={cn(
                  'grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition-colors',
                  effects.enabled
                    ? 'border-primary/30 bg-primary/20 text-primary'
                    : 'border-border/40 bg-slate-900 text-slate-400',
                )}
              >
                <Sliders className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-slate-100">
                  Processamento de Áudio
                </span>
                <span className="block text-[11px] leading-4 text-slate-400">
                  {effects.enabled
                    ? 'Filtros ativos aplicados na transmissão'
                    : 'Todos os efeitos temporariamente desativados'}
                </span>
              </div>
            </div>

            <Badge
              variant={effects.enabled ? 'default' : 'secondary'}
              className="text-[10px] font-semibold tracking-wider uppercase shrink-0"
            >
              {effects.enabled ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>

          {/* Lista de Efeitos Individuais */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Filtros Disponíveis
            </span>

            {/* 1. Supressão de Ruído */}
            <label
              htmlFor="effect-noise-suppression"
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all select-none',
                effects.enabled && effects.noiseSuppression
                  ? 'border-border/60 bg-slate-900/60 shadow-sm'
                  : 'border-border/30 bg-slate-950/30 opacity-70 hover:opacity-100',
              )}
            >
              <Checkbox
                id="effect-noise-suppression"
                checked={effects.noiseSuppression}
                disabled={!effects.enabled}
                onCheckedChange={handleToggleNoiseSuppression}
                className="mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-slate-200">
                  Supressão de Ruído
                </span>
                <span className="mt-0.5 block text-[11px] leading-4 text-slate-400">
                  Filtra ruídos contínuos de fundo, ventiladores e cliques do teclado.
                </span>
              </div>
              <VolumeX className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            </label>

            {/* 2. Cancelamento de Eco */}
            <label
              htmlFor="effect-echo-cancellation"
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all select-none',
                effects.enabled && effects.echoCancellation
                  ? 'border-border/60 bg-slate-900/60 shadow-sm'
                  : 'border-border/30 bg-slate-950/30 opacity-70 hover:opacity-100',
              )}
            >
              <Checkbox
                id="effect-echo-cancellation"
                checked={effects.echoCancellation}
                disabled={!effects.enabled}
                onCheckedChange={handleToggleEchoCancellation}
                className="mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-slate-200">
                  Cancelamento de Eco Acústico
                </span>
                <span className="mt-0.5 block text-[11px] leading-4 text-slate-400">
                  Impede microfonia e retorno de som entre alto-falantes e microfones.
                </span>
              </div>
              <Mic className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            </label>

            {/* 3. Ganho Automático */}
            <label
              htmlFor="effect-auto-gain"
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all select-none',
                effects.enabled && effects.autoGainControl
                  ? 'border-border/60 bg-slate-900/60 shadow-sm'
                  : 'border-border/30 bg-slate-950/30 opacity-70 hover:opacity-100',
              )}
            >
              <Checkbox
                id="effect-auto-gain"
                checked={effects.autoGainControl}
                disabled={!effects.enabled}
                onCheckedChange={handleToggleAutoGainControl}
                className="mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-slate-200">
                  Controle Automático de Ganho (AGC)
                </span>
                <span className="mt-0.5 block text-[11px] leading-4 text-slate-400">
                  Equaliza o nível da voz para evitar distorções ou quedas súbitas de volume.
                </span>
              </div>
              <Sliders className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            </label>

            {/* 4. Alta Fidelidade */}
            <label
              htmlFor="effect-high-fidelity"
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all select-none',
                effects.enabled && effects.highFidelity
                  ? 'border-border/60 bg-slate-900/60 shadow-sm'
                  : 'border-border/30 bg-slate-950/30 opacity-70 hover:opacity-100',
              )}
            >
              <Checkbox
                id="effect-high-fidelity"
                checked={effects.highFidelity}
                disabled={!effects.enabled}
                onCheckedChange={handleToggleHighFidelity}
                className="mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-slate-200">
                  Áudio de Alta Fidelidade (48kHz)
                </span>
                <span className="mt-0.5 block text-[11px] leading-4 text-slate-400">
                  Preserva resposta estéreo ampla e dinâmica para transmissão de jogos e músicas.
                </span>
              </div>
              <AudioLines className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-border/40 bg-slate-950/40 px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetDefaults}
            className="h-8 gap-1.5 rounded-xl border border-border/40 bg-slate-900/60 px-3 text-xs font-medium text-slate-300 shadow-sm hover:bg-slate-800 hover:text-slate-100"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Padrões</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-8 gap-1.5 rounded-xl border border-primary/30 bg-primary px-4 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Concluído</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

