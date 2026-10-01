"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { login } from "@/store/authSlice";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

interface LoginFormProps {
  /** Visibilidad del modal, controlada por el padre. */
  open: boolean;
  onClose: () => void;
}

export default function LoginForm({ open, onClose }: LoginFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
    // El panel de este modal es blanco en ambos temas, así que título y
    // anillo de foco usan un verde fijo: `--main` en tema oscuro (verde
    // brillante) daría 2.34:1 contra blanco.
    <Modal
      open={open}
      onClose={onClose}
      title="Iniciar Sesión"
      titleClassName="text-[#0F6B45]"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="login-username"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Usuario
          </label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-gray-500 px-3 py-2 focus:ring-1 focus:ring-[#0F6B45] focus:outline-none"
            placeholder="Ingrese su usuario"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="login-password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-500 px-3 py-2 focus:ring-1 focus:ring-[#0F6B45] focus:outline-none"
            placeholder="Ingrese su contraseña"
            required
          />
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600" role="alert">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-main hover:bg-main/90 rounded-md px-4 py-2 text-white disabled:opacity-50 dark:text-gray-900"
            data-testid="login"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
