import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ShoppingBag, Loader, AlertCircle, Plus } from 'lucide-react';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
    descripcion: '',
    imagen_url: ''
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await api.get('/productos'); 
      setProductos(data);
    } catch (err) {
      setError("No se pudo conectar con el servidor. ¿Está encendido?");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCrearProducto = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg('');

    const nombreLimpio = nuevoProducto.nombre.trim();
    const descripcionLimpia = nuevoProducto.descripcion.trim();
    const imagenLimpia = nuevoProducto.imagen_url.trim();
    const precioNumero = Number(nuevoProducto.precio);
    const stockNumero = Number(nuevoProducto.stock);
    let imagenFinal = null;

    if (!nombreLimpio || !descripcionLimpia || Number.isNaN(precioNumero) || Number.isNaN(stockNumero)) {
      setFormError('Completa nombre, precio, stock y descripción.');
      return;
    }

    if (precioNumero < 0 || stockNumero < 0) {
      setFormError('Precio y stock no pueden ser negativos.');
      return;
    }

    if (imagenLimpia) {
      try {
        const parsedUrl = new URL(imagenLimpia);
        imagenFinal = parsedUrl.toString();
      } catch {
        setFormError('La URL de imagen no es válida. Usa formato http(s)://... o déjala vacía.');
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload = {
        nombre: nombreLimpio,
        precio: precioNumero,
        stock: stockNumero,
        descripcion: descripcionLimpia,
        id_categoria: 1
      };

      if (imagenFinal) {
        payload.imagen_url = imagenFinal;
      }

      await api.post('/productos/crear', payload);

      setSuccessMsg('Producto creado correctamente.');
      setNuevoProducto({
        nombre: '',
        precio: '',
        stock: '',
        descripcion: '',
        imagen_url: ''
      });
      await cargarProductos();
      setShowForm(false);
    } catch (err) {
      setFormError(err.message || 'No se pudo crear el producto. Revisa el backend y la base de datos.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader className="animate-spin text-blue-600" size={48} />
    </div>
  );

  if (error) return (
    <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center gap-2">
      <AlertCircle /> {error}
    </div>
  );

  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <ShoppingBag className="text-blue-600" /> Inventario
        </h1>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
          {productos.length} items
        </span>
      </header>

      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} /> {showForm ? 'Cerrar formulario' : 'Crear producto'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCrearProducto} className="mb-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Nuevo producto</h2>

          {formError && (
            <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm">{formError}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                name="nombre"
                value={nuevoProducto.nombre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Teclado mecánico"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Precio</label>
              <input
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={nuevoProducto.precio}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. 199.99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={nuevoProducto.stock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. 20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL de imagen (opcional)</label>
              <input
                name="imagen_url"
                value={nuevoProducto.imagen_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                rows="3"
                value={nuevoProducto.descripcion}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe el producto"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Guardando...' : 'Guardar producto'}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {successMsg && (
        <div className="mb-4 bg-emerald-100 text-emerald-700 p-3 rounded-lg text-sm">{successMsg}</div>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {productos.map((prod, index) => (
          <div key={`${prod.nombre}-${index}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 overflow-hidden flex flex-col">
            
            {/* Imagen del producto */}
            <div className="h-48 p-4 bg-white flex items-center justify-center border-b border-slate-50">
              <img 
                src={prod.imagen_url || "https://via.placeholder.com/150"} 
                alt={prod.nombre} 
                className="max-h-full object-contain"
              />
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800 line-clamp-1" title={prod.nombre}>
                  {prod.nombre}
                </h3>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">
                  ${prod.precio}
                </span>
              </div>
              
              <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                {prod.descripcion || "Sin descripción disponible."}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <span className="text-xs font-medium text-slate-400">
                  Stock: <span className={prod.stock < 10 ? "text-red-500 font-bold" : "text-slate-600"}>{prod.stock}</span>
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;