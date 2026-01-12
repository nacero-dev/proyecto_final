import { useState } from "react";


// Hook personalizado para manejar estado de carga (loading)
// deshabilita botones o mostrar spinner durante fetch

export const useLoading = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    set: setValue,
  };
};
