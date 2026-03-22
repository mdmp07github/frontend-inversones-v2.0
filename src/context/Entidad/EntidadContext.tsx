import { createContext, useContext } from "react";
import { RequestListAll, RequestListPage, RequestListOne, RequestCount, RequestFilter, RequestInsert, RequestUpdate, RequestDelete } from '../../api/Entidad/entidad';
import { isAxiosError } from 'axios';

type EntidadResponse = {
  validation: string;
  response: any;
};

interface EntidadContextType {
  fun_context_entidad_list_all: () => Promise<EntidadResponse>;
  fun_context_entidad_list_page: (page: number, records: number) => Promise<EntidadResponse>;
  fun_context_entidad_list_one: (id: string) => Promise<EntidadResponse>;
  fun_context_entidad_count: () => Promise<EntidadResponse>;
  fun_context_entidad_filter: (P1: string, P2: string, P3: string, P4: string, P5: string, P6: string, P7: string, P8: string) => Promise<EntidadResponse>;
  fun_context_entidad_insert: (s_payload: {}) => Promise<EntidadResponse>;
  fun_context_entidad_update: (id: string, s_payload: {}) => Promise<EntidadResponse>;
  fun_context_entidad_delete: (id: string) => Promise<EntidadResponse>;
}

export const EntidadContext = createContext<EntidadContextType | undefined>(undefined);

export const useEntidad = () => {

  const o_context = useContext(EntidadContext);
  if (!o_context) {
    throw new Error("useEntidad deberia estar dentro de EntidadProvider")
  }

  return o_context;
}

export const EntidadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const fun_context_entidad_list_all = async () => {
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

  const fun_context_entidad_list_page = async (page: number, records: number) => {
    try {
      const o_res = await RequestListPage(page, records);
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

  const fun_context_entidad_list_one = async (id: string) => {
    try {
      const o_res = await RequestListOne(id);
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

  const fun_context_entidad_count = async () => {
    try {
      const o_res = await RequestCount();
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

  const fun_context_entidad_filter = async (P1: string, P2: string, P3: string, P4: string, P5: string, P6: string, P7: string, P8: string) => {
    try {
      const o_res = await RequestFilter(P1, P2, P3, P4, P5, P6, P7, P8);
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

  const fun_context_entidad_insert = async (s_payload: {}) => {
    try {
      const o_res = await RequestInsert(s_payload);
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

  const fun_context_entidad_update = async (id: string, s_payload: {}) => {
    try {
      const o_res = await RequestUpdate(id, s_payload);
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

  const fun_context_entidad_delete = async (id: string) => {
    try {
      const o_res = await RequestDelete(id);
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
    <EntidadContext.Provider value={{
      fun_context_entidad_list_all,
      fun_context_entidad_list_page,
      fun_context_entidad_list_one,
      fun_context_entidad_count,
      fun_context_entidad_filter,
      fun_context_entidad_insert,
      fun_context_entidad_update,
      fun_context_entidad_delete
    }}>
      {children}
    </EntidadContext.Provider>
  )
}