import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ModalMessageProvider } from "./context/Components/ModalMessageContext";
import { AppProviders } from "./router/ProtectedLayout"
import Dashboard from "./pages/Dashboard/Dashboard";
import LayoutSidebar from "./layout/LayoutSidebar";
import SigninPage from "./pages/Autenticacion/Signin";
import SignupPage from "./pages/Autenticacion/Signup";
import Entidad from "./pages/Entidad/Entidad";
import Insertar from "./pages/Entidad/Insertar";
import Editar from "./pages/Entidad/Editar";

function App() {

  return (
    <>
      <ModalMessageProvider>
        <Router>

          <AppProviders>
            <Routes>

              <Route element={<LayoutSidebar />}>
                {/* Dashboard */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/entidad" element={<Entidad />} />
                <Route path="/insertar" element={<Insertar />} />
                <Route path="/editar" element={<Editar />} />
              </Route>

              <Route path="/signin" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />

            </Routes>
          </AppProviders>

        </Router>
      </ModalMessageProvider>
    </>
  )
}

export default App
