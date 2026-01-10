import { RouterProvider } from "react-router-dom";
import { router } from "@/routers/routers";

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Gestor de Productos</h1>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
