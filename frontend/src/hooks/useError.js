// Hook personalizado para manejar errores de forma reutilizable

import { useState } from "react";

export const useError = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    set: setValue,
    clear: () => setValue(initialValue),
  };
};

// Guarda un valor y ofrece:
// set: para establecer el error
// clear: para volver al valor inicial (reset)