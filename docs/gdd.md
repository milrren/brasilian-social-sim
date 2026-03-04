# 📄 GDD: Brasims — Sobrevivendo ao Brasil

## 1. Visão Geral

**Título Provisório:** Brasims: O Simulador de Ascensão (e Privilégio) Brasileiro.

**Gênero:** Incremental / Idle / Social Simulation.

**Plataforma:** Browser (Web).

**Stack Técnica:** Next.js (Frontend), Node.js (Backend/API), TypeScript (Typing), Ramda (Lógica Funcional/Estado).

### Resumo

Um jogo idle onde o jogador começa na base da pirâmide social brasileira, realizando "bicos" manuais para sobreviver, com o objetivo de ascender profissionalmente através de estudos e empregos CLT. O diferencial reside no sistema de **Privilégio Social (Prestige)**, que evidencia como condições de nascimento facilitam a progressão.

---

## 2. Pilares de Design

1. **A Vida é um Tique-Taque:** O tempo passa, a fome aperta e as contas chegam. O ganho passivo deve sempre lutar contra o custo de vida passivo.
2. **Escolhas de Carreira > Pontos de Upgrade:** Em vez de "upar" um trabalho, o jogador escolhe trocar de cargo baseado em benefícios (VR, VT, Plano de Saúde) e requisitos (Cursos, XP).
3. **Comentário Social Mecânico:** O jogo usa a matemática para demonstrar desigualdade através do sistema de Prestige.

---

## 3. Recursos e Economia

* **Dinheiro (R$):** Moeda principal para sobrevivência e investimentos.
* **Energia (⚡):** Recurso regenerável usado para ações manuais (cliques) e estudo.
* **Experiência (XP):** Acumulada passivamente enquanto empregado em áreas específicas.
* **Pontos de Privilégio (PP):** Moeda de prestígio ganha ao "renascer" (Reset).

---

## 4. O Ciclo do Jogo (Core Loop)

1. **Brasims Manual:** Clicar para realizar bicos (ex: vender brigadeiro). Consome energia, gera pouco dinheiro.
2. **Educação & Qualificação:** Gastar energia/dinheiro em cursos (SENAI, Faculdade). Desbloqueia novas vagas no mercado.
3. **Gestão de Cargo:** Decidir quando trocar de emprego. Um emprego CLT gera ganho passivo, mas exige requisitos.
4. **Sobrevivência:** O "Tick" do jogo deduz custos (Aluguel, Comida). Benefícios como VR e VT anulam esses custos.
5. **Aposentadoria (Prestige):** Resetar o progresso para nascer em uma "nova família" com privilégios herdados.

---

## 5. Arquitetura Técnica Sugerida

* **Estado (State):** Objeto único e imutável representando o `PlayerState`.
* **Transformações (Ramda):** Uso de `R.evolve`, `R.pipe` e `R.lens` para processar cada segundo (Tick) do jogo sem efeitos colaterais.
* **Tipagem (TypeScript):** Interfaces rigorosas para `Job`, `Course`, `Privilege` e `Modifier`.
* **Tick Engine:** Um `setInterval` ou `requestAnimationFrame` que dispara ações de atualização de estado baseadas no tempo decorrido (Delta Time).

---

## 6. Sistema de Privilégios (Prestige)

Ao resetar, o jogador gasta **PP** em modificadores permanentes:

* **"Contatos do Pai":** Reduz exigência de XP para cargos de gerência em 50%.
* **"Inglês de Berço":** Bônus multiplicador em cargos de multinacional.
* **"Bairro Nobre":** Começa com "Carro Próprio" (elimina custo de transporte e fadiga de deslocamento).

---

## 7. Sistema de Eventos: "O Imprevisto"

Eventos aleatórios que ocorrem baseados em probabilidade por "Tick" ou gatilhos específicos.

### 7.1. Categorias de Eventos

1. **A Fezinha (Investimento de Risco):**
* *Mecânica:* O jogador gasta R$ e tem uma chance mínima (Ex: 0.0001%) de um retorno massivo.
* *Exemplos:* Loteria Federal, Jogo do Bicho, "Investir em Cripto de Cachorro".


2. **Dia de Sorte (Bônus Ocasionais):**
* *Mecânica:* Modificadores positivos temporários ou ganhos instantâneos.
* *Exemplos:* "Ônibus passou vazio" (Bônus de Energia), "Achou R$ 50 no bolso da calça", "Trânsito livre".


3. **O Perrengue (Tragédias e Gastos):**
* *Mecânica:* Débitos instantâneos ou debuffs de ganho/energia por tempo determinado.
* *Exemplos:* "Vazamento no banheiro" (Custo imediato), "Gripe Forte" (-50% de ganho de energia por 5 min), "Morte de parente" (Custo de funeral e debuff de produtividade).

---

## 8. Roadmap de Desenvolvimento

* **V1 (MVP):** Sistema de bico manual, 1 trilha de emprego (CLT simples) e custo de vida básico.
* **V2 (Educação):** Implementação de cursos e requisitos para troca de cargos.
* **V3 (O Imprevisto):** Sistema de eventos aleatórios, sorte/azar e a mecânica de "Fezinha".
* **V4 (Prestige):** Sistema de reset e loja de privilégios.
* **V5 (Polimento):** UI inspirada em apps de banco/RH e efeitos sonoros de "notificação de boleto".

---
