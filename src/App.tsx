// src/App.tsx
import { useState, useMemo } from 'react'
import { useProductos } from './Hooks/useProductos'
import TableList, { ModalConfirm, ProductoForm } from './Components/TableList'
import type { Producto } from './Components/index'
import { CATEGORIAS, CATEGORIA_ICONS } from './Components/index'
import './App.css'

const TODAS = 'Todos'

export default function App() {
  const { productos, cargando, guardando, guardarProducto, eliminarProducto } =
    useProductos()

  const [categoriaActiva, setCategoriaActiva] = useState<string>(TODAS)
  const [busqueda, setBusqueda] = useState('')
  const [ordenar, setOrdenar] = useState('nombre_asc')
  const [modalForm, setModalForm] = useState<Producto | 'nuevo' | null>(null)
  const [modalEliminar, setModalEliminar] = useState<Producto | null>(null)
  const [toast, setToast] = useState<{ msg: string; tipo: 'ok' | 'error' } | null>(null)

  const mostrarToast = (msg: string, tipo: 'ok' | 'error' = 'ok') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  const productosFiltrados = useMemo(() => {
    const lista = productos.filter((p) => {
      const matchCat = categoriaActiva === TODAS || p.categoria === categoriaActiva
      const matchBusq = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      return matchCat && matchBusq
    })

    return [...lista].sort((a, b) => {
      if (ordenar === 'nombre_asc') return a.nombre.localeCompare(b.nombre)
      if (ordenar === 'nombre_desc') return b.nombre.localeCompare(a.nombre)
      if (ordenar === 'precio_asc') return Number(a.precio) - Number(b.precio)
      if (ordenar === 'precio_desc') return Number(b.precio) - Number(a.precio)
      return 0
    })
  }, [productos, categoriaActiva, busqueda, ordenar])

  const totalProductos = productos.length
  const precioPromedio =
    totalProductos > 0
      ? productos.reduce((s, p) => s + Number(p.precio), 0) / totalProductos
      : 0

  const handleGuardar = async (form: Producto) => {
    const ok = await guardarProducto(form)
    if (ok) {
      mostrarToast(form.id ? 'Producto actualizado ✓' : 'Producto creado ✓')
      setModalForm(null)
    } else {
      mostrarToast('Error al guardar', 'error')
    }
  }

  const handleEliminar = async () => {
    if (!modalEliminar?.id) return
    const ok = await eliminarProducto(modalEliminar.id)
    if (ok) mostrarToast('Producto eliminado')
    else mostrarToast('Error al eliminar', 'error')
    setModalEliminar(null)
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setCategoriaActiva(TODAS)
  }

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="logo-area">
            <span className="logo-icon">🥐</span>
            <div>
              <h1 className="logo-title">La Panadería</h1>
              <p className="logo-sub">Sistema de Gestión de Productos</p>
            </div>
          </div>
          <button className="btn-primary btn-nuevo" onClick={() => setModalForm('nuevo')}>
            + Nuevo Producto
          </button>
        </div>
      </header>

      <section className="stats-bar">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div>
            <p className="stat-label">Total Productos</p>
            <p className="stat-value">{totalProductos}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <div>
            <p className="stat-label">Precio Promedio</p>
            <p className="stat-value">${precioPromedio.toFixed(2)}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔍</span>
          <div>
            <p className="stat-label">Mostrando</p>
            <p className="stat-value">{productosFiltrados.length}</p>
          </div>
        </div>
      </section>

      <section className="controles">
        <div className="busqueda-wrap">
          <span className="busqueda-icon">🔍</span>
          <input
            className="busqueda-input"
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button className="busqueda-clear" onClick={() => setBusqueda('')}>
              ✕
            </button>
          )}
        </div>

        <select
          className="select-ordenar"
          value={ordenar}
          onChange={(e) => setOrdenar(e.target.value)}
        >
          <option value="nombre_asc">Nombre A–Z</option>
          <option value="nombre_desc">Nombre Z–A</option>
          <option value="precio_asc">Precio ↑</option>
          <option value="precio_desc">Precio ↓</option>
        </select>
      </section>

      <section className="filtros-cat">
        <button
          className={`btn-cat ${categoriaActiva === TODAS ? 'activo' : ''}`}
          onClick={() => setCategoriaActiva(TODAS)}
        >
          Todos
        </button>
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            className={`btn-cat ${categoriaActiva === cat ? 'activo' : ''}`}
            onClick={() => setCategoriaActiva(cat)}
          >
            {CATEGORIA_ICONS[cat]} {cat}
          </button>
        ))}
      </section>

      <main className="main">
        <TableList
          productos={productosFiltrados}
          cargando={cargando}
          onEditar={(p) => setModalForm(p)}
          onEliminar={(p) => setModalEliminar(p)}
          onLimpiarFiltros={limpiarFiltros}
        />
      </main>

      {modalForm && (
        <ProductoForm
          inicial={modalForm === 'nuevo' ? null : modalForm}
          onGuardar={handleGuardar}
          onCancelar={() => setModalForm(null)}
          cargando={guardando}
        />
      )}

      {modalEliminar && (
        <ModalConfirm
          producto={modalEliminar}
          onConfirm={handleEliminar}
          onCancel={() => setModalEliminar(null)}
        />
      )}

      {toast && (
        <div className={`toast ${toast.tipo === 'error' ? 'toast-error' : 'toast-ok'}`}>
          {toast.tipo === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}
    </div>
  )
}
