import { BrowserRouter } from "react-router-dom";
import { EmpresaProvider } from "./contexts/EmpresaContext";
import { AppRoutes } from "./routes/routes";
import { FloatingButtons } from "./components/FloatingButtons";

function App() {
  return (
    <EmpresaProvider>
      <BrowserRouter>
        <AppRoutes />
        <FloatingButtons />
      </BrowserRouter>
    </EmpresaProvider>
  );
}

export default App;
