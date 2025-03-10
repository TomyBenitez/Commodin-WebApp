import { EncryptedUrl } from "../services/encryptUrl";
import { getCookie } from "../services/tokenChrome";

function formatFecha(fechaOriginal: any) {
    if (!fechaOriginal || typeof fechaOriginal !== 'string') {
        return 'Fecha inválida';
    }

    const fecha = new Date(fechaOriginal.trim() + "Z");

    if (isNaN(fecha.getTime())) {
        return 'Fecha inválida';
    }

    fecha.setHours(fecha.getHours() - 3);

    return new Intl.DateTimeFormat("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }).format(fecha);
}

async function handleWindow(ActId:string, ActTipoActividad:number){
    const url = await EncryptedUrl(ActId, ActTipoActividad.toString())
    window.location.href = `${url}`;
}

function CardOnLive({action}:{action:any}) {
    const level1 = action?.Level1?.[0];
  return (
    <>
        <div className='data-box'
            onClick={() => handleWindow(action?.ActId, action?.ActTipoActividad)}
            data-actid={action?.ActId || 0}
            data-typeact={action?.ActTipoActividad}>

            <img src={action.ActRAM} alt={action.ActPrgTitle}/>
            <div className='data-content'>
                <p style={{color:'#e74c3c', fontWeight:'600', width:'100%', textAlign:'end'}}>
                    <span className="live-dot"></span>Evento en vivo
                </p>
                <h3>{action.ActPrgTitle}</h3>
                {level1? <p><strong>Desde:</strong> {formatFecha(level1.ActTabDTStart)}</p> : ''}
                {level1 ? <p><strong>Hasta:</strong> {formatFecha(level1.ActTabDTEnd)}</p> : ''}
                {level1 ? <p><strong>Hora:</strong> {level1.EveFechaFormateada}</p> : ''}
            </div>
        </div>
    </>
  )
}

export default CardOnLive