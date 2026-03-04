## 📚 Documentação do Jogo (Game Docs)

Como "Brasims" é um simulador incremental com forte base matemática e crítica social, mantemos a documentação de Game Design e Balanceamento estritamente atualizada ao lado do código.

### 1. Game Design Document (GDD)
O arquivo [`GDD.md`](docs/GDD.md) contém a visão geral do jogo "Brasims", detalhando o simulador de ascensão e privilégio brasileiro. Ele é o coração do projeto e a fonte da verdade absoluta para:
* **Pilares de Design:** A luta constante entre ganho passivo e o custo de vida.
* **Core Loop:** O ciclo de sobrevivência envolvendo bicos manuais, educação e gestão de cargos CLT.
* **Privilégio (Prestige):** O sistema onde o jogador reseta o progresso para nascer em uma nova família com vantagens herdadas.
* **O Imprevisto:** O mapeamento de eventos aleatórios e tragédias cotidianas.

*Nota: Este é um documento vivo (Living Document). À medida que avançamos no roadmap (V1 até V5), novas trilhas de carreira, cursos e mecânicas de eventos serão adicionados aqui.*

### 2. Design Notes & Rebalanceamento (Changelogs Lógicos)
A matemática dita a emoção de um jogo Idle. Para evitar que o código vire uma bagunça de "números mágicos", registramos todas as decisões de economia e balanceamento (como o arquivo [`rebalance-v1.md`](docs/rebalanceamento-v1.md)). 
* **O que você encontra aqui:** Histórico de correções de "Poverty Traps" (Armadilhas da Pobreza), ajustes na taxa de regeneração de energia, valores de custo de entrada (Upfront Costs) para empregos e alterações na fórmula do motor de Tick.
* **Por que mantemos isso:** Sempre que precisarmos escalar a dificuldade ou introduzir os multiplicadores do sistema de Prestige, consultaremos este histórico para garantir que a base econômica do jogo permaneça desafiadora, porém justa.

---

## 🚀 Primeiros Passos

Primeiro, faça a isntalação do projeto:

```bash
npm i
```

Depois, execute o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) no seu navegador para ver o resultado.
