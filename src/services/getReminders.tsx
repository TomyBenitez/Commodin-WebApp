interface UserData{
    SecUserId:string;
    EmpresaId: string;
    Token: string;
}

export const getReminders = ({SecUserId, EmpresaId, Token}:UserData) => {
    const ENDPOINT = import.meta.env.VITE_API_BASE_URL
    const FOLDER = import.meta.env.VITE_FOLDER
    const RemindersExt = import.meta.env.VITE_RemindersExt
    
  return (
    fetch(`${ENDPOINT}${FOLDER}${RemindersExt}/getreminders?SecUserId=${SecUserId}&EmpresaId=${EmpresaId}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${Token}`
        },
        cache:'no-store'
    }
  ).then(res =>{
    if(!res.ok) throw new Error('Response is NOT ok')
    return res.json()
  })
)}

export default getReminders