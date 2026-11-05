import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  RotateCcw,
  Pencil,
  Trash2,
} from 'lucide-react'
import type { Produto } from '../data/produtos'

interface TabelaProdutosProps {
  dados: Produto[]
  onSalvarEdicaoEmLote: (produtosEditados: Produto[]) => void
  onExcluirSelecionados: (ids: string[]) => void
}

// 1. Criamos o ColumnHelper tipado com a interface Produto
const columnHelper = createColumnHelper<Produto>()

// Formatador de moeda Real Brasileiro (BRL)
const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function calcularStatus(estoque: number): Produto['status'] {
  if (estoque <= 0) return 'Esgotado'
  if (estoque <= 5) return 'Estoque Baixo'
  return 'Disponível'
}

export function TabelaProdutos({
  dados,
  onSalvarEdicaoEmLote,
  onExcluirSelecionados,
}: TabelaProdutosProps) {
  // 2. Estados controlados pelo React e repassados ao TanStack Table
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [mostrarMenuColunas, setMostrarMenuColunas] = useState(false)

  // Estado para o modal de edição em lote (múltiplos produtos selecionados)
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false)
  const [itensEmEdicao, setItensEmEdicao] = useState<Produto[]>([])

  // 3. Definição declarativa das colunas (Headless: definimos dados e formatação, não o estilo fixo)
  const columns = useMemo(
    () => [
      // Coluna de seleção (Checkbox)
      columnHelper.display({
        id: 'selecao',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 cursor-pointer"
            aria-label="Selecionar todos os produtos da tabela"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 cursor-pointer"
            aria-label={`Selecionar ${row.original.nome}`}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }),

      // Coluna Código (ID)
      columnHelper.accessor('id', {
        header: 'Código',
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-indigo-400 bg-indigo-950/60 px-2 py-1 rounded border border-indigo-800/50">
            {info.getValue()}
          </span>
        ),
      }),

      // Coluna Nome do Produto
      columnHelper.accessor('nome', {
        header: 'Produto',
        cell: (info) => (
          <div className="font-medium text-slate-100">{info.getValue()}</div>
        ),
      }),

      // Coluna Categoria
      columnHelper.accessor('categoria', {
        header: 'Categoria',
        filterFn: 'equalsString',
        cell: (info) => (
          <span className="inline-flex items-center rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 border border-slate-700">
            {info.getValue()}
          </span>
        ),
      }),

      // Coluna Preço Unitário (com formatação BRL)
      columnHelper.accessor('preco', {
        header: 'Preço Unitário',
        cell: (info) => (
          <span className="font-semibold text-emerald-400">
            {formatadorMoeda.format(info.getValue())}
          </span>
        ),
      }),

      // Coluna Estoque
      columnHelper.accessor('estoque', {
        header: 'Estoque',
        cell: (info) => {
          const qtd = info.getValue()
          return (
            <span
              className={`font-mono font-medium ${
                qtd === 0
                  ? 'text-rose-400'
                  : qtd <= 5
                    ? 'text-amber-400'
                    : 'text-slate-200'
              }`}
            >
              {qtd} un.
            </span>
          )
        },
      }),

      // Coluna Vendas no Mês
      columnHelper.accessor('vendasMes', {
        header: 'Vendas (Mês)',
        cell: (info) => (
          <span className="text-slate-300">{info.getValue()} vendas</span>
        ),
      }),

      // Coluna Status com Badge Dinâmica
      columnHelper.accessor('status', {
        header: 'Status',
        filterFn: 'equalsString',
        cell: (info) => {
          const status = info.getValue()
          const estilosBadge = {
            Disponível:
              'bg-emerald-950/70 text-emerald-300 border-emerald-700/60',
            'Estoque Baixo':
              'bg-amber-950/70 text-amber-300 border-amber-700/60',
            Esgotado: 'bg-rose-950/70 text-rose-300 border-rose-700/60',
          }
          return (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${estilosBadge[status]}`}
            >
              {status}
            </span>
          )
        },
      }),
    ],
    []
  )

  // 4. Instância principal do TanStack Table (useReactTable)
  const table = useReactTable({
    data: dados,
    columns,
    getRowId: (row) => row.id, // Usa o ID do produto como chave da seleção
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    // Row Models: motores modulares de processamento das linhas
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  })

  // Valores atuais dos filtros de coluna (Categoria e Status)
  const filtroCategoria =
    (table.getColumn('categoria')?.getFilterValue() as string) ?? ''
  const filtroStatus =
    (table.getColumn('status')?.getFilterValue() as string) ?? ''

  const limparFiltros = () => {
    setGlobalFilter('')
    setColumnFilters([])
    setSorting([])
  }

  const idsSelecionados = Object.keys(rowSelection).filter(
    (id) => rowSelection[id]
  )
  const qtdSelecionados = idsSelecionados.length

  const abrirModalEdicao = () => {
    const selecionados = dados
      .filter((p) => rowSelection[p.id])
      .map((p) => ({ ...p }))
    setItensEmEdicao(selecionados)
    setModalEdicaoAberto(true)
  }

  const atualizarCampoItemEdicao = (
    id: string,
    campo: keyof Produto,
    valor: string | number
  ) => {
    setItensEmEdicao((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const atualizado = { ...item, [campo]: valor }
        if (campo === 'estoque') {
          atualizado.status = calcularStatus(Number(valor) || 0)
        }
        return atualizado
      })
    )
  }

  const confirmarEdicaoEmLote = (e: React.FormEvent) => {
    e.preventDefault()
    onSalvarEdicaoEmLote(itensEmEdicao)
    setModalEdicaoAberto(false)
    setRowSelection({})
  }

  const confirmarExclusaoSelecionados = () => {
    if (qtdSelecionados === 0) return
    onExcluirSelecionados(idsSelecionados)
    setRowSelection({})
  }

  return (
    <div className="space-y-4">
      {/* Barra de Ferramentas: Busca Global, Filtros por Coluna e Visibilidade */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-lg">
        {/* Busca Global */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar por nome, código ou categoria..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filtros por Coluna + Visibilidade */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filtro por Categoria */}
          <select
            value={filtroCategoria}
            onChange={(e) =>
              table
                .getColumn('categoria')
                ?.setFilterValue(e.target.value || undefined)
            }
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Todas as Categorias</option>
            <option value="Periféricos">Periféricos</option>
            <option value="Hardware">Hardware</option>
            <option value="Monitores">Monitores</option>
            <option value="Áudio">Áudio</option>
            <option value="Redes">Redes</option>
          </select>

          {/* Filtro por Status */}
          <select
            value={filtroStatus}
            onChange={(e) =>
              table
                .getColumn('status')
                ?.setFilterValue(e.target.value || undefined)
            }
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Todos os Status</option>
            <option value="Disponível">Disponível</option>
            <option value="Estoque Baixo">Estoque Baixo</option>
            <option value="Esgotado">Esgotado</option>
          </select>

          {/* Botão Mostrar/Ocultar Colunas */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMostrarMenuColunas((prev) => !prev)}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg px-3 py-2 text-sm font-medium transition cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              Colunas
            </button>

            {mostrarMenuColunas && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-3 z-20 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800">
                  Exibir Colunas
                </div>
                {table
                  .getAllLeafColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <label
                      key={column.id}
                      className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer hover:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="rounded border-slate-600 bg-slate-800 text-indigo-500"
                      />
                      <span className="capitalize">
                        {typeof column.columnDef.header === 'string'
                          ? column.columnDef.header
                          : column.id}
                      </span>
                    </label>
                  ))}
              </div>
            )}
          </div>

          {/* Botão Limpar Filtros */}
          {(globalFilter || columnFilters.length > 0 || sorting.length > 0) && (
            <button
              type="button"
              onClick={limparFiltros}
              className="inline-flex items-center gap-1.5 bg-rose-950/60 hover:bg-rose-900/70 text-rose-300 border border-rose-800/60 rounded-lg px-3 py-2 text-sm font-medium transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Barra de Ações em Lote quando há linhas selecionadas */}
      {qtdSelecionados > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-950/60 border border-indigo-700/70 text-indigo-100 px-4 py-3 rounded-xl text-sm shadow-lg">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-600 text-white font-bold px-2.5 py-0.5 rounded-full text-xs">
              {qtdSelecionados}
            </span>
            <span>
              {qtdSelecionados === 1
                ? 'produto selecionado para ação'
                : 'produtos selecionados para ação em lote'}
            </span>
            <button
              type="button"
              onClick={() => setRowSelection({})}
              className="text-xs font-semibold text-indigo-300 hover:text-white underline cursor-pointer ml-1"
            >
              Desmarcar todos
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={abrirModalEdicao}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-3.5 py-1.5 rounded-lg text-xs shadow transition cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar Selecionados ({qtdSelecionados})
            </button>

            <button
              type="button"
              onClick={confirmarExclusaoSelecionados}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs shadow transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Excluir Selecionados ({qtdSelecionados})
            </button>
          </div>
        </div>
      )}

      {/* Tabela HTML controlada pelo TanStack Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-slate-800 bg-slate-900/90 text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                {headerGroup.headers.map((header) => {
                  const podeOrdenar = header.column.getCanSort()
                  const direcaoOrdenacao = header.column.getIsSorted()

                  return (
                    <th key={header.id} className="px-4 py-3.5 select-none">
                      {header.isPlaceholder ? null : (
                        <div
                          onClick={header.column.getToggleSortingHandler()}
                          className={`inline-flex items-center gap-1.5 ${
                            podeOrdenar
                              ? 'cursor-pointer hover:text-indigo-400 transition-colors'
                              : ''
                          }`}
                        >
                          {/* flexRender renderiza o cabeçalho definido na coluna */}
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                          {/* Ícone dinâmico de ordenação */}
                          {podeOrdenar && (
                            <span className="text-slate-500">
                              {direcaoOrdenacao === 'asc' ? (
                                <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
                              ) : direcaoOrdenacao === 'desc' ? (
                                <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-slate-800/70 text-sm">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="px-4 py-12 text-center text-slate-400"
                >
                  Nenhum produto encontrado para os filtros aplicados.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    row.getIsSelected()
                      ? 'bg-indigo-950/30 hover:bg-indigo-950/50'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3.5 whitespace-nowrap">
                      {/* flexRender renderiza a célula personalizada da coluna */}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Rodapé de Paginação */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 text-sm text-slate-300">
        <div className="flex items-center gap-3">
          <span>
            Exibindo{' '}
            <strong className="text-white">
              {table.getRowModel().rows.length}
            </strong>{' '}
            de{' '}
            <strong className="text-white">
              {table.getFilteredRowModel().rows.length}
            </strong>{' '}
            registros
          </span>

          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value={50}>Mostrar Todos</option>
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={15}>15 por página</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 mr-2">
            Página{' '}
            <strong className="text-white">
              {table.getState().pagination.pageIndex + 1}
            </strong>{' '}
            de <strong className="text-white">{table.getPageCount() || 1}</strong>
          </span>

          <button
            type="button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            title="Primeira página"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            title="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            title="Próxima página"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            title="Última página"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal Rolável de Edição em Lote (para 1 ou vários produtos selecionados) */}
      {modalEdicaoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            {/* Cabeçalho fixo do Modal */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Editar Produtos Selecionados ({itensEmEdicao.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Role para baixo para visualizar e alterar todos os itens marcados. As alterações ficam salvas no navegador.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalEdicaoAberto(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Corpo Rolável com todos os produtos selecionados */}
            <form
              onSubmit={confirmarEdicaoEmLote}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                {itensEmEdicao.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="font-mono text-xs font-semibold text-indigo-400 bg-indigo-950/70 px-2.5 py-1 rounded border border-indigo-800/50">
                        #{index + 1} • {item.id}
                      </span>
                      <span className="text-xs text-slate-400">
                        Status calculado:{' '}
                        <strong className="text-slate-200">{item.status}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Nome do Produto
                        </label>
                        <input
                          type="text"
                          required
                          value={item.nome}
                          onChange={(e) =>
                            atualizarCampoItemEdicao(
                              item.id,
                              'nome',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Categoria
                        </label>
                        <select
                          value={item.categoria}
                          onChange={(e) =>
                            atualizarCampoItemEdicao(
                              item.id,
                              'categoria',
                              e.target.value as Produto['categoria']
                            )
                          }
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Periféricos">Periféricos</option>
                          <option value="Hardware">Hardware</option>
                          <option value="Monitores">Monitores</option>
                          <option value="Áudio">Áudio</option>
                          <option value="Redes">Redes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Preço Unitário (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={item.preco}
                          onChange={(e) =>
                            atualizarCampoItemEdicao(
                              item.id,
                              'preco',
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Estoque (unidades)
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.estoque}
                          onChange={(e) =>
                            atualizarCampoItemEdicao(
                              item.id,
                              'estoque',
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Vendas no Mês
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.vendasMes}
                          onChange={(e) =>
                            atualizarCampoItemEdicao(
                              item.id,
                              'vendasMes',
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rodapé fixo do Modal */}
              <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-end gap-2.5 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setModalEdicaoAberto(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow cursor-pointer"
                >
                  Salvar Alterações ({itensEmEdicao.length})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
