export type Categoria = 'Pan' | 'Pastel' | 'Galletas' | 'Bebida'

export interface Producto {
  id?: number
  nombre: string
  descripcion: string
  precio: number | string
  categoria: Categoria
  created_at?: string
}

export const CATEGORIAS: Categoria[] = ['Pan', 'Pastel', 'Galletas', 'Bebida']

export const CATEGORIA_ICONS: Record<Categoria, string> = {
  Pan: '🍞',
  Pastel: '🍰',
  Galletas: '🍪',
  Bebida: '☕',
}

export const CATEGORIA_COLORS: Record<Categoria, string> = {
  Pan: '#c8a97e',
  Pastel: '#e8a0bf',
  Galletas: '#d4a96a',
  Bebida: '#8bc4c4',
}
