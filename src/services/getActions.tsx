interface UserData{
    EmpresaId: string;
    Token: string;
}

export const getActions = ({EmpresaId, Token}:UserData) => {
    const ENDPOINT = import.meta.env.VITE_API_BASE_URL
    const FOLDER = import.meta.env.VITE_FOLDER
    const Actions = import.meta.env.VITE_Actions
    
  return (
    fetch(`${ENDPOINT}${FOLDER}${Actions}/getallactions?EmpresaId=${EmpresaId}`,{
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

export default getActions