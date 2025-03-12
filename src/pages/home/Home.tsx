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
    const [comunidadTemplatesFondo, setComunidadTemplatesFondo] = useState<string | null>(null);
    const [imageLoadedState, setImageLoadedState] = useState(false);
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
                    setComunidadTemplatesFondo(lastBusiness.ComunidadTemplatesFondo_S3URL)
                }
            } catch (error) {
                console.error("Error obteniendo los datos del negocio:", error);
            }
        };

        fetchBusinessData();
    }, [token, userId]);

    useEffect(() => {
        if (comunidadTemplatesFondo && comunidadTemplatesFondo !== 'parms_error') {
            updateStyles(comunidadTemplatesFondo);
        }
    }, [logoUrl]);

    const imageLoaded = () => {
        setImageLoadedState(true);
    };

    const updateStyles = (logo: string) => {
        document.body.style.backgroundImage = `url(${logo})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundSize = "100% 100%";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.height = '100vh'
        document.body.style.width = '100vw'
    };

    /* const updateColor = (color:string) => {
        const header = document.querySelector(".header") as HTMLElement;
    
        if (!header) return;

        switch(color.toLowerCase()){
            case 'theme-blue':
                header.style.backgroundColor = '#000000'
                break;
            case 'theme-indigo':
                header.style.backgroundColor = 'red'
                break;
            case 'theme-rose':
                header.style.backgroundColor = '#5e9ea0'
                break;
            case 'theme-purple':
                header.style.backgroundColor = 'red'
                break;
            case 'theme-amber':
                header.style.backgroundColor = 'red'
                break;
            case 'theme-slate':
                header.style.backgroundColor = 'red'
                break;
            case 'theme-green':
                header.style.backgroundColor = '#808080'
                break;
            case 'theme-orange':
                header.style.backgroundColor = 'red'
                break;
            case 'theme-zinc':
                header.style.backgroundColor = 'red'
                break;
            case 'theme-lime':
                header.style.backgroundColor = 'red'
                break;
            case 'theme-fuchsia':
                header.style.backgroundColor = 'red'
                break;
            default:
                header.style.backgroundColor = '#3e3f43'
                break;
        }
    } */

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
                            token && empresaId && userId? 
                            (
                                <>
                                    <ActionsCard token={token} empresaId={empresaId}/>
                                    <RemindersCard token={token} empresaId={empresaId} secUserId={userId}/>
                                </>
                            ):null
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
