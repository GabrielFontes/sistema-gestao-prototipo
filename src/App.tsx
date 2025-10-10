import { BrowserRouter, useLocation } from "react-router-dom";
import { EmpresaProvider } from "./contexts/EmpresaContext";
import { AppRoutes } from "./routes/routes";
import { ChatButton } from "./components/ChatButton";

function ChatButtonWrapper() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  
  if (isLoginPage) return null;
  return <ChatButton />;
}

function App() {
  return (
    <EmpresaProvider>
      <BrowserRouter>
        <AppRoutes />
        <ChatButtonWrapper />
      </BrowserRouter>
    </EmpresaProvider>
  );
}

export default App;
