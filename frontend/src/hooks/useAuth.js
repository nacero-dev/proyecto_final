// Hook personalizado para consumir el AuthContext, en lugar de importar useContext y AuthContext en cada componente

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext); // Lee el valor actual del contexto "lo que recibe de AuthProvider"

  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>"); 
  }

  // Si se usa useAuth fuera de lo que envuelve <AuthProvider>,
  // el contexto será null y la app no sabrá de dónde sacar la sesión.

  return context;
};



