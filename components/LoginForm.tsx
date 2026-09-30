"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { login } from "@/store/authSlice";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

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

  return (
    <Modal
      open={isFormVisible}
      onClose={() => setIsFormVisible(false)}
      title="Iniciar Sesión"
    >
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
          <Button
            type="submit"
            disabled={loading}
            className="rounded-md bg-[#26C17E] px-4 py-2 text-white hover:bg-[#26C17E]/90 disabled:opacity-50"
            data-testid="login"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
