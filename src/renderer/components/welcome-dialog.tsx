import { useState } from 'react';
import { Check, Monitor, Users, Volume2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

export const WELCOME_DISMISSED_STORAGE_KEY = 'topcast:welcome-dismissed';

export function isWelcomeDismissed(): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(WELCOME_DISMISSED_STORAGE_KEY) === 'true';
    }
  } catch {
    // ignore
  }
  return false;
}

export function setWelcomeDismissed(dismissed: boolean): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (dismissed) {
        window.localStorage.setItem(WELCOME_DISMISSED_STORAGE_KEY, 'true');
      } else {
        window.localStorage.removeItem(WELCOME_DISMISSED_STORAGE_KEY);
      }
    }
  } catch {
    // ignore
  }
}

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && dontShowAgain) {
      setWelcomeDismissed(true);
    }
    onOpenChange(nextOpen);
  }

  function handleDismiss() {
    if (dontShowAgain) {
      setWelcomeDismissed(true);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/95 p-0 text-slate-100 shadow-2xl shadow-black/90 backdrop-blur-2xl">
        <div className="relative w-full overflow-hidden">
          {/* Spotlight Gradient de Fundo Superior */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-indigo-500/10 to-transparent blur-2xl"
          />

          {/* Cabeçalho com Tipografia de Alta Qualidade */}
          <div className="relative z-10 px-6 pt-7 pb-4 sm:px-8">
            <DialogHeader className="text-left sm:text-left">
              {/* Título Principal */}
              <DialogTitle className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Sua sala está pronta
              </DialogTitle>

              {/* Descrição com boa hierarquia visual */}
              <DialogDescription className="mt-1.5 text-xs text-slate-400 sm:text-sm">
                Conexão estabelecida com baixa latência e alta fidelidade. Veja como aproveitar o TopCast ao máximo:
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Grid dos 3 Recursos / Passos Principais com Design de Cards Moderno */}
          <div className="relative z-10 px-6 py-3 sm:px-8">
            <div className="grid gap-3">
              {/* Card 1: Compartilhar Tela ou Janela */}
              <div className="group relative flex items-start gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 backdrop-blur-sm transition-all duration-200 hover:border-blue-500/30 hover:bg-slate-900/70 hover:shadow-lg hover:shadow-blue-500/5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                  <Monitor className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-white">
                      1. Compartilhe sua tela ou janela
                    </h4>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Use o botão de transmissão na barra superior para escolher qualquer monitor, janela de jogo ou aplicativo.
                  </p>
                </div>
              </div>

              {/* Card 2: Áudio do Sistema Integrado */}
              <div className="group relative flex items-start gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 backdrop-blur-sm transition-all duration-200 hover:border-blue-500/30 hover:bg-slate-900/70 hover:shadow-lg hover:shadow-blue-500/5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-white">
                      2. Transmissão com áudio.
                    </h4>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    O som do seu computador é capturado e transmitido diretamente com o vídeo, perfeito para jogos e vídeos.
                  </p>
                </div>
              </div>

              {/* Card 3: Convite P2P Instantâneo */}
              <div className="group relative flex items-start gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 backdrop-blur-sm transition-all duration-200 hover:border-blue-500/30 hover:bg-slate-900/70 hover:shadow-lg hover:shadow-blue-500/5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                  <Users className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-white">
                      3. Convide seus amigos
                    </h4>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Copie o código de convite de 6 dígitos no painel lateral. Até 10 participantes podem assistir simultaneamente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé Elegante com Checkbox Discreto e Botão Primário Gradient */}
          <div className="relative z-10 mt-3 flex flex-col items-center justify-between gap-4 border-t border-slate-800/60 bg-slate-900/20 px-6 py-5 sm:flex-row sm:px-8">
            {/* Opção "Não mostrar novamente" com visual refinado */}
            <label className="group flex cursor-pointer items-center gap-2.5 text-xs text-slate-400 transition-colors select-none hover:text-slate-200">
              <span
                onClick={() => setDontShowAgain(!dontShowAgain)}
                className={`grid h-4 w-4 place-items-center rounded-md border transition-all duration-200 ${
                  dontShowAgain
                    ? 'border-blue-500 bg-blue-500 text-white shadow-sm shadow-blue-500/40'
                    : 'border-slate-700 bg-slate-900/80 hover:border-slate-600'
                }`}
              >
                {dontShowAgain && <Check className="h-3 w-3 stroke-[3]" />}
              </span>
              <span onClick={() => setDontShowAgain(!dontShowAgain)}>
                Não mostrar isso novamente
              </span>
            </label>

            {/* Botão de Ação Simples */}
            <Button
              type="button"
              onClick={handleDismiss}
              className="h-9 w-full rounded-xl bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-500 sm:w-auto"
            >
              Vamos começar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
