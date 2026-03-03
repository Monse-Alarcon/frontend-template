import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Productos from './pages/Productos';
import Login from './pages/login';
import ProtectedRoute from './components/layout/ProtecedRoute';



const Dashboard = () => (
  <div>
    <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
    <p className="mt-4 text-slate-600">Bienvenido al sistema. Selecciona una opción del menú.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        {/* RUTAS PRIVADAS: Envueltas en el Layout */}
         <Route element = {<ProtectedRoute />}> 
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/productos" element={<Productos />} />

              </Routes>
            </Layout>
          } />
      
        </Route>
        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;