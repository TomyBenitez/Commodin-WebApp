import './Home.css';
import { useCallback, useContext, useState, useEffect, useRef } from "react";
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
    const [comunidadTemplatesAppHeaderColor, setComunidadTemplatesAppHeaderColor] = useState<string | null>(null);
    const [colorHeader, setColorHeader] = useState<string | null>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [imageLoadedState, setImageLoadedState] = useState(false);
    const context = useContext(Context);

    if (!context) {
        throw new Error("useUser debe usarse dentro de un UserContextProvider");
    }

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

    const reloadComponent = async () => {
        setToken(null);
        setUserId(null);
        setEmpresaId(null);
        setLogoUrl(null);
        setComunidadTemplatesFondo(null);
        setComunidadTemplatesAppHeaderColor(null);
        setColorHeader(null);
    
        fetchData();
    };

    useEffect(() => {
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

                if (lastBusiness) {
                    await cookieService.setCookie('empresaId',lastBusiness.EmpresaId)
                    await cookieService.setCookie('empresaLogo',lastBusiness.EmpresaLogo)
                    setEmpresaId(lastBusiness?.EmpresaId)
                    setLogoUrl(lastBusiness?.EmpresaLogo)
                    setComunidadTemplatesFondo(lastBusiness?.ComunidadTemplatesFondo_S3URL)
                    setComunidadTemplatesAppHeaderColor(lastBusiness?.ComunidadTemplatesAppHeaderColor)
                }
            } catch (error) {
                if ((error as any).status === 401) {
                    logout();
                } else {
                    console.error("Error obteniendo los datos del negocio:", error);
                }
            }
        };

        fetchBusinessData();
    }, [token, userId]);

    useEffect(() => {
        if (comunidadTemplatesFondo && comunidadTemplatesFondo !== 'parms_error') {
            updateStyles(comunidadTemplatesFondo);
        }
    }, [comunidadTemplatesFondo]);

    useEffect(()=> {
        if (comunidadTemplatesAppHeaderColor !== null){
            updateColor(comunidadTemplatesAppHeaderColor);
        }
    }, [comunidadTemplatesAppHeaderColor])

    const imageLoaded = () => {
        setImageLoadedState(true);
    };

    const updateStyles = (comunidadTemplatesFondo: string) => {
        document.body.style.backgroundImage = `url(${comunidadTemplatesFondo})`;
        document.body.style.backgroundSize = "cover"; // Ajusta el fondo correctamente en todos los tamaños de pantalla
        document.body.style.backgroundPosition = "center"; // Centra el fondo
        document.body.style.backgroundRepeat = "no-repeat"; 
        document.body.style.height = "100vh";
        document.body.style.width = "100vw";
        document.body.style.backgroundAttachment = "fixed";
    };

    const updateColor = (color:string) => {
        color = color.trim().toLowerCase();
        
        let newColor;
        switch (true) {
            case color.includes('commodin'):
                newColor = 'rgb(9,72,103)';
                break;
            case color.includes('cao'):
                newColor = 'rgb(0,85,146)';
                break;
            case color.includes('cilad'):
                newColor = 'rgb(26,180,243)';
                break;
            case color.includes('ciladultralight_'):
                newColor = 'rgb(135,242,246)';
                break;
            case color.includes('sleep'):
                newColor = 'rgb(0,91,170)';
                break;
            case color.includes('sinfondo'):
                newColor = 'rgb(233, 233, 233)';
                break;
            case color.includes('rgba(0,0,0,0.0)') || color === '':
                newColor = 'White';
                break;
            default:
                newColor = color.replace(/tca_|fc_|_op|ac_|wn_|smc_/g, '').trim();
                break;
        }
        console.log(newColor)
        setColorHeader(newColor)
    }

    useEffect(()=>{
        if (headerRef.current !== null && colorHeader !== null) {
            console.log(colorHeader)
            headerRef.current.style.backgroundColor = colorHeader;
          }
    }, [colorHeader])

    const { setJWT, setSecUserId } = context;
        const logout = useCallback(()=>{
            //remover token y userId
            cookieService.removeCookie('jwtCommodinExt')
            cookieService.removeCookie('secUserId')
            cookieService.removeCookie('empresaLogo')
            cookieService.removeCookie('empresaId')
            setJWT(null)
            setSecUserId(null)
        },[setJWT,setSecUserId])
    return (
        <>
            <div id='AppPopupStyles'>
                <div className="container">
                    <div className="header" ref={headerRef}>
                        {
                            logoUrl ? (
                                <img 
                                    src={logoUrl}
                                    id="imageLogoEnterprice"
                                    alt="Commodin"
                                    onLoad={imageLoaded}
                                    className={`imgPopupMenu ${imageLoadedState ? 'loaded' : ''}`} />
                            ):(
                                <img 
                                    src={'https://simpocitybucket.s3.sa-east-1.amazonaws.com/archive/otros/idfs3_442024201028.tmp'}
                                    id="imageLogoEnterprice"
                                    alt="Commodin"
                                    onLoad={imageLoaded}
                                    className={`imgPopupMenu ${imageLoadedState ? 'loaded' : ''}`} />
                            )
                        }
                        <button className="closeSesionClass" onClick={logout}>Cerrar Sesión</button>
                    </div>
                    <div className="content" id="dynamicContent">
                    <div className='containerReloadButton'>
                        <button className="reloadButton" onClick={reloadComponent}>Recargar <i className="fa-solid fa-rotate-left"></i></button>
                    </div>
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
