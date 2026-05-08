// src/Components/Card/index.tsx
import type { Producto, Categoria } from '../index'
import { CATEGORIA_ICONS, CATEGORIA_COLORS } from '../index'
import './Card.css'

interface CardProps {
  producto: Producto
  onEditar: (producto: Producto) => void
  onEliminar: (producto: Producto) => void
}

export default function Card({ producto, onEditar, onEliminar }: CardProps) {
  const cat = producto.categoria as Categoria
  const color = CATEGORIA_COLORS[cat] || '#c8a97e'

  return (
    <div className="producto-card" style={{ '--cat-color': color } as React.CSSProperties}>
      <div className="card-cat-bar" />

      <div className="card-header">
        <span className="cat-badge">
          {CATEGORIA_ICONS[cat]} {producto.categoria}
        </span>
        <span className="card-price">
          ${parseFloat(String(producto.precio)).toFixed(2)}
        </span>
      </div>

      <h4 className="card-name">{producto.nombre}</h4>

      {producto.descripcion && (
        <p className="card-desc">{producto.descripcion}</p>
      )}

      <div className="card-actions">
        <button
          className="btn-edit"
          onClick={() => onEditar(producto)}
          title="Editar producto"
        >
          ✏️ Editar
        </button>
        <button
          className="btn-delete"
          onClick={() => onEliminar(producto)}
          title="Eliminar producto"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
