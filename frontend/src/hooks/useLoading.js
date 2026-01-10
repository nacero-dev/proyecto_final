import { useState } from "react";

export const useLoading = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    set: setValue,
  };
};
