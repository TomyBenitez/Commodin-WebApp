import './Home.css';
import { useCallback, useContext, useState, useEffect } from "react";
import Context from "../../context/UserContext";
import getLastBusiness from '../../services/getLastBusiness';
import cookieService from '../../services/tokenChrome'
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

    useEffect(() => {
        if (!token || !empresaId) return; // No ejecutar si faltan valores

        const fetchActionsData = async () => {
            try {
                let allActions:any[]= await getActions({
                    EmpresaId: empresaId,
                    Token: token,
                });

                const ahora = new Date();
                const hoy = ahora.toISOString().split('T')[0];

                allActions = allActions.filter(item =>
                    (item.ActTipoActividad === 2 || item.ActTipoActividad === 3) &&
                    item.ActStatus === 1
                );

                allActions = allActions.filter(item => {
                    if (item.Level1 && Array.isArray(item.Level1)) {
                        item.Level1 = item.Level1.filter((child:any) => {
                            if (!child.ActTabDTStart || !child.ActTabDTEnd) return false; // Si no hay fecha, descartar
    
                            const startDate = new Date(child.ActTabDTStart);
                            const endDate = new Date(child.ActTabDTEnd);
    
                            // Verificar si las fechas son válidas
                            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false;
    
                            const startDateFormatted = startDate.toISOString().split('T')[0];
                            const endDateFormatted = endDate.toISOString().split('T')[0];
    
                            return (
                                (child.EveDeliveryFormat === 9 || child.EveDeliveryFormat === 15) &&
                                Number(child.ActEveActive) === 1 &&
                                hoy >= startDateFormatted && hoy <= endDateFormatted
                            );
                        });
    
                        return item.Level1.length > 0;
                    }
                    return false;
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
            cookieService.removeCookie('jwtCommodinExt')
            cookieService.removeCookie('secUserId')
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
                                    alt="Commodin"
                                    onLoad={imageLoaded}
                                    className={`imgPopupMenu ${imageLoadedState ? 'loaded' : ''}`} />
                            ):(
                                <div style={{color:'white'}}>.</div>
                            )
                        }
                        <button className="closeSesionClass" onClick={logout}>Cerrar Sesión</button>
                    </div>
                    <div className="content" id="dynamicContent" style={dynamicStyle}>
                        {
                            actions.length>0 ? (
                                <>
                                    <h3 style={{width:'100%', textAlign:'center', paddingBottom:10 }}>Ahora Mismo</h3>
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
