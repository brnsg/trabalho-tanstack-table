# 📊 Trabalho #2 — Pacotes Extras: Criação de Tabelas (`@tanstack/react-table`)

> **Centro Universitário UniSenac – Campus Pelotas**  
> **Curso:** Tecnologia em Análise e Desenvolvimento de Sistemas  
> **Disciplina:** Programação Full Stack — **Prof. Edécio Fernando Iepsen**  
> **Tema #10:** Criação de Tabelas (TanStack Table / React Table)  
> **Integrantes:** **Brian** e **Guilherme**

### 🌐 [Clique aqui para abrir e testar o Dashboard direto no navegador (GitHub Pages)](https://brnsg.github.io/trabalho-tanstack-table/demo-navegador.html)

---

## 🎯 Visão Geral do Pacote

O **TanStack Table** (`@tanstack/react-table`, evolução do antigo `react-table`) é a principal biblioteca do ecossistema React para criação de tabelas dinâmicas e *DataGrids*.

Seu grande diferencial é o conceito de **Headless UI** (*Interface sem visual fixo*):
- **A Biblioteca cuida da Lógica:** Ordenação de colunas, busca global, filtros específicos, paginação, visibilidade de colunas e seleção de linhas.
- **O Desenvolvedor cuida do Visual:** Você mantém 100% do controle sobre o HTML (`<table>`, `<tr>`, `<td>`) e estiliza livremente com **Tailwind CSS** ou qualquer outro framework CSS, sem ficar preso ao visual engessado de bibliotecas prontas.

---

## 💻 Sobre o Projeto de Exemplo

Para demonstrar o funcionamento prático do pacote, criamos um **Dashboard de Gestão de Estoque e Vendas** contendo:
- **Busca Global:** Pesquisa instantânea em todas as colunas.
- **Filtros Combinados:** Filtro por **Categoria** e por **Status** do estoque.
- **Ordenação Dinâmica:** Clique nos cabeçalhos para ordenar por nome, preço, estoque ou vendas (`▲` / `▼`).
- **Visibilidade de Colunas:** Menu para mostrar ou ocultar colunas em tempo real.
- **Seleção e Paginação:** Seleção de múltiplos itens via *checkbox*, controle de páginas e adição de novos produtos.

### Estrutura Principal
- [`Apresentacao_TanStack_Table_Brian_Guilherme.pptx`](./Apresentacao_TanStack_Table_Brian_Guilherme.pptx) — Slides da apresentação (PowerPoint).
- [`demo-navegador.html`](./demo-navegador.html) — Versão pronta para abrir direto no navegador com duplo clique.
- [`iniciar-demonstracao.bat`](./iniciar-demonstracao.bat) — Script para iniciar a demonstração automaticamente.
- [`src/components/TabelaProdutos.tsx`](./src/components/TabelaProdutos.tsx) — Componente React onde o TanStack Table é configurado (definição das colunas, hook `useReactTable` e renderização com `flexRender`).
- [`src/data/produtos.ts`](./src/data/produtos.ts) — Tipagem TypeScript e lista de produtos de exemplo.
- [`src/App.tsx`](./src/App.tsx) — Tela principal do Dashboard e indicadores.
