import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  CircleAlert,
  Copy,
  Dice5,
  Globe,
  Radio,
  RotateCcw,
  Server,
  Users,
} from "lucide-react";
import { Button } from "../components/ui/button";
import GlassSurface from "../components/GlassSurface";
import Topography from "../components/Topography";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { SettingsDialog } from "../components/settings-dialog";
import { VoxelAvatar } from "../components/voxel-avatar";
import {
  generateRandomAvatarSeed,
  getOrCreateLocalAvatarSeed,
  saveLocalAvatarSeed,
} from "../lib/voxel-avatar";
import { APP_NAME } from "../../shared/constants/app";

const DEFAULT_SIGNALING_URL =
  import.meta.env.VITE_SIGNALING_URL ?? "http://127.0.0.1:3001";

const appInfo = window.topCast?.getAppInfo() ?? {
  name: APP_NAME,
  version: "0.1.0",
  electron: "n/a",
  chrome: "n/a",
};

interface HomePageProps {
  notice: string;
  signalingServerUrl: string;
  displayName: string;
  roomIsActive: boolean | null;
  onDisplayNameChange: (name: string) => void;
  onApplySignalingServer: (url: string) => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export default function HomePage({
  notice,
  signalingServerUrl,
  displayName,
  roomIsActive,
  onDisplayNameChange,
  onApplySignalingServer,
  onCreateRoom,
  onJoinRoom,
}: HomePageProps) {
  const [serverInput, setServerInput] = useState(signalingServerUrl);
  const [serverError, setServerError] = useState("");
  const [isCopiedServerUrl, setIsCopiedServerUrl] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState(() =>
    getOrCreateLocalAvatarSeed(),
  );

  const isConnected = roomIsActive !== null;
  const isCustomUrl = signalingServerUrl !== DEFAULT_SIGNALING_URL;
  const isCurrentUrl = serverInput.trim() === signalingServerUrl;

  useEffect(() => setServerInput(signalingServerUrl), [signalingServerUrl]);

  function handleRandomizeAvatar() {
    const nextSeed = generateRandomAvatarSeed();
    saveLocalAvatarSeed(nextSeed);
    setAvatarSeed(nextSeed);
  }

  async function handleCopyServerUrl() {
    try {
      if (window.topCast?.copyToClipboard) {
        await window.topCast.copyToClipboard(signalingServerUrl);
      } else if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(signalingServerUrl);
      }
      setIsCopiedServerUrl(true);
      window.setTimeout(() => setIsCopiedServerUrl(false), 2000);
    } catch {
      // ignore
    }
  }

  function handleRestoreDefault() {
    setServerInput(DEFAULT_SIGNALING_URL);
    setServerError("");
    onApplySignalingServer(DEFAULT_SIGNALING_URL);
  }

