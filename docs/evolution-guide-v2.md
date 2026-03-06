# 📄 Design Notes: Evolution Guide V2 (Implementações Consolidadas)

## 1. Objetivo deste Documento
Este documento consolida **todas as melhorias implementadas** após o rebalanço inicial, com foco em:
- registrar decisões de design e regras atuais;
- mapear onde cada regra está no código;
- guiar futuras IAs no planejamento e evolução do jogo sem regressões.

---

## 2. Linha de Evolução (Resumo)
A evolução do jogo foi conduzida em 4 frentes principais:
1. **UX/UI e Navegação por Menus** (modais/painéis por contexto);
2. **Persistência e Continuidade** (autosave, resume, progresso offline);
3. **Economia e Progressão** (novos cursos/empregos, custo de vida dinâmico);
4. **Sistema de Melhoria de Vida** (custos, bônus, background, ativação/remoção).

---

## 3. Melhorias Implementadas

### 3.1. Interface e Estrutura de Menus

#### A) Painéis por menu superior
- Educação e Empregos saíram de painéis fixos no layout principal.
- Passaram a ser acessados por botões no topo, com abertura em painel adaptativo:
  - **Desktop**: sidepanel fixo à direita;
  - **Mobile**: modal central.

#### B) Novo menu de Melhoria de Vida
- Menu dedicado para upgrades de estilo de vida.
- Exibe investimento, impacto em custo de vida e bônus (quando aplicável).
- Permite adquirir e remover melhorias.

#### C) Novo menu de Informações Gerais
- Tela de observabilidade da economia em tempo real:
  - ganhos por segundo;
  - custo de vida detalhado;
  - progresso líquido por segundo;
  - energia detalhada (base, bônus, consumo, saldo);
  - estado atual e multiplicador offline.

#### D) Ajustes de UX
- Indicadores de oportunidades disponíveis nos botões (badge vermelho com contador).
- Remoção de efeitos animados dos badges (contador estático).
- Correção de z-index/sticky no header de modal/sidepanel para manter botão fechar clicável após scroll.
- Ajuste de layout textual em cards para evitar quebra de linha em valores monetários e métricas.

---

### 3.2. Persistência, Save/Resume e Offline

#### A) Autosave
- Salva estado em `localStorage` periodicamente (intervalo ampliado para 15s).
- Salva também no `beforeunload` para reduzir perda no fechamento da aba.

#### B) Estrutura de persistência versionada
- Save atual segue formato:
  - `version`, `savedAt`, `state`.
- Compatibilidade com saves legados preservada via fallback/migração leve.

#### C) Progresso offline
- Ao retornar, o jogo aplica progresso offline em **20%** do equivalente online.
- Afeta:
  - dinheiro (salário - custo de vida),
  - energia (recuperação - consumo de trabalho).

#### D) Avisos e feedback
- Indicador de autosave foi reduzido para visual discreto (ícone).
- Aviso de progresso offline ao retornar com resumo de impacto.

---

### 3.3. Economia e Progressão de Jogo

#### A) Progresso por segundo no HUD
- No topo do jogo, substituição de “somente custo de vida” por:
  - **Progresso: ganhos - custo de vida por segundo** (dinâmico).

#### B) Expansão de cursos
- Foram adicionados:
  - `excel-produtivo`;
  - `logica-programacao`.

#### C) Expansão de empregos
- Foram adicionados:
  - `op-sistemas`;
  - `analista-jr`.

#### D) Progressão desafiadora
- Requisitos encadeados de cursos para vagas melhores.
- Custos de entrevista e consumo de energia mais altos em cargos avançados.

---

### 3.4. Sistema de Melhoria de Vida (Regra Atual)

#### A) Mecânica base
- Melhorias de vida adicionam custo contínuo (`additionalCostOfLivingPerTick`).
- Algumas melhorias também oferecem bônus de recuperação de energia.

#### B) Melhoria com bônus de energia
- `dieta-saudavel` adiciona `+2` recuperação de energia por segundo.
- Exemplo de equilíbrio vigente:
  - trabalho com consumo `6` + recuperação base `5` + dieta `+2` = saldo `+1` energia/s.

