
import React from "react";
import ReactDOM from "react-dom/client";

//habilitacion de Bootstrap (CSS)
import "bootstrap/dist/css/bootstrap.min.css"; 

import App from "@/App.jsx";

//Estilos globales del proyecto (complementarios a Bootstrap)
import "@/index.css";
import "@/App.css";
import { AuthProvider } from "@/context/AuthContext";


// Render principal de React:
// Se monta la app dentro del div con id="root" (en index.html)
// React.StrictMode ayuda a detectar problemas en desarrollo (no afecta producción)

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <React.StrictMode>
    <AuthProvider> 
    <App />
    </AuthProvider>
  </React.StrictMode>
);