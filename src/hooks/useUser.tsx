import { useCallback, useContext, useState } from "react";
import Context from "../context/UserContext";
import loginService from "../services/login";
import cookieService from '../services/tokenChrome'


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

  const login = useCallback(async ({ User, Password }: LoginParams) => {
    setState({loading: true, error: false});
    try {
      const jwt = await loginService({ User, Password });
      // Set token en las cookies
      await cookieService.setCookie('jwtCommodinExt', jwt.Token);
      await cookieService.setCookie('secUserId', jwt.SecUserId);
      setState({ loading: false, error: false });
      setJWT(jwt.Token);
      setSecUserId(jwt.SecUserId);
  } catch (err) {
      setState({ loading: false, error: true });
      console.log(err);
      cookieService.removeCookie('jwtCommodinExt');
      cookieService.removeCookie('secUserId');
  }
  }, [setJWT, setSecUserId]);

  return {
    isLogged: Boolean(jwt),
    isLoginLoading: state.loading,
    hasLoginError: state.error,
    login
  }
}

export default useUser;