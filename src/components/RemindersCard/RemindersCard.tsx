import { useState, useEffect } from 'react';
import './RemindersCard.css'
import getReminders from '../../services/getReminders';
import CardOnReminder from '../CardOnReminder/CardOnReminder';

export const RemindersCard = ({ token, empresaId, secUserId, onRemindersUpdate }: { token: string, empresaId: string, secUserId:string, onRemindersUpdate: (hasActions: boolean) => void }) => {
    const [reminders, setReminders] = useState<any[]>([]);

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
            reminders.length>0 ? (
                <>
                    <h3 style={{width:'100%', textAlign:'center', paddingBottom:10, paddingTop:10 }}>Recordatorios</h3>
                    {
                    reminders.map((reminder, index)=> (
                        <CardOnReminder key={index} reminder={reminder}/>
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
