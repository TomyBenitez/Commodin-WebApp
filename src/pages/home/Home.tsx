import './Home.css';
import { useCallback, useContext, useState, useEffect } from "react";
import Context from "../../context/UserContext";
import getLastBusiness from '../../services/getLastBusiness';
import { getToken, removeToken } from '../../services/tokenChrome';
import getActions from '../../services/getActions';
import CardOnLive from '../../components/CardOnLive';

export const Home = () => {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [empresaId, setEmpresaId] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [imageLoadedState, setImageLoadedState] = useState(false);
    const [actions, setActions] = useState<any[]>([]);
    const context = useContext(Context);

    if (!context) {
        throw new Error("useUser debe usarse dentro de un UserContextProvider");
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedToken = await getToken('jwtCommodinExt')
                const fetchedUserId = await getToken('secUserId');
                
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
                    setEmpresaId(lastBusiness.EmpresaId)
                    setLogoUrl(lastBusiness.EmpresaLogo);
                }
            } catch (error) {
                console.error("Error obteniendo los datos del negocio:", error);
            }
        };

        fetchBusinessData();
    }, [token, userId]);

    useEffect(() => {
        if (!token || !empresaId) return; // No ejecutar si faltan valores

        const fetchActionsData = async () => {
            try {
                const allActions = await getActions({
                    EmpresaId: empresaId,
                    Token: token,
                });

                setActions(allActions)

            } catch (error) {
                console.error("Error obteniendo los datos del negocio:", error);
            }
        };

        fetchActionsData();
    }, [token, empresaId]);
    

    const imageLoaded = () => {
        setImageLoadedState(true);
    };

    const { setJWT, setSecUserId } = context;
        const logout = useCallback(()=>{
            //remover token y userId
            removeToken('jwtCommodinExt')
            removeToken('secUserId')
            setJWT(null)
            setSecUserId(null)
        },[setJWT,setSecUserId])
    
        const dynamicStyle = actions.length > 0 ? { display: 'block' } : { display: 'flex' };
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
                                    alt="Comodín"
                                    onLoad={imageLoaded}
                                    className={`imgPopupMenu ${imageLoadedState ? 'loaded' : ''}`} />
                            ):(
                                <div>...</div>
                            )
                        }
                        <button className="closeSesionClass" onClick={logout}>Cerrar Sesión</button>
                    </div>
                    <div className="content" id="dynamicContent" style={dynamicStyle}>
                        {
                            actions ? (
                                <>
                                    <h3 style={{width:'100%', textAlign:'center' }}>Ahora Mismo</h3>
                                    {
                                    actions.map((action, index)=> (
                                        <CardOnLive action={action} key={index}/>
                                    ))
                                    }
                                </>
                            ):(
                                <div className="loader"></div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
