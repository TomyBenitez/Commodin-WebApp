import './Home.css';
import { useCallback, useContext, useState, useEffect } from "react";
import Context from "../../context/UserContext";
import getLastBusiness from '../../services/getLastBusiness';
import cookieService from '../../services/tokenChrome'
import { ActionsCard } from '../../components/ActionsCard/ActionsCard';
import { RemindersCard } from '../../components/RemindersCard/RemindersCard';

export const Home = () => {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [empresaId, setEmpresaId] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [imageLoadedState, setImageLoadedState] = useState(false);
    const [hasActions, setHasActions] = useState(false);
    const [hasReminders, setHasReminders] = useState(false);
    const context = useContext(Context);

    if (!context) {
        throw new Error("useUser debe usarse dentro de un UserContextProvider");
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedToken = await cookieService.getCookie('jwtCommodinExt')
                const fetchedUserId = await cookieService.getCookie('secUserId');
                
                setToken(fetchedToken);
                setUserId(fetchedUserId);
            } catch (error) {
                console.error("Error obteniendo los datos:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!token || !userId) return; // No ejecutar si faltan valores

        const fetchBusinessData = async () => {
            try {
                const lastBusiness = await getLastBusiness({
                    SecUserId: userId,
                    Token: token,
                });

                if (lastBusiness?.EmpresaLogo) {
                    await cookieService.setCookie('empresaId',lastBusiness.EmpresaId)
                    await cookieService.setCookie('empresaLogo',lastBusiness.EmpresaLogo)
                    setEmpresaId(lastBusiness.EmpresaId)
                    setLogoUrl(lastBusiness.EmpresaLogo)
                }
            } catch (error) {
                console.error("Error obteniendo los datos del negocio:", error);
            }
        };

        fetchBusinessData();
    }, [token, userId]);

    const imageLoaded = () => {
        setImageLoadedState(true);
    };

    const { setJWT, setSecUserId } = context;
        const logout = useCallback(()=>{
            //remover token y userId
            cookieService.removeCookie('jwtCommodinExt')
            cookieService.removeCookie('secUserId')
            setJWT(null)
            setSecUserId(null)
        },[setJWT,setSecUserId])
    return (
        <>
            <div id='AppPopupStyles'>
                <div className="container">
                    <div className="header">
                        {
                            logoUrl ? (
                                <img 
                                    src={logoUrl}
                                    id="imageLogoEnterprice"
                                    alt="Commodin"
                                    onLoad={imageLoaded}
                                    className={`imgPopupMenu ${imageLoadedState ? 'loaded' : ''}`} />
                            ):(
                                <div style={{color:'white'}}>.</div>
                            )
                        }
                        <button className="closeSesionClass" onClick={logout}>Cerrar Sesión</button>
                    </div>
                    <div className="content" id="dynamicContent">
                        {
                            token && empresaId && userId ? 
                            (
                                <>
                                    <ActionsCard token={token} empresaId={empresaId} onActionsUpdate={setHasActions}/>
                                    <RemindersCard token={token} empresaId={empresaId} secUserId={userId} onRemindersUpdate={setHasReminders} />
                                </>
                            ):null
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
