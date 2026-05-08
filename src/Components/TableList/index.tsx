import { useState } from 'react'
import type { Producto } from '../index'
import { CATEGORIAS, CATEGORIA_ICONS } from '../index'
import Card from '../Card'
import './TableList.css'

interface ModalConfirmProps {
  producto: Producto
  onConfirm: () => void
  onCancel: () => void
}

export function ModalConfirm({ producto, onConfirm, onCancel }: ModalConfirmProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">🗑️</div>
        <h3>¿Eliminar producto?</h3>
        <p>
          Estás a punto de eliminar <strong>{producto.nombre}</strong>.
          Esta acción no se puede deshacer.
        </p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
          <button className="btn-delete-confirm" onClick={onConfirm}>Sí, eliminar</button>
        </div>
      </div>
    </div>
  )
}

interface ProductoFormProps {
  inicial: Producto | null
  onGuardar: (data: Producto) => void
  onCancelar: () => void
  cargando: boolean
}

export function ProductoForm({ inicial, onGuardar, onCancelar, cargando }: ProductoFormProps) {
  const [form, setForm] = useState<Producto>(
    inicial ?? { nombre: '', descripcion: '', precio: '', categoria: 'Pan' }
  )
  const [errores, setErrores] = useState<Record<string, string>>({})

  const validar = () => {
    const e: Record<string, string> = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido'
    if (!form.precio || parseFloat(String(form.precio)) <= 0)
      e.precio = 'El precio debe ser mayor a 0'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validar()
    if (Object.keys(errs).length) { setErrores(errs); return }
    onGuardar({ ...form, precio: parseFloat(String(form.precio)) })
  }

  const campo = (key: keyof Producto, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrores((e) => ({ ...e, [key]: '' }))
  }

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-box form-box" onClick={(e) => e.stopPropagation()}>
        <h3>{inicial?.id ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h3>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label>Nombre *</label>
            <input
              value={form.nombre}
              onChange={(e) => campo('nombre', e.target.value)}
              placeholder="Ej: Croissant de mantequilla"
              className={errores.nombre ? 'input-error' : ''}
            />
            {errores.nombre && <span className="error-msg">{errores.nombre}</span>}
          </div>

          <div className="field">
            <label>Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => campo('descripcion', e.target.value)}
              placeholder="Descripción opcional..."
              rows={2}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Precio (MXN) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.precio}
                onChange={(e) => campo('precio', e.target.value)}
                placeholder="0.00"
                className={errores.precio ? 'input-error' : ''}
              />
              {errores.precio && <span className="error-msg">{errores.precio}</span>}
            </div>

            <div className="field">
              <label>Categoría</label>
              <select
                value={form.categoria}
                onChange={(e) => campo('categoria', e.target.value)}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORIA_ICONS[c]} {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancelar} disabled={cargando}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={cargando}>
              {cargando ? 'Guardando...' : inicial?.id ? 'Actualizar' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface TableListProps {
  productos: Producto[]
  cargando: boolean
  onEditar: (producto: Producto) => void
  onEliminar: (producto: Producto) => void
  onLimpiarFiltros: () => void
}

export default function TableList({
  productos,
  cargando,
  onEditar,
  onEliminar,
  onLimpiarFiltros,
}: TableListProps) {
  if (cargando) {
    return (
      <div className="empty-state">
        <span className="spinner">⏳</span>
        <p>Cargando productos...</p>
      </div>
    )
  }

  if (productos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🥐</span>
        <p>No hay productos que coincidan.</p>
        <button className="btn-primary" onClick={onLimpiarFiltros}>
          Limpiar filtros
        </button>
      </div>
    )
  }

  return (
    <div className="productos-grid">
      {productos.map((p) => (
        <Card
          key={p.id}
          producto={p}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />
      ))}
    </div>
  )
}
