import './Home.css';
import { useCallback, useContext } from "react";
import Context from "../../context/UserContext";

export const Home = () => {
    const context = useContext(Context);

    if (!context) {
        throw new Error("useUser debe usarse dentro de un UserContextProvider");
    }

    const imageLoaded = () => {
        const image = document.getElementById('imageLogoEnterprice');
        if(!image)return;
        image.style.opacity = '1';
        image.style.transform = 'scale(1)';
    }

    const { setJWT, setSecUserId } = context;
        const logout = useCallback(()=>{
            chrome.storage.local.remove(["jwtCommodinExt", "secUserId"]);
            setJWT(null)
            setSecUserId(null)
        },[setJWT,setSecUserId])

    return (
        <>
            <div id='AppPopupStyles'>
                <div className="container">
                    <div className="header">
                        <img 
                            src="https://simpocitybucket.s3.sa-east-1.amazonaws.com/archive/otros/idfs3_442024201028.tmp"
                            id="imageLogoEnterprice"
                            style={{opacity: 0, transform: 'scale(0.8)', transition: 'all 0.5s ease-out opacity: 0.5s ease-out' }}
                            alt="Comodín"
                            onLoad={imageLoaded}
                            className="imgPopupMenu" />
                        <button className="closeSesionClass" onClick={logout}>Cerrar Sesión</button>
                    </div>
                    <div className="content" id="dynamicContent">
                        <div className="loader"></div>
                    </div>
                </div>
            </div>
        </>
    )
    }
