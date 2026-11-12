/**
 * Tipagem dos dados que serão exibidos na tabela.
 * O TanStack Table utiliza TypeScript nativamente para garantir segurança de tipos
 * na definição das colunas e no acesso às células.
 */
export interface Produto {
  id: string
  nome: string
  categoria: 'Periféricos' | 'Hardware' | 'Monitores' | 'Áudio' | 'Redes'
  preco: number
  estoque: number
  vendasMes: number
  status: 'Disponível' | 'Estoque Baixo' | 'Esgotado'
  ultimaAtualizacao: string
}

export const PRODUTOS_INICIAIS: Produto[] = [
  {
    id: 'PRD-001',
    nome: 'Teclado Mecânico Sem Fio Keychron K2',
    categoria: 'Periféricos',
    preco: 689.90,
    estoque: 34,
    vendasMes: 48,
    status: 'Disponível',
    ultimaAtualizacao: '2026-10-28',
  },
  {
    id: 'PRD-002',
    nome: 'Mouse Gamer Logitech G Pro X Superlight',
    categoria: 'Periféricos',
    preco: 749.00,
    estoque: 18,
    vendasMes: 62,
    status: 'Disponível',
    ultimaAtualizacao: '2026-10-29',
  },
  {
    id: 'PRD-003',
    nome: 'Monitor Dell UltraSharp 27" 4K USB-C',
    categoria: 'Monitores',
    preco: 3499.00,
    estoque: 4,
    vendasMes: 15,
    status: 'Estoque Baixo',
    ultimaAtualizacao: '2026-10-25',
  },
  {
    id: 'PRD-004',
    nome: 'Placa de Vídeo RTX 4070 Super 12GB',
    categoria: 'Hardware',
    preco: 4299.90,
    estoque: 0,
    vendasMes: 29,
    status: 'Esgotado',
    ultimaAtualizacao: '2026-10-30',
  },
  {
    id: 'PRD-005',
    nome: 'Processador AMD Ryzen 7 7800X3D',
    categoria: 'Hardware',
    preco: 2890.00,
    estoque: 12,
    vendasMes: 41,
    status: 'Disponível',
    ultimaAtualizacao: '2026-10-27',
  },
  {
    id: 'PRD-006',
    nome: 'Headset HyperX Cloud III Wireless',
    categoria: 'Áudio',
    preco: 849.90,
    estoque: 25,
    vendasMes: 33,
    status: 'Disponível',
    ultimaAtualizacao: '2026-10-24',
  },
  {
    id: 'PRD-007',
    nome: 'SSD NVMe Kingston Fury Renegade 2TB',
    categoria: 'Hardware',
    preco: 1099.00,
    estoque: 5,
    vendasMes: 54,
    status: 'Estoque Baixo',
    ultimaAtualizacao: '2026-10-29',
  },
  {
    id: 'PRD-008',
    nome: 'Monitor LG UltraGear 24" 144Hz IPS',
    categoria: 'Monitores',
    preco: 1149.00,
    estoque: 22,
    vendasMes: 39,
    status: 'Disponível',
    ultimaAtualizacao: '2026-10-26',
  },
  {
    id: 'PRD-009',
    nome: 'Roteador TP-Link Archer AX73 Wi-Fi 6',
    categoria: 'Redes',
    preco: 629.00,
    estoque: 14,
    vendasMes: 19,
    status: 'Disponível',
    ultimaAtualizacao: '2026-10-21',
  },
  {
    id: 'PRD-010',
    nome: 'Microfone Condensador Fifine AM8 USB/XLR',
    categoria: 'Áudio',
    preco: 379.90,
    estoque: 0,
    vendasMes: 45,
    status: 'Esgotado',
    ultimaAtualizacao: '2026-10-22',
  },
  {
    id: 'PRD-011',
    nome: 'Memória RAM Corsair Vengeance 32GB DDR5',
    categoria: 'Hardware',
    preco: 899.00,
    estoque: 3,
    vendasMes: 27,
    status: 'Estoque Baixo',
    ultimaAtualizacao: '2026-10-28',
  },
  {
    id: 'PRD-012',
    nome: 'Webcam Logitech Brio 4K Stream Edition',
    categoria: 'Periféricos',
    preco: 989.00,
    estoque: 9,
    vendasMes: 14,
    status: 'Disponível',
    ultimaAtualizacao: '2026-10-20',
  },
  {
    id: 'PRD-013',
    nome: 'Switch Gigabit Gerenciável Ubiquiti UniFi 8 Portas',
    categoria: 'Redes',
    preco: 879.00,
    estoque: 7,
    vendasMes: 11,
    status: 'Disponível',
    ultimaAtualizacao: '2026-10-19',
  },
  {
    id: 'PRD-014',
    nome: 'Monitor Curvo Samsung Odyssey G5 34" UltraWide',
    categoria: 'Monitores',
    preco: 2699.00,
    estoque: 2,
    vendasMes: 18,
    status: 'Estoque Baixo',
    ultimaAtualizacao: '2026-10-30',
  },
  {
    id: 'PRD-015',
    nome: 'Caixa de Som Edifier R1280DB Bluetooth',
    categoria: 'Áudio',
    preco: 949.00,
    estoque: 11,
    vendasMes: 21,
    status: 'Disponível',
    ultimaAtualizacao: '2026-10-23',
  },
]
