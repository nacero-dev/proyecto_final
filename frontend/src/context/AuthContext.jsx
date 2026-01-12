// Contexto de autenticación

// Sirve para compartir el estado de sesión (token, isAdmin, login/logout)
// con toda la app sin pasar props manualmente
// createContext() crea el contexto y su Provider para poder compartir datos en el árbol de componentes

import { createContext, useEffect, useState } from "react";


// Provider del contexto
export const AuthContext = createContext(null);


// Envuelve la app en main.jsx y así cualquier componente puede acceder a la auth usando el hook useAuth

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(""); // Estado del token JWT (si existe, el usuario esta autenticado)
  const [isAdmin, setIsAdmin] = useState(false); // Estado del rol (admin o visor)
  
// este bloque hacee que al cargar la aplicación se recupere la sesión guardada en localStorage y SE evite que al recargar la pagina se borren los datos del login
// se lee lo que se haya cargado en local storage  de token y de isAdmin, si se recarga entonces token estaría vacio y isAdmin siempre sería false (el default)

useEffect(() => {
    const savedToken = localStorage.getItem("token") || ""; //ya que localStorage.getItem("token") puede ser null por lo pongo un OR para que siempre sea un string
    setToken(savedToken);
    const savedIsAdmin = localStorage.getItem("isAdmin") === "true"; //ya que local storage guarda todo como texto, se pone === "true" para que convierta a tipo booleano
    setIsAdmin(savedIsAdmin);
  }, []);

//funcion login

    const login = (data) => {
    localStorage.setItem("token", data.token); // se ponen los datos en local storage para que permanezcan ante actualizaciones o cierre de pestañas en el navegador
    localStorage.setItem("isAdmin", String(data.isAdmin)); //modifica el tipo de datos del local storage puesto que esta guardado como texto y se necesita guardar en string en React
    setToken(data.token); //para que la interfaz se actualice al instante sin recargar (
    setIsAdmin(Boolean(data.isAdmin)); //modifica el tipo de datos del local storage puesto que esta guardado como boolean y se necesita guardar en string en React
  };

 //funcion logout

 //elimina los datos de sesión
 //limpia el estado para ocultar rutas/acciones protegidas

    const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setToken("");
    setIsAdmin(false);
  };

  const isAuthenticated = Boolean(token);

  const value = { token, isAdmin, isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
