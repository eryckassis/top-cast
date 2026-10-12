import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Radio,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { LoadingOverlay } from '../components/ui/loading-overlay';
import { VoxelAvatar } from '../components/voxel-avatar';
import { createRoom } from '../lib/room-client';
import { getOrCreateLocalAvatarSeed } from '../lib/voxel-avatar';
import type { RoomSnapshot } from '../../shared/types/signaling';
import type { SignalingClient } from '../lib/signaling-client';

interface CreateRoomPageProps {
  socket: SignalingClient;
  displayName: string;
  onBack: () => void;
  onRoomCreated: (room: RoomSnapshot) => void;
}

const errorMessages: Record<string, string> = {
  ALREADY_IN_ROOM: 'Este cliente já está conectado a uma sala.',
  INVALID_NAME: 'O nome informado não é válido.',
  SERVER_ERROR: 'Não foi possível criar a sala. Verifique se o servidor está ativo e tente novamente.',
};

export default function CreateRoomPage({
  socket,
  displayName,
  onBack,
  onRoomCreated,
}: CreateRoomPageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Avatar seed local persistido para consistência visual
  const avatarSeed = getOrCreateLocalAvatarSeed();

  async function handleCreate() {
    setIsCreating(true);
    setError(null);
    try {
      const result = await createRoom(socket, displayName, avatarSeed);
      if (!result.ok) {
        setError(
          result.error === 'ROOM_EXISTS'
            ? 'Já existe uma sala ativa no momento. Entre usando o código de convite.'
            : errorMessages[result.error] ?? 'Não foi possível criar a sala.',
        );
        return;
      }
      onRoomCreated(result.room);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível conectar ao servidor de salas.',
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="relative flex h-full min-h-full items-center justify-center overflow-x-hidden bg-background px-4 py-6 text-slate-50 sm:px-6 sm:py-8">
      {/* Luz ambiente e textura de fundo alinhadas com a identidade do TopCast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--primary)/0.16),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(hsl(var(--primary))_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035]"
      />

      {/* Card da Tela Intermediária com Design Moderno e Glassmorphism */}
      <section className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 shadow-2xl shadow-black/80 backdrop-blur-2xl sm:p-8">
        {/* Spotlight no topo do card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 left-1/2 h-56 w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-blue-500/5 to-transparent blur-2xl"
        />

        {/* Barra superior com botão Voltar e indicador de Sessão */}
        <div className="relative z-10 mb-6 flex items-center justify-between">
          <button
            type="button"
            disabled={isCreating}
            onClick={onBack}
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Voltar</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Radio className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
            <span>Nova Sessão</span>
          </div>
        </div>

        {/* Cabeçalho Principal */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/5">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Criar uma sala
              </h1>
              <p className="mt-0.5 text-xs text-slate-400">
                Transmissão privada e segura
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
            Vamos preparar uma sala privada. O código de convite será gerado pelo servidor e ficará válido por 24 horas.
          </p>
        </div>

        {/* Card do Anfitrião com Avatar Voxel e Identidade */}
        <div className="relative z-10 mt-5 flex items-center gap-3.5 rounded-2xl border border-slate-800/70 bg-slate-900/50 p-3.5 backdrop-blur-sm">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl ring-2 ring-blue-500/30">
            <VoxelAvatar displayName={displayName} seed={avatarSeed} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Anfitrião da Sala
            </span>
            <span className="block truncate text-sm font-semibold text-white">
              {displayName}
            </span>
          </div>
          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-400 ring-1 ring-blue-500/20">
            Host
          </span>
        </div>

        {/* Grid de Especificações da Sala */}
        <div className="relative z-10 mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-3.5 backdrop-blur-sm transition-colors hover:border-slate-800 hover:bg-slate-900/60">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium">Capacidade</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">10 pessoas</p>
            <p className="mt-0.5 text-[11px] text-slate-400">Assistindo ao vivo</p>
          </div>

          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-3.5 backdrop-blur-sm transition-colors hover:border-slate-800 hover:bg-slate-900/60">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium">Validade</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">24 horas</p>
            <p className="mt-0.5 text-slate-400 text-[11px]">Código temporário</p>
          </div>
        </div>

        {/* Banner de Garantia P2P */}
        <div className="relative z-10 mt-3 flex items-center gap-2.5 rounded-xl border border-slate-800/50 bg-slate-900/30 px-3.5 py-2.5 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>Conexão WebRTC ponto a ponto com baixa latência e transmissão segura.</span>
        </div>

        {/* Mensagem de Erro com Animação e Destaque */}
        {error && (
          <div
            role="alert"
            className="relative z-10 mt-4 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs leading-relaxed text-red-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Botão de Ação Simples */}
        <div className="relative z-10 mt-6">
          <Button
            type="button"
            disabled={isCreating}
            onClick={() => void handleCreate()}
            className="h-9 w-full rounded-xl bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {isCreating ? 'Criando sala…' : 'Criar sala'}
          </Button>

          <p className="mt-3 text-center text-xs text-slate-400">
            {isCreating
              ? 'Conectando ao servidor e gerando seu convite...'
              : 'A sala será criada assim que o servidor confirmar.'}
          </p>
        </div>
      </section>

      {/* Overlay de Carregamento */}
      {isCreating && (
        <LoadingOverlay
          title="Criando sala…"
          description="Configurando sessão de transmissão e gerando código de convite..."
        />
      )}
    </main>
  );
}
