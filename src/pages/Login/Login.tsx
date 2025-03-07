import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import useUser from '../../hooks/useUser';

import './Login.css';

export const Login = () => {
  const [User, setUser] = useState('');
  const [Password, setPassword] = useState('');
  const { isLoginLoading, hasLoginError, login, isLogged } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLogged) setLocation('/')
  },[isLogged, setLocation]);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    login({ User, Password });
  }

  return (
    <>
      <div id='background'>
      <div id="login-container">
        <div>
          <img src="https://simpocitybucket.s3.sa-east-1.amazonaws.com/archive/otros/idfs3_442024201028.tmp"
           alt="Commodin"
           className="imgSpot" />
          <h2 className="titulo-form">Si usted ya es parte de la #Comunidad, ingrese su correo:</h2>
        </div>
        <form id="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="input-login"
              id="email"
              placeholder="Correo electrónico"
              onChange={(e) => setUser(e.target.value)}
              required />
            <input 
              type="password"
              className="input-login"
              id="pass"
              placeholder="Contraseña"
              onChange={(e) => setPassword(e.target.value)}
              required />
            <button 
              type="submit"
              id="btnSubmitEmail"
              style={!isLoginLoading && hasLoginError ? 
              {transition:'0.3 ease', background:'linear-gradient(to bottom, #b3212b, #dc3545)'}:{}}>
              {
                isLoginLoading ? 'Iniciando Sesión...' : hasLoginError ? 'Credenciales incorrectas. Intente nuevamente.' : 'SIGUIENTE'
              }
            </button>
            <div className="forgot-pass-container">
              <a className="forgot-pass" target="_blank" href="https://app.simpocity.com/community_start_acc_type.aspx?527,">Si aún no tiene cuenta puede registrarse aquí</a>
            </div>
        </form>
      </div>
      </div>
    </>
  )
}

export default Login;