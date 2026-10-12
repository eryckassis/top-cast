# Implementação: Status de Conexão (Ping) & Botão de Efeitos de Áudio na Sidebar

Atue como Engenheiro Frontend Sênior especializado em UI/UX, focado em estender a interface sem quebrar o layout e mantendo a identidade visual atual da aplicação. Implemente de forma nativa e reativa o status de conexão e o botão de efeitos de áudio na barra lateral (Sidebar) existente.

---

### 1. Regras de Design, Consistência e Frameworks
* **Stack Obrigatória:** Utilize estritamente Shadcn UI (para componentes, botões e tooltips) e Lucide Icons (com `stroke-width` e tamanho condizentes ao padrão já estabelecido na barra lateral).
* **Identidade Visual:** Respeite o design moderno, minimalista, limpo e profissional da aplicação. Garanta conformidade total com o controle de temas (Dark/Light mode), usando as mesmas variáveis de cor, transições suaves, sombras sutis e bordas refinadas.
* **Sem Regressão:** Não remova ou altere nenhuma funcionalidade, botão ou item de navegação que já existam na sidebar. Integração deve ser fluida e natural.

---

### 2. Status de Conexão (Ping / Latência)
* **Objetivo:** Adicionar um indicador visual e de texto discreto, reativo e em tempo real sobre a qualidade da conexão na Sidebar (preferencialmente na parte inferior/footer ou próximo às informações de status, preservando a hierarquia).
* **UI/UX do Indicador:**
  * **Ícone (Lucide):** `Activity`, `Wifi`, ou `Signal` (tamanho pequeno, ex: `14px` ou `16px`).
  * **Texto:** "Ping: {valor} ms" (fonte pequena `text-xs`, discreta, cor secundária/muted).
  * **Status de Cor (Semântica):** O ícone ou um pequeno ponto (*badge* ou *dot*) deve mudar de cor de acordo com a latência estimada/simulada ou real:
    * **Excelente (< 50ms):** Verde sutil (`text-emerald-500` / `bg-emerald-500`).
    * **Médio (50ms - 150ms):** Amarelo/Laranja sutil (`text-amber-500` / `bg-amber-500`).
    * **Crítico (> 150ms ou desconectado):** Vermelho sutil (`text-destructive`).
  * Adicione um estado de carregamento/reconexão sutil se o status estiver indisponível.

---

### 3. Ícone/Botão de Efeitos de Áudio
* **Objetivo:** Inserir um botão de ícone de fácil acesso para ativar, desativar ou configurar efeitos de áudio.
* **Posicionamento:** Na Sidebar, idealmente agrupado com outros controles de mídia, utilitários ou no footer de ações.
* **UI/UX do Botão:**
  * **Componente:** Shadcn `Button` com a variante `ghost` ou `outline` (arredondado/circular para condizer com os demais ícones interativos), de tamanho pequeno.
  * **Ícones Sugeridos (Lucide):** `Sparkles`, `Wand2`, `AudioLines`, `Equalizer`, ou `Sliders` (com ferramenta de dica/tooltip "Efeitos de Áudio" ou "Audio Effects" ao passar o mouse).
  * **Interação:**
    * Garanta microinterações suaves de hover (esmaecimento/elevação leve) e active compatíveis com o restante da interface.
    * O botão deve funcionar como um gatilho para ativar/desativar um efeito (ex: alterar o estado do ícone ou coloração ao estar ativo) ou para abrir um modal/popover lateral compacto (Shadcn `Dialog` ou `Popover`) onde as configurações de efeito de áudio estariam localizadas.
  * **Acessibilidade:** Inclua propriedades `aria-label` e suporte de teclado (foco visual).

---

### 4. Critérios de Entrega e Validação
1. Os novos elementos foram encaixados sem deformar ou quebrar o scroll e o espaçamento (gap) da Sidebar atual.
2. O ping simula ou reflete a latência real de forma responsiva.
3. O botão de efeitos de áudio interage perfeitamente em ambos os temas Dark e Light, integrando-se sem destoar visualmente.
4. Nenhuma outra parte ou recurso da barra lateral foi danificada ou modificada de forma indesejada.