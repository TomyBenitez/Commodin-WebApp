interface LoginParams{
    User: string;
    Password: string;
}

export const login = ({User, Password}:LoginParams) => {
    const ENDPOINT = import.meta.env.VITE_API_BASE_URL
    const FOLDER = import.meta.env.VITE_FOLDER
    const AuthenticationExt = import.meta.env.VITE_AuthenticationExt
    
  return (
    fetch(`${ENDPOINT}${FOLDER}${AuthenticationExt}/getoauthtokenExt`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({User, Password})
    }
  ).then(res =>{
    if(!res.ok) throw new Error('Response is NOT ok')
    return res.json()
  })
)}

export default login
