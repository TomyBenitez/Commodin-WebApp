import Login from "./pages/Login";

const isLogged = false;
export const App = () => {
  return (
   <>
    {
      isLogged ? (
        <h1>Welcome to the App</h1>
      ) : (
        <Login />
      )
    }
   </>
  )
}

export default App;