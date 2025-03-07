import { useState, createContext, ReactNode } from "react";

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
  const [secUserId, setSecUserId] = useState<number | null>(null);

  return (
    <Context.Provider value={{ jwt, setJWT, secUserId, setSecUserId }}>
      {children}
    </Context.Provider>
  );
}

export default Context;
