import { useState, useEffect } from 'react'
import { PRODUTOS_INICIAIS, type Produto } from './data/produtos'
import { TabelaProdutos } from './components/TabelaProdutos'
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Plus,
  RotateCcw,
} from 'lucide-react'

const STORAGE_KEY = 'tanstack_table_produtos_brian_guilherme_v1'

export default function App() {
  // Carrega os produtos salvos no localStorage ou usa os dados iniciais
  const [produtos, setProdutos] = useState<Produto[]>(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY)
      if (salvo) {
        const parsed = JSON.parse(salvo)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // fallback se localStorage estiver indisponível
    }
    return PRODUTOS_INICIAIS
  })

  // Sempre que a lista de produtos mudar, salva automaticamente no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos))
    } catch {
      // ignora erro de quota
    }
  }, [produtos])

  const [modalAberto, setModalAberto] = useState(false)
  const [novoNome, setNovoNome] = useState('')
  const [novaCategoria, setNovaCategoria] =
    useState<Produto['categoria']>('Periféricos')
  const [novoPreco, setNovoPreco] = useState('')
  const [novoEstoque, setNovoEstoque] = useState('')

  // Métricas de resumo do Dashboard
  const totalProdutos = produtos.length
  const totalEstoqueCritico = produtos.filter((p) => p.estoque <= 5).length
  const totalVendasMes = produtos.reduce((acc, p) => acc + p.vendasMes, 0)
  const valorEstoqueTotal = produtos.reduce(
    (acc, p) => acc + p.preco * p.estoque,
    0
  )

  const adicionarProduto = (e: React.FormEvent) => {
    e.preventDefault()
    const precoNum = Number(novoPreco) || 0
    const estoqueNum = Number(novoEstoque) || 0

    const statusCalculado: Produto['status'] =
      estoqueNum === 0
        ? 'Esgotado'
        : estoqueNum <= 5
          ? 'Estoque Baixo'
          : 'Disponível'

    const maiorNumeroId = produtos.reduce((max, p) => {
      const num = parseInt(p.id.replace(/\D/g, ''), 10)
      return !isNaN(num) && num > max ? num : max
    }, 0)

    const novoItem: Produto = {
      id: `PRD-${String(maiorNumeroId + 1).padStart(3, '0')}`,
      nome: novoNome,
      categoria: novaCategoria,
      preco: precoNum,
      estoque: estoqueNum,
      vendasMes: 0,
      status: statusCalculado,
      ultimaAtualizacao: new Date().toISOString().split('T')[0],
    }

    setProdutos((prev) => [novoItem, ...prev])
    setNovoNome('')
    setNovoPreco('')
    setNovoEstoque('')
    setModalAberto(false)
  }

  const salvarEdicaoEmLote = (produtosEditados: Produto[]) => {
    const mapaEditados = new Map(produtosEditados.map((p) => [p.id, p]))
    setProdutos((prev) =>
      prev.map((item) => mapaEditados.get(item.id) ?? item)
    )
  }

  const excluirSelecionados = (idsParaExcluir: string[]) => {
    const conjuntoIds = new Set(idsParaExcluir)
    setProdutos((prev) => prev.filter((item) => !conjuntoIds.has(item.id)))
  }

  const restaurarDadosOriginais = () => {
    setProdutos(PRODUTOS_INICIAIS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUTOS_INICIAIS))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Cabeçalho Institucional / Acadêmico */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <span>UniSenac Pelotas • Programação Full Stack</span>
              <span>•</span>
              <span>Tema #10: TanStack Table</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              Dashboard de Gestão de Estoque & Vendas
            </h1>
            <p className="text-sm text-slate-400">
              Integrantes: <strong className="text-slate-200">Brian</strong> e{' '}
              <strong className="text-slate-200">Guilherme</strong> — Prof. Edécio
              Fernando Iepsen
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={restaurarDadosOriginais}
              title="Voltar para os 15 produtos originais"
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium px-3.5 py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar Padrão
            </button>

            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Novo Produto
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Cards de Indicadores (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium">
                Produtos Cadastrados
              </p>
              <p className="text-2xl font-bold text-white">{totalProdutos}</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium">
                Valor em Estoque
              </p>
              <p className="text-xl font-bold text-white">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(valorEstoqueTotal)}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium">
                Vendas no Mês
              </p>
              <p className="text-2xl font-bold text-white">
                {totalVendasMes} un.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium">
                Estoque Baixo / Esgotado
              </p>
              <p className="text-2xl font-bold text-amber-400">
                {totalEstoqueCritico} itens
              </p>
            </div>
          </div>
        </div>

        {/* Componente Principal com TanStack Table */}
        <TabelaProdutos
          dados={produtos}
          onSalvarEdicaoEmLote={salvarEdicaoEmLote}
          onExcluirSelecionados={excluirSelecionados}
        />
      </main>

      {/* Modal para Adicionar Produto em Tempo Real */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white">
              Cadastrar Novo Produto
            </h2>
            <form onSubmit={adicionarProduto} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: SSD Samsung 990 Pro 1TB"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Categoria
                </label>
                <select
                  value={novaCategoria}
                  onChange={(e) =>
                    setNovaCategoria(e.target.value as Produto['categoria'])
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                >
                  <option value="Periféricos">Periféricos</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Monitores">Monitores</option>
                  <option value="Áudio">Áudio</option>
                  <option value="Redes">Redes</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={novoPreco}
                    onChange={(e) => setNovoPreco(e.target.value)}
                    placeholder="499.90"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Estoque (un.)
                  </label>
                  <input
                    type="number"
                    required
                    value={novoEstoque}
                    onChange={(e) => setNovoEstoque(e.target.value)}
                    placeholder="15"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
