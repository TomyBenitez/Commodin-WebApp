import { useState, useEffect } from 'react';
import './RemindersCard.css'
import getReminders from '../../services/getReminders';
import CardOnReminder from '../CardOnReminder/CardOnReminder';

export const RemindersCard = ({ token, empresaId, secUserId, onRemindersUpdate }: { token: string, empresaId: string, secUserId:string, onRemindersUpdate: (hasActions: boolean) => void }) => {
    const [reminders, setReminders] = useState<any[]|null>(null);

    useEffect(() => {
        const fetchRemindersData = async () => {
            if (!token || !empresaId || !secUserId) return;

            try{
                let allReminders:any[] = await getReminders({
                    SecUserId:secUserId,
                    EmpresaId:empresaId,
                    Token:token
                })

                setReminders(allReminders);
                onRemindersUpdate(allReminders.length > 0);
            }catch(err){
                console.error(err)
            }
        };

        fetchRemindersData();
    }, [secUserId, empresaId, token])

  return (
    <>
        {
            reminders !== null && reminders.length>0 ? (
                <>
                    <h3 className='title-reminder'>Recordatorios</h3>
                    {
                    reminders.map((reminder, index)=> (
                        <CardOnReminder key={index} reminder={reminder}/>
                    ))
                    }
                </>
            ):(
                reminders === null ?
                (
                    <>
                        <h3 className="title-reminder">Recordatorios</h3>
                        <div style={{width:'100%', display:"flex", justifyContent:"center", alignItems:"center", marginTop:5, marginBottom:5}}>
                            <div className='loader'></div>
                        </div>
                    </>
                ):(
                    <>
                        <h3 className='title-reminder'>Recordatorios</h3>
                        <div style={{width:'100%', height:50, display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <p><strong>No hay recordatorios</strong></p>
                        </div>
                    </>
                )
            )
        }
    </>
  )
}
