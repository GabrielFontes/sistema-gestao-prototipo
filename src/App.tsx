import { BrowserRouter } from "react-router-dom";
import { EmpresaProvider } from "./contexts/EmpresaContext";
import { AppRoutes } from "./routes/routes";
import { ChatButton } from "./components/ChatButton";

function App() {
  return (
    <EmpresaProvider>
      <BrowserRouter>
        <AppRoutes />
        <ChatButton />
      </BrowserRouter>
    </EmpresaProvider>
  );
}

export default App;
