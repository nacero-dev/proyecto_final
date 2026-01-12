// Componente principal de la app
// Monta el router para que React Router controle la navegación
// entre páginas (login, productos, detalle, admin, etc)

import { RouterProvider } from "react-router-dom";
import { router } from "@/routers/routers";



function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
//Activación del enrutado, se renderiza el componente correcto según la URL

export default App;
