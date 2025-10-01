import { BrowserRouter } from "react-router-dom";
import { EmpresaProvider } from "./contexts/EmpresaContext";
import { AppRoutes } from "./routes/routes";

function App() {
  return (
    <EmpresaProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </EmpresaProvider>
  );
}

export default App;
