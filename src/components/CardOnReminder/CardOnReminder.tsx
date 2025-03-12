import './CardOnReminder.css'

function formatFecha(fechaOriginal: any) {
    if (!fechaOriginal || typeof fechaOriginal !== 'string') {
        return 'Fecha inválida';
    }

    const fecha = new Date(fechaOriginal.trim() + "Z");

    if (isNaN(fecha.getTime())) {
        return 'Fecha inválida';
    }

    fecha.setHours(fecha.getHours() - 1 );

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

function CardOnReminder({reminder}:{reminder:any}) {
  return (
    <>
        <div className='data-box-reminder'>
            <div className='data-content-reminder'>
                <h3>{reminder.ActPrgTitle}</h3>
                <p><strong>Inicio: </strong>{formatFecha(reminder.ActFechaCompartido)}</p>
            </div>
        </div>
    </>
  )
}

export default CardOnReminder