#### C) Ativação e remoção
- Melhorias podem ser **adquiridas** e também **removidas** para correção de estratégia.
- Remoção não prevê reembolso na implementação atual.

#### D) Regra de background (visual)
- O fundo do jogo é alterado **apenas por moradia** ativa com `backgroundAsset`.
- Quando há mais de uma moradia ativa, prevalece a de **maior valor (`upfrontCost`)**.
- Sem moradia ativa com asset, fallback visual: `room-perrengue`.

---

## 4. Mapa Técnico (Onde está cada regra)

### 4.1. Estado e Tipos
- `src/core/types/index.ts`
  - `PlayerState` (inclui `activeLifeUpgrades`)
  - `LifeUpgrade` (inclui `energyRegenBonusPerTick` opcional)

### 4.2. Catálogo de dados
- `src/core/constants/index.ts`
  - cursos, empregos, melhorias de vida, parâmetros de loop/energia/offline.

### 4.3. Mecânicas centrais
- `src/core/state/actions.ts`
  - `fazerBico`, `fazerCurso`, `assinarCarteira`, `comprarMelhoriaVida`, `removerMelhoriaVida`.
- `src/core/state/tick.ts`
  - aplicação de ganhos/custos e energia por tick online.
- `src/core/state/lifeUpgrades.ts`
  - custo de vida total, bônus de energia, seleção de background por moradia.
- `src/core/state/economy.ts`
  - ganhos, progresso líquido e breakdown de energia por segundo.

### 4.4. Persistência e offline
- `src/app/hooks/useLocalStoragePersistence.ts`
  - save versionado + autosave + cálculo offline + migração de save legado.
- `src/app/hooks/useAutosaveIndicator.ts`
  - reação visual ao evento de autosave.

### 4.5. UI de menus e painéis
- `src/app/page.tsx`
  - HUD, menus, indicadores e composição geral de painéis.
- `src/app/components/AdaptivePanel.tsx`
  - sidepanel desktop / modal mobile.
- `src/app/components/GeneralInfoPanel.tsx`
  - observabilidade econômica.
- `src/app/components/LifeUpgradesPanel.tsx`
  - gestão de melhorias (comprar/remover).

---

## 5. Regras Funcionais Atuais (Checklist para futuras IAs)

1. **Progresso líquido por segundo** é sempre `ganho do emprego - custo de vida total`.
2. **Custo de vida total** = custo base + soma de melhorias ativas.
3. **Energia total por segundo** = recuperação base + bônus de melhorias - consumo do emprego.
4. **Offline progress** aplica somente `20%` do que ocorreria online.
5. **Background** depende apenas de moradia ativa com asset (maior valor vence).
6. **Melhoria de vida** pode ser adquirida e removida pelo jogador.

---

## 6. Pendências e Oportunidades de Evolução

### Curto prazo
- Definir política de reembolso parcial ao remover melhoria (se desejado).
- Exibir histórico de mudanças econômicas (timeline por ações-chave).
- Normalizar formatação de números para locale pt-BR.

### Médio prazo
- Introduzir “custos de manutenção variáveis” por categoria de melhoria.
- Regras exclusivas por categoria (ex.: apenas 1 moradia ativa por vez, com troca automática).
- Eventos que impactem temporariamente custo de vida/energia.

### Longo prazo
- Prestige/Privilégio social integrado ao sistema de melhorias.
- Simulação de inflação/mercado e reajuste de custos salariais.

---

## 7. Diretriz de Implementação para próximas IAs
Para qualquer evolução futura, priorizar a ordem:
1. **Atualizar tipagem (`types`)**;
2. **Atualizar catálogo (`constants`)**;
3. **Atualizar mecânica (`state`)**;
4. **Atualizar persistência/migração (`hooks`)**;
5. **Atualizar UI de leitura/controle (`components/page`)**;
6. **Validar build e consistência de save legacy**.

Esse fluxo reduz quebra de estado, evita regressão de persistência e mantém observabilidade coerente no menu de informações gerais.
