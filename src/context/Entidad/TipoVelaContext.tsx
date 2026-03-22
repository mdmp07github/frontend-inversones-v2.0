import { createContext, useContext } from "react";
import { RequestListAll } from '../../api/Entidad/tipo_vela';
import { isAxiosError } from 'axios';

type TipoVelaResponse = {
  validation: string;
  response: any;
};

interface TipoVelaContextType {
  fun_context_tipo_vela_list_all: () => Promise<TipoVelaResponse>;
}

export const TipoVelaContext = createContext<TipoVelaContextType | undefined>(undefined);

export const useTipoVela = () => {

  const o_context = useContext(TipoVelaContext);
  if (!o_context) {
    throw new Error("useTipoVela deberia estar dentro de TipoVelaProvider")
  }

  return o_context;
}

export const TipoVelaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const fun_context_tipo_vela_list_all = async () => {
    try {
      const o_res = await RequestListAll();
      return {
        validation: "OK",
        response: o_res.data
      };
    } catch (error: unknown) {

      let o_data: any = null;
      let o_error = "";

      if (isAxiosError(error)) {
        if (error.response) {
          o_data = error.response.data;
          o_error = "E1";
        } else {
          o_data = error.message;
          o_error = "E2";
        }
      } else {
        o_data = (error instanceof Error) ? error.message : String(error);
        o_error = "E3";
      }

      return {
        validation: o_error,
        response: o_data
      };
    }
  }

  return (
    <TipoVelaContext.Provider value={{
      fun_context_tipo_vela_list_all
    }}>
      {children}
    </TipoVelaContext.Provider>
  )
}