import { EntidadProvider } from "@/context/Entidad/EntidadContext";
import { AuthProvider } from "@/context/Autenticacion/AuthContext";
import { TipoVelaProvider } from "@/context/Entidad/TipoVelaContext";
import { AppProvider } from "@/context/AppContext";

const providers = [AppProvider, AuthProvider, EntidadProvider, TipoVelaProvider];

export const AppProviders = ({ children }: { children: React.ReactNode }) =>
  providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );