import { useState, createContext, ReactNode, useEffect } from "react";

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

// Verificación de la existencia del token
const getToken = (name: string): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([name], (result) => {
            if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);  // Maneja errores
            } else {
            resolve(result[name] || null);  // Resuelve con el valor o null si no existe
            }
        });
    });
};


export function UserContextProvider({ children }: UserContextProviderProps) {
  const [jwt, setJWT] = useState<string | null>(null);
  const [secUserId, setSecUserId] = useState<number | null>(null)
  
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const storedJwt = await getToken('jwtCommodinExt');
        const storedSecUserId = await getToken('SecUserIdCommodinExt');
        
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
