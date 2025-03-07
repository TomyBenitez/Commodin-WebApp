import Login from "./pages/Login/Login";
import { UserContextProvider } from "./context/UserContext";
import useUser from "./hooks/useUser";
import { Home } from "./pages/home/Home";

export const App = () => {
  return (
    <UserContextProvider>
      <AppContent />
    </UserContextProvider>
  );
};

const AppContent = () => {
  const { isLogged } = useUser(); //importar el logout cuando esté hecho

  return isLogged ? <Home /> : <Login />;
};

export default App;