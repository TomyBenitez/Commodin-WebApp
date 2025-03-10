import { useState, createContext, ReactNode, useEffect } from "react";
import cookieService from '../services/tokenChrome'

// Definir la estructura del contexto
interface UserContextType {
  jwt: string | null;
  secUserId: number | null;
  setJWT: (jwt: string | null) => void;
  setSecUserId: (secUserId: number | null) => void;
}

// Crear el contexto con tipo explícito
const Context = createContext<UserContextType | null>(null);

interface UserContextProviderProps {
  children: ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [jwt, setJWT] = useState<string | null>(null);
  const [secUserId, setSecUserId] = useState<number | null>(null)
  
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const storedJwt = await cookieService.getCookie('jwtCommodinExt');
        const storedSecUserId = await cookieService.getCookie('SecUserIdCommodinExt');
        
        // Setear los valores en el estado si están disponibles
        setJWT(storedJwt);
        setSecUserId(storedSecUserId ? Number(storedSecUserId) : null);
      } catch (error) {
        console.error("Error al obtener el token o secUserId", error);
      }
    };

    fetchTokenData(); // Llamar la función para obtener los datos cuando el componente se monta
  }, []);

  return (
    <Context.Provider value={{ jwt, setJWT, secUserId, setSecUserId }}>
      {children}
    </Context.Provider>
  );
}

export default Context;
