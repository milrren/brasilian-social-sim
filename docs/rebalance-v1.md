# 📄 Design Notes: Rebalanceamento V1 (O Fim da "Poverty Trap")

## 1. Contexto e Problema
Durante os testes da V1, identificamos um problema clássico de jogos incrementais: a **Armadilha da Pobreza (Poverty Trap)**. O jogador ficava preso na marca dos R$ 50 e não conseguia progredir para o emprego formal. 

Isso ocorria porque a matemática estava punitiva demais: o ganho manual através de "bicos" não superava o dreno constante do "Custo de Vida" atrelado à lentidão da recuperação de energia. Além disso, a transição para a carteira assinada estava livre de atritos, o que tirava o peso da conquista do primeiro emprego.

---

## 2. Novas Mecânicas Inseridas

### O Custo de Entrada (Upfront Cost)
* **Lógica:** Ninguém consegue um emprego sem gastar antes. Adicionamos a variável de custo inicial para simular gastos com transporte, impressão de currículo e roupas para a entrevista.
* **Impacto no Loop:** O jogador agora tem uma meta financeira clara logo nos primeiros minutos de jogo, impedindo que ele pule direto para a fase *idle* (ganho passivo) sem esforço.
* **Valor Definido:** R$ 150 para a vaga de "Auxiliar de Limpeza".

---

## 3. Rebalanceamento Econômico ("O Sprint da Entrevista")

Para permitir que o jogador alcance os R$ 150 exigidos pelo Custo de Entrada antes de falir, a economia do "Bico" foi ajustada. A nova lógica recompensa o jogador altamente ativo (que clica rápido) no início do jogo.

| Variável | Valor Antigo | Novo Valor | Motivação do Design |
| :--- | :--- | :--- | :--- |
| **Recompensa do Bico** | R$ 5 | **R$ 15** | Aumentar o impacto de cada clique do jogador. |
| **Custo de Energia (Bico)** | 10 | **10** | Mantido para permitir exatos 10 cliques com a barra cheia. |
| **Regeneração de Energia** | 2/seg | **5/seg** | Reduzir o tempo de inatividade forçada (esperar para clicar) no early game. |
| **Custo de Vida** | R$ 1/seg | **R$ 1/seg** | Mantido intacto. A "Mão Invisível" não perdoa. |
| **Energia Máxima** | 100 | **100** | Mantido para forçar o jogador a gerenciar o recurso. |

### A Matemática da Vitória:
Com os novos números, o jogador começa com 100 de Energia. Se ele gastar tudo rapidamente em bicos (10 cliques x R$ 15), ele gera **R$ 150** quase instantaneamente. Isso cria um "Sprint" inicial: o jogador precisa ser rápido nos cliques para pagar a taxa de entrevista antes que o Custo de Vida (R$ 1/seg) devore seu capital.

---

## 4. Próximos Passos (Observações para a V2)
* O motor de Tick (processamento de tempo) continua imutável e seguro contra falhas graças à arquitetura funcional.
* Com a estabilidade financeira garantida pelo primeiro emprego CLT, o próximo dreno de recursos deverá ser o investimento em **Educação (Cursos)**, que consumirá o dinheiro e a energia excedentes gerados pela base idle.