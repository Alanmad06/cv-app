"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { login } from "@/store/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Escuchar el evento personalizado para abrir el formulario
  useEffect(() => {
    const handleOpenForm = () => setIsFormVisible(true);
    document.addEventListener("openLoginForm", handleOpenForm);
    return () => document.removeEventListener("openLoginForm", handleOpenForm);
  }, []);

  const resetForm = () => {
    setUsername("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login({ user: username, password }));
    resetForm();
  };

  if (!isFormVisible) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-[#0000008f]">
      <div className="w-full max-w-md rounded-md bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-main text-xl font-semibold">Iniciar Sesión</h2>
          <button
            onClick={() => setIsFormVisible(false)}
            className="text-gray-500 hover:text-gray-700"
            data-testid="close"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="focus:ring-main w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none"
              placeholder="Ingrese su usuario"
              required
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:ring-main w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none"
              placeholder="Ingrese su contraseña"
              required
            />
          </div>

          {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="hover:bg-opacity-90 rounded-md bg-[#26C17E] px-4 py-2 text-white transition-all disabled:opacity-50"
              data-testid="login"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
