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
    if (!res.ok) {
      // Lanza un error con el código de estado para que puedas capturarlo en el catch
      const error = new Error('Response is NOT ok');
      (error as any).status = res.status;
      throw error;
    }
    return res.json()
  })
)}

export default getActions