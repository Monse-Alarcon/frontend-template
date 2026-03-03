import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch("http://localhost:4000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.msg || "Error al iniciar sesión");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", data.token);
            console.log("Login exitoso");
            
            // Redirigir al dashboard después del login exitoso
            navigate('/dashboard');
        } catch (error) {
            console.error("Error:", error);
            setError("Error del servidor. Por favor, intenta de nuevo.");
            setLoading(false);
        }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700">Correo Electrónico</label>
          <input
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700">Contraseña</label>
          <input
            type="password"
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};

export default Login;