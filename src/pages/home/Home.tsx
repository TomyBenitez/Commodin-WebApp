import './Home.css';

export const Home = () => {
  return (
    <>
        <div id='AppPopupStyles'>
            <div className="container">
                <div className="header">
                    <img 
                        src=""
                        id="imageLogoEnterprice"
                        style={{opacity: 0, transform: 'scale(0.8)', transition: 'transform 0.5s ease-out opacity: 0.5s ease-out' }}
                        alt="Comodín"
                        className="imgPopupMenu" />
                    <button className="closeSesionClass" id="closeSesion">Cerrar Sesión</button>
                </div>
                <div className="content" id="dynamicContent">
                    <div className="loader"></div>
                </div>
            </div>
        </div>
    </>
  )
}
