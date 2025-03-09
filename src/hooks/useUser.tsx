import { useCallback, useContext, useState } from "react";
import Context from "../context/UserContext";
import loginService from "../services/login";
import { removeToken, setToken } from "../services/tokenChrome";


interface LoginParams{
    User: string;
    Password: string;
}

interface StateError {
    loading: boolean;
    error: boolean;
}

export function useUser() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserContextProvider");
  }

  const { jwt, setJWT, setSecUserId } = context;
  const [state, setState] = useState<StateError>({
    loading: false,
    error: false
    });

  const login = useCallback(({User, Password}:LoginParams) => {
    setState({loading: true, error: false});
    loginService({User, Password})
        .then(jwt => {
            //set token en storage.local
            setToken('jwtCommodinExt',jwt.Token)
            setToken('secUserId',jwt.SecUserId)
            //set estado de error para login form
            setState({ loading: false, error: false });
            //setJWT y UserId para cambiar de page
            setJWT(jwt.Token);
            setSecUserId(jwt.SecUserId);
        })
        .catch(err => {
            //set de error para login form
            setState({loading: false, error: true});
            console.log(err)
            //quito los token
            removeToken('jwtCommodinExt')
            removeToken('secUserId')
          }
        )
  }, [setJWT, setSecUserId]);

  return {
    isLogged: Boolean(jwt),
    isLoginLoading: state.loading,
    hasLoginError: state.error,
    login
  }
}

export default useUser;