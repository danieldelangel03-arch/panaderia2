import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../utils/supabase'
import type { Producto } from '../Components/index'

interface UseProductosReturn {
  productos: Producto[]
  cargando: boolean
  guardando: boolean
  cargarProductos: () => Promise<void>
  guardarProducto: (form: Producto) => Promise<boolean>
  eliminarProducto: (id: number) => Promise<boolean>
}

export function useProductos(): UseProductosReturn {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const cargarProductos = useCallback(async () => {
    setCargando(true)
    const { data, error } = await supabase.from('productos').select('*')
    if (!error) setProductos(data ?? [])
    setCargando(false)
  }, [])

  useEffect(() => {
    const iniciar = async () => {
      await cargarProductos()
    }
    void iniciar()
  }, [cargarProductos])

  const guardarProducto = async (form: Producto): Promise<boolean> => {
    setGuardando(true)
    const res = form.id
      ? await supabase
          .from('productos')
          .update({
            nombre: form.nombre,
            descripcion: form.descripcion,
            precio: form.precio,
            categoria: form.categoria,
          })
          .eq('id', form.id)
      : await supabase.from('productos').insert([
          {
            nombre: form.nombre,
            descripcion: form.descripcion,
            precio: form.precio,
            categoria: form.categoria,
          },
        ])

    setGuardando(false)
    if (!res.error) await cargarProductos()
    return !res.error
  }

  const eliminarProducto = async (id: number): Promise<boolean> => {
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (!error) await cargarProductos()
    return !error
  }

  return { productos, cargando, guardando, cargarProductos, guardarProducto, eliminarProducto }
}
