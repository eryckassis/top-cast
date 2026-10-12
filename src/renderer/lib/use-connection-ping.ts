import { useEffect, useState } from 'react';
import type { SignalingClient } from './signaling-client';
import type { SignalingStatus } from '../../shared/types/signaling';

export type PingQuality = 'excellent' | 'medium' | 'critical' | 'disconnected';

export interface ConnectionPingState {
  ping: number | null;
  quality: PingQuality;
  text: string;
  dotColor: string;
  textColor: string;
  iconColor: string;
  tooltipText: string;
}

export function useConnectionPing(
  socket: SignalingClient,
  signalingStatus: SignalingStatus,
): ConnectionPingState {
  const [ping, setPing] = useState<number | null>(null);

  useEffect(() => {
    if (signalingStatus !== 'connected' || !socket.connected) {
      setPing(null);
      return;
    }

    let isMounted = true;

    // 1. Escuta evento nativo de pong do Engine.IO do Socket.IO
    const engine = (socket as unknown as { io?: { engine?: { on: (event: string, fn: (...args: unknown[]) => void) => void; off: (event: string, fn: (...args: unknown[]) => void) => void } } })
      ?.io?.engine;

    const handleEnginePong = (...args: unknown[]) => {
      if (!isMounted) return;
      const latency = args[0];
      if (typeof latency === 'number' && latency > 0) {
        setPing(Math.round(latency));
      }
    };

    if (engine) {
      engine.on('pong', handleEnginePong);
    }

    // 2. Medição periódica via probe HTTP /health com timeout seguro
    const measureProbe = async () => {
      if (!isMounted || !socket.connected || signalingStatus !== 'connected') {
        if (isMounted) setPing(null);
        return;
      }

      const startTime = performance.now();
      try {
        const signalingUrl = import.meta.env.VITE_SIGNALING_URL ?? 'http://127.0.0.1:3001';
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);

        const response = await fetch(`${signalingUrl}/health`, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (response.ok && isMounted) {
          const rtt = Math.round(performance.now() - startTime);
          setPing(Math.max(1, rtt));
        }
      } catch {
        // Se a requisição HTTP direta falhar ou abortar, tenta manter última leitura válida
        if (isMounted && !socket.connected) {
          setPing(null);
        }
      }
    };

    // Mede imediatamente e atualiza a cada 3.5 segundos
    void measureProbe();
    const probeInterval = window.setInterval(measureProbe, 3500);

    return () => {
      isMounted = false;
      window.clearInterval(probeInterval);
      if (engine) {
        engine.off('pong', handleEnginePong);
      }
    };
  }, [socket, signalingStatus]);

  if (signalingStatus !== 'connected' || ping === null) {
    return {
      ping: null,
      quality: 'disconnected',
      text: 'Ping: --',
      dotColor: 'bg-slate-500 animate-pulse',
      textColor: 'text-slate-400',
      iconColor: 'text-slate-400',
      tooltipText: 'Latência indisponível ou reconectando…',
    };
  }

  if (ping < 50) {
    return {
      ping,
      quality: 'excellent',
      text: `Ping: ${ping} ms`,
      dotColor: 'bg-emerald-500',
      textColor: 'text-emerald-500',
      iconColor: 'text-emerald-500',
      tooltipText: `Latência excelente (${ping} ms) · Conexão rápida e estável`,
    };
  }

  if (ping <= 150) {
    return {
      ping,
      quality: 'medium',
      text: `Ping: ${ping} ms`,
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-500',
      iconColor: 'text-amber-500',
      tooltipText: `Latência moderada (${ping} ms) · Transmissão operando normalmente`,
    };
  }

  return {
    ping,
    quality: 'critical',
    text: `Ping: ${ping} ms`,
    dotColor: 'bg-destructive',
    textColor: 'text-destructive',
    iconColor: 'text-destructive',
    tooltipText: `Latência crítica (${ping} ms) · Possível instabilidade na conexão`,
  };
}
