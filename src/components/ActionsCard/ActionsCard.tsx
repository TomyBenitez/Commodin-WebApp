import { useState, useEffect } from "react";
import getActions from "../../services/getActions";
import CardOnLive from "../CardOnLive/CardOnLive";
import './ActionsCard.css'


export const ActionsCard = ({ token, empresaId, onActionsUpdate }: { token: string, empresaId: string, onActionsUpdate: (hasActions: boolean) => void }) => {
    const [actions, setActions] = useState<any[]>([]);
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
                onActionsUpdate(allActions.length > 0);

            } catch (error) {
                console.error("Error obteniendo los datos del negocio:", error);
            }
        };
    
        fetchActionsData();
    }, [token, empresaId]);
  return (
    <>
        {
            actions.length>0 ? (
                <>
                    <h3 style={{width:'100%', textAlign:'center', paddingBottom:10 }}>Ahora mismo</h3>
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
    </>
  )
}
