const Productos = () => (
  <div>
    <h1 className="text-3xl font-bold text-slate-800">Productos</h1>
    <p className="mt-4 text-slate-600">Bienvenido al sistema. Aquí van los productos</p>
  </div>
);


async function cargarProductos(res, req) {
  try {
    const res = await fetch('http://localhost:4000/api/productos');
    const productos = await res.json();
    return { props: { productos } };
  } catch (error) {
    console.error('Error al cargar productos:', error);
    return { props: { productos: [] } };
  }
}

export { cargarProductos };
export default Productos;