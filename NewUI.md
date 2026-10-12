# Refatoração e Padronização de UI/UX & Correções Funcionais

Atue como um Engenheiro Frontend Sênior especializado em UI/UX, acessibilidade e arquitetura de componentes. Seu objetivo é refatorar a interface da aplicação e corrigir comportamentos específicos de controles de mídia, garantindo consistência visual estrita e zero regressão de regras de negócio.

---

### 1. Regras Fundamentais & Integridade Funcional
* **Preservação de Recursos:** Mantenha 100% das funcionalidades, fluxos de dados, estados e contratos de API/WebRTC existentes. Nenhuma funcionalidade deve ser removida, simplificada ou alterada sem instrução explícita.
* **Sistema de Temas:** Preserve e garanta a compatibilidade total com o controle de alternância de temas.
* **Efeito Visual (Waves):** Mantenha o efeito atual de ondas (*waves*), preservando sua curvatura e modelagem, integrando-o de forma fluida e não intrusiva à nova estética.

---

### 2. Correções Críticas de Controles de Transmissão (Player/Stream)

1. **Controle de Volume do Áudio da Stream:**
   * **Visibilidade e Permissão:** Deve ser renderizado e operável **estritamente para quem está assistindo (convidado/viewer)**.
   * **Comportamento:** O controle deslizante (slider) e a ação de mudo (mute/unmute) devem regular localmente a intensidade do áudio do elemento de mídia (`<video>`/`<audio>`) de forma reativa e funcional.
   * **Host/Transmissor:** Não deve exibir este slider para a sua própria transmissão local.

2. **Botão de Modo Tela Cheia (Fullscreen):**
   * **Disponibilidade:** Deve estar visível e funcional para **todos os usuários** (anfitrião e convidados).
   * **Execução:** Implementar a lógica usando a Fullscreen API (`requestFullscreen` e `exitFullscreen`), com tratamento adequado de estados de layout, ícones contextuais (maximizar/minimizar) e suporte a atalhos/fallback de viewport.

---

### 3. Diretrizes de Design & Reconstrução de UI/UX

* **Stack de Componentes Obrigatória:**
  * Uso estrito de **Shadcn UI** para toda a biblioteca de componentes (Buttons, Sliders, Dialogs, Dropdowns, Tooltips, etc.).
  * Conjunto de ícones estritamente padronizado com **Lucide Icons** (com mesmo `stroke-width`, espaçamento e proporção em toda a interface).

* **Linguagem Visual & Estilo:**
  * **Estética:** Moderna, minimalista, limpa e corporativa/profissional.
  * **Efeitos Visuais:** Elimine brilhos excessivos (*glows* pesados, reflexos exagerados ou neon saturado). Prefira elevação sutil com sombras suaves (`shadow-sm`, `shadow-md`), bordas refinadas (`border-border/40`) e desfoques de fundo discretos (`backdrop-blur`).
  * **Microinterações:** Transições e animações sutis e funcionais (máximo 150ms a 200ms com curvas suaves), focadas em feedback claro ao usuário (hover, focus, active).
  * **Consistência Estrita de UI/UX:** Nenhum componente deve destoar do design system. Padronize tipografia, raios de borda (`rounded-*`), paleta semântica e espaçamentos (*spacing scale*).

---

### 4. Critérios de Aceite
1. O convidado consegue alterar o volume e mutar a transmissão recebida sem quebrar a reprodução.
2. O botão de fullscreen expande e restaura a janela/player corretamente para todos os papéis.
3. Toda a UI utiliza componentes primitivos do Shadcn UI com ícones Lucide consistentes.
4. O efeito *waves* e o seletor de temas continuam funcionando perfeitamente sem conflito visual.
5. Os componentes pirncipais, como sidebar, dialogs, toasts/alerts, headers (se existirem), devem ter um efeito glass com um overley ao fundo, garantindo um efeito premium