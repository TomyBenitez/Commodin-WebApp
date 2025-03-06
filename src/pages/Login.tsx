import { useState } from 'react';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e:any) => {
    e.preventDefault();
    alert(`Email: ${email} - Password: ${password}`);
  }

  return (
    <>
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
              onChange={(e) => setEmail(e.target.value)}
              required />
            <input 
              type="password"
              className="input-login"
              id="pass"
              placeholder="Contraseña"
              onChange={(e) => setPassword(e.target.value)}
              required />
            <button type="submit" id="btnSubmitEmail">SIGUIENTE</button>
            <div className="forgot-pass-container">
              <a className="forgot-pass" target="_blank" href="https://app.simpocity.com/community_start_acc_type.aspx?527,">Si aún no tiene cuenta puede registrarse aquí</a>
            </div>
        </form>
      </div>
    </>
  )
}

export default Login;