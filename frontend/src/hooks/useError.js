import { useState } from "react";

export const useError = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    set: setValue,
    clear: () => setValue(initialValue),
  };
};
