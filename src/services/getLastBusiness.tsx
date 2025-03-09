interface UserData{
    SecUserId: string;
    Token: string;
}

export const getLastBusiness = ({SecUserId, Token}:UserData) => {
    const ENDPOINT = import.meta.env.VITE_API_BASE_URL
    const FOLDER = import.meta.env.VITE_FOLDER
    const EnterpriceUser = import.meta.env.VITE_EnterpriceUser
    
  return (
    fetch(`${ENDPOINT}${FOLDER}${EnterpriceUser}/getlastenterprice?SecUserId=${SecUserId}`,{
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

export default getLastBusiness