  function handleServerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let trimmed = serverInput.trim();
    if (!trimmed) {
      setServerError("Informe um endereço de servidor.");
      return;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `http://${trimmed}`;
    }
    try {
      const url = new URL(trimmed);
      if (
        !["http:", "https:"].includes(url.protocol) ||
        url.username ||
        url.password ||
        (url.pathname !== "/" && url.pathname !== "") ||
        url.search ||
        url.hash
      ) {
        throw new Error(
          "Informe um endereço HTTP(S) com host e porta (ex: http://192.168.1.20:3001).",
        );
      }
      setServerError("");
      setServerInput(url.origin);
      onApplySignalingServer(url.origin);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Informe um endereço válido, como http://192.168.1.20:3001.",
      );
    }
  }

  return (
    <main className="relative flex h-full min-h-full flex-col items-center justify-start overflow-x-hidden overflow-y-auto bg-background px-5 py-8 text-slate-50 sm:px-8 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Topography className="h-full w-full" />
      </div>

      {/* Botão de Configurações com Glass Effect */}
      <div className="absolute right-4 top-4 z-20 [-webkit-app-region:no-drag] sm:right-6 sm:top-6">
        <SettingsDialog />
      </div>

      <div className="relative z-10 my-auto w-full max-w-[520px]">
        {/* Identidade do App */}
        <header className="mb-6 flex items-center justify-center gap-2.5 [-webkit-app-region:drag]">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
            <Radio className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            {appInfo.name}
          </span>
          <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            Beta
          </span>
        </header>

        {/* Perfil do Usuário com Efeito Glass */}
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={16}
          backgroundOpacity={0}
          mixBlendMode="normal"
          className="mt-7 w-full border border-border/40 shadow-md"
        >
          <div className="w-full p-2">
            <label
              htmlFor="display-name"
              className="mb-2.5 block text-left text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Seu Perfil
            </label>
            <div className="flex items-center gap-3">
              {/* Avatar DiceBear Voxel Art */}
              <div
                className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-slate-950/80 shadow-inner ring-1 ring-border/50"
                aria-label={`Avatar de ${displayName || "Você"}`}
              >
                <VoxelAvatar
                  displayName={displayName || "Você"}
                  seed={avatarSeed}
                />
              </div>

              {/* Botão de dado para sortear avatar */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleRandomizeAvatar}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-slate-950/70 text-slate-400 shadow-sm transition-colors duration-150 hover:border-border/80 hover:bg-slate-800/70 hover:text-slate-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label="Sortear outro avatar"
                    >
                      <Dice5 className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Sortear avatar</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Input do nome */}
              <div className="min-w-0 flex-1">
                <input
                  id="display-name"
                  type="text"
                  autoComplete="nickname"
                  maxLength={32}
                  value={displayName}
                  onChange={(event) =>
                    onDisplayNameChange(event.currentTarget.value)
                  }
                  placeholder="Como as pessoas devem chamar você?"
                  className="h-11 w-full rounded-xl border border-border/40 bg-slate-950/80 px-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>
            </div>
            <p className="mt-2 text-left text-xs text-slate-400">
              Sem cadastro ou conta. Seu nome e avatar ficam salvos neste
              dispositivo.
            </p>
          </div>
        </GlassSurface>

        {/* Ações da sala */}
        <section aria-label="Ações da sala" className="mt-4 grid gap-3">
          {(() => {
            const isNameEmpty = displayName.trim().length === 0;
            const createRoomTooltipText = roomIsActive
              ? "Já existe uma sala ativa no momento"
              : roomIsActive === null
                ? "Conectando ao servidor de salas"
                : isNameEmpty
                  ? "Informe um nome de exibição para criar uma sala"
                  : null;

            if (createRoomTooltipText) {
              return (
                <GlassSurface
                  width="100%"
                  height="auto"
                  borderRadius={16}
                  backgroundOpacity={0}
                  mixBlendMode="normal"
                  className="w-full border border-border/40 shadow-sm"
                >
                  <div className="w-full -m-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="block" tabIndex={0}>
                            <Button
                              type="button"
                              variant="outline"
                              disabled={true}
                              className="group relative h-auto w-full justify-between rounded-2xl border border-transparent bg-transparent p-4 text-left text-slate-100 opacity-50 cursor-not-allowed"
                            >
                              <span className="flex items-center gap-3.5">
                                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                                  <Radio className="h-5 w-5" />
                                </span>
                                <span>
                                  <span className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-white">
                                      Criar sala
                                    </span>
                                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                      Host
                                    </span>
                                  </span>
                                  <span className="mt-0.5 block text-xs text-slate-400">
                                    Inicie uma transmissão privada
                                  </span>
                                </span>
                              </span>
                              <ArrowRight className="h-4 w-4 shrink-0 text-slate-500" />
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {createRoomTooltipText}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </GlassSurface>
              );
            }

            return (
              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={16}
                backgroundOpacity={0}
                mixBlendMode="normal"
                className="w-full border border-border/40 shadow-sm"
              >
                <div className="w-full -m-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={false}
                    onClick={onCreateRoom}
                    className="group relative h-auto w-full justify-between rounded-2xl border border-transparent bg-transparent p-4 text-left text-slate-100 transition-all duration-150 hover:border-primary/40 hover:bg-slate-900/30 focus-visible:ring-primary"
                  >
                    <span className="flex items-center gap-3.5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                        <Radio className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            Criar sala
                          </span>
                          <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            Host
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-400">
                          Inicie uma transmissão privada
                        </span>
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 group-hover:text-slate-300" />
                  </Button>
                </div>
              </GlassSurface>
            );
          })()}

          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={16}
            backgroundOpacity={0}
            mixBlendMode="normal"
            className="w-full border border-border/40 shadow-sm"
          >
            <div className="w-full -m-2">
              <Button
                type="button"
                variant="outline"
                disabled={displayName.trim().length === 0}
                onClick={onJoinRoom}
                className="group relative h-auto w-full justify-between rounded-2xl border border-transparent bg-transparent p-4 text-left text-slate-100 transition-all duration-150 hover:border-primary/40 hover:bg-slate-900/30 focus-visible:ring-primary disabled:opacity-50"
              >
                <span className="flex items-center gap-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border/40 bg-slate-800 text-slate-200 transition-colors group-hover:bg-slate-700 group-hover:text-white">
                    <Users className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        Entrar com código
                      </span>
                      <span className="rounded-full border border-border/40 bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                        Convidado
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-400">
                      Conecte-se a uma sala existente com código de 6 dígitos
                    </span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 group-hover:text-slate-300" />
              </Button>
            </div>
          </GlassSurface>
        </section>

        {/* Seção Servidor de Salas com Glass Styling */}
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={16}
          backgroundOpacity={0}
          mixBlendMode="normal"
          className="mt-5 w-full border border-border/40 shadow-md"
        >
          <section
            aria-labelledby="server-section-title"
            className="w-full -m-2 p-4 sm:p-5"
          >
            {/* Header com status online/conectando */}
            <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${
                    isConnected
                      ? "border-emerald-500  text-emerald-400"
                      : "border-amber-500/20 bg-amber-500/10 text-amber-300 animate-pulse"
                  }`}
                >
                  <Server className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h2
                    id="server-section-title"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                  >
                    Servidor de Salas
                  </h2>
                  <p className="truncate text-xs text-slate-400">
                    {isConnected
                      ? "Sinalização pronta para conexões"
                      : "Tentando estabelecer conexão…"}
                  </p>
                </div>
              </div>

              {/* Badge de status */}
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${
                    isConnected
                      ? "border-emerald-500/20 bg-emerald-500/15 text-emerald-300"
                      : "border-amber-500/20 bg-amber-500/15 text-amber-300"
                  }`}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    {isConnected ? (
                      <>
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </>
                    ) : (
                      <>
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                      </>
                    )}
                  </span>
                  {isConnected ? "Online" : "Conectando"}
                </span>
              </div>
            </div>

            {/* Formulário com Input */}
            <form onSubmit={handleServerSubmit} className="mt-3.5">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Globe className="h-4 w-4" />
                  </div>
                  <input
                    id="signaling-server"
                    type="text"
                    required
                    value={serverInput}
                    onChange={(event) => {
                      setServerInput(event.currentTarget.value);
                      if (serverError) setServerError("");
                    }}
                    placeholder="http://127.0.0.1:3001 ou http://192.168.1.x:3001"
                    autoComplete="url"
                    className="h-10 w-full rounded-xl border border-border/40 bg-slate-950/80 pl-9 pr-10 font-mono text-xs text-slate-100 outline-none placeholder:text-slate-600 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm transition-colors"
                  />

                  {/* Botão de copiar endereço */}
                  <div className="absolute inset-y-0 right-1 flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={handleCopyServerUrl}
                            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                            aria-label="Copiar endereço do servidor"
                          >
                            {isCopiedServerUrl ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {isCopiedServerUrl
                            ? "Endereço copiado!"
                            : "Copiar endereço"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Botão Aplicar / Conectar */}
                <Button
                  type="submit"
                  disabled={isCurrentUrl && !serverError}
                  className={`h-10 shrink-0 gap-1.5 rounded-xl px-4 font-medium transition-all ${
                    isCurrentUrl && !serverError
                      ? "bg-slate-800/60 text-slate-400"
                      : "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  }`}
                >
                  {isCurrentUrl && !serverError ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Ativo</span>
                    </>
                  ) : (
                    <>
                      <Radio className="h-3.5 w-3.5" />
                      <span>Conectar</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Mensagem de Erro */}
              {serverError && (
                <p
                  role="alert"
                  className="mt-2.5 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-400/10 px-3 py-2 text-xs leading-5 text-red-200"
                >
                  <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                  <span>{serverError}</span>
                </p>
              )}

              {/* Rodapé com dicas */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  Para rede local, use o IP deste computador (ex:{" "}
                  <code className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-[11px] text-slate-300">
                    192.168.1.x:3001
                  </code>
                  ).
                </span>

                {isCustomUrl && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={handleRestoreDefault}
                          className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline text-[11px]"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Restaurar padrão
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Redefinir para o servidor local padrão (
                        {DEFAULT_SIGNALING_URL})
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </form>
          </section>
        </GlassSurface>

        {notice && (
          <p
            role="status"
            className="mt-4 rounded-xl border border-amber-400/20 bg-amber-300/[0.05] px-4 py-3 text-center text-sm text-amber-100"
          >
            {notice}
          </p>
        )}

        <footer className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
          <span>{appInfo.name}</span>
          <span aria-hidden="true">·</span>
          <span>Versão Beto cabeça {appInfo.version}</span>
        </footer>
      </div>
    </main>
  );
}
