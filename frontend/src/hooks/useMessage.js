import { useState } from "react";

// Hook personalizado para manejar mensajes al usuario
// Incluye clear() para limpiar el mensaje y volver al valor inicial

export const useMessage = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    set: setValue,
    clear: () => setValue(initialValue),
  };
};
