import { createContext, useContext, useEffect, useState } from "react";
import { RequestSignIn, RequestRegister, RequestGetOne, RequestVerifyToken, RequestProfile, RequestLogout, RequestEmail, RequestVerificarCodigo, RequestRestPassword } from '../../api/Autenticacion/auth';
import Cookies from 'js-cookie'
import { useModalMessage } from "../Components/ModalMessageContext";
import { isAxiosError } from 'axios';

type AuthResponse = {
  validation: string;
  response: any;
};

type AuthContextType = {
  fun_context_signin_usuario: (s_payload: {}) => Promise<AuthResponse>;
  fun_context_registrar_usuario: (s_payload: {}) => Promise<AuthResponse>;
  fun_context_obtener_one_usuario: (s_payload: {}) => Promise<AuthResponse>;
  fun_context_profile: () => Promise<AuthResponse>;
  fun_context_cerrar_sesion: () => Promise<AuthResponse>;
  fun_context_email: (s_payload: {}) => Promise<AuthResponse>;
  fun_context_verificar_codigo: (s_payload: {}) => Promise<AuthResponse>;
  fun_context_restablecer_password: (s_payload: {}) => Promise<AuthResponse>;
  valueUser: string | null;
  valueEmail: string | null;
  isAuthenticated: boolean;
  valueSignAuthorized: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {

  const o_context = useContext(AuthContext);
  if (!o_context) {
    throw new Error("useAuth deberia estar dentro de AuthProvider")
  }

  return o_context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [valueUser, setValueUser] = useState<string | null>(null);
  const [valueEmail, setValueEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [valueSignAuthorized, setValueSignAuthorized] = useState(false);
  const { fun_context_target_message } = useModalMessage();

  useEffect(() => {

    async function verify_login() {

      const o_cookie = Cookies.get();

      let o_token = {
        usu_usu_tkn: o_cookie.token
      }

      if (o_cookie.token && o_cookie.token !== "") {
        try {
          const o_res = await RequestVerifyToken(o_token);

          if (o_res.data) {
            setValueUser(o_res.data.result);
            setIsAuthenticated(true);
          } else {
            setValueUser(null);
            setIsAuthenticated(false);
          }
        } catch (error: unknown) {

          let o_data = null;
          if (isAxiosError(error)) {
            o_data = error.response?.data;
            if (typeof o_data.message !== "string") {
              for (let i = 0; i < o_data.message.length; i++) {
                fun_context_target_message("E", "Error: " + o_data.error, o_data.message[i]);
              }
            } else {
              fun_context_target_message("E", "Error: " + o_data.error, o_data.message);
            }
          } else if (error instanceof Error) {
            fun_context_target_message("E", "Error: 500", error.message);
          } else {
            fun_context_target_message("E", "Error: 500", String(error));
          }

          setValueUser(null);
          setIsAuthenticated(false);
        }
      } else {
        /* fun_context_target_message("W", "Mensaje de advertencia", "Favor de iniciar sesión"); */
      }
    }
    verify_login();
  }, [])

  const fun_context_signin_usuario = async (s_payload: {}) => {

    try {
      const o_res = await RequestSignIn(s_payload);
      setValueUser(o_res.data.result);
      setIsAuthenticated(true);
      return {
        validation: "OK",
        response: o_res.data
      };
    } catch (error: unknown) {

      let o_data: any = null;
      let o_error = "";

      if (isAxiosError(error)) {
        if (error.response) {
          // El servidor respondió con un código de error
          o_data = error.response.data;
          o_error = "E1";
        } else {
          // No hubo respuesta del servidor (por ejemplo, problema de red)
          o_data = error.message;
          o_error = "E2";
        }
      } else {
        // Otro tipo de error (no Axios) o Error completamente desconocido
        o_data = (error instanceof Error) ? error.message : String(error);
        o_error = "E3";
      }

      return {
        validation: o_error,
        response: o_data
      };
    }
  }

  const fun_context_registrar_usuario = async (s_payload: {}) => {

    try {
      const o_res = await RequestRegister(s_payload);
      setValueUser(o_res.data.result);
      return {
        validation: "OK",
        response: o_res.data
      };
    } catch (error: unknown) {

      let o_data: any = null;
      let o_error = "";

      if (isAxiosError(error)) {
        if (error.response) {
          // El servidor respondió con un código de error
          o_data = error.response.data;
          o_error = "E1";
        } else {
          // No hubo respuesta del servidor (por ejemplo, problema de red)
          o_data = error.message;
          o_error = "E2";
        }
      } else {
        // Otro tipo de error (no Axios) o Error completamente desconocido
        o_data = (error instanceof Error) ? error.message : String(error);
        o_error = "E3";
      }

      return {
        validation: o_error,
        response: o_data
      };
    }
  }

  const fun_context_obtener_one_usuario = async (s_payload: {}) => {

    try {
      const o_res = await RequestGetOne(s_payload);
      setValueUser(o_res.data.result);
      return {
        validation: "OK",
        response: o_res.data
      };
    } catch (error: unknown) {

      let o_data: any = null;
      let o_error = "";

      if (isAxiosError(error)) {
        if (error.response) {
          // El servidor respondió con un código de error
          o_data = error.response.data;
          o_error = "E1";
        } else {
          // No hubo respuesta del servidor (por ejemplo, problema de red)
          o_data = error.message;
          o_error = "E2";
        }
      } else {
        // Otro tipo de error (no Axios) o Error completamente desconocido
        o_data = (error instanceof Error) ? error.message : String(error);
        o_error = "E3";
      }

      return {
        validation: o_error,
        response: o_data
      };
    }
  }

  const fun_context_profile = async () => {

    try {
      const o_res = await RequestProfile();
      setValueUser(o_res.data.result);
      return {
        validation: "OK",
        response: o_res.data
      };
    } catch (error: unknown) {

      let o_data: any = null;
      let o_error = "";

      if (isAxiosError(error)) {
        if (error.response) {
          // El servidor respondió con un código de error
          o_data = error.response.data;
          o_error = "E1";
        } else {
          // No hubo respuesta del servidor (por ejemplo, problema de red)
          o_data = error.message;
          o_error = "E2";
        }
      } else {
        // Otro tipo de error (no Axios) o Error completamente desconocido
        o_data = (error instanceof Error) ? error.message : String(error);
        o_error = "E3";
      }

      return {
        validation: o_error,
        response: o_data
      };
    }
  }

  const fun_context_cerrar_sesion = async () => {

    try {
      const o_res = await RequestLogout();
      setValueUser(o_res.data.result);
      return {
        validation: "OK",
        response: o_res.data
      };
    } catch (error: unknown) {

      let o_data: any = null;
      let o_error = "";

      if (isAxiosError(error)) {
        if (error.response) {
          // El servidor respondió con un código de error
          o_data = error.response.data;
          o_error = "E1";
        } else {
          // No hubo respuesta del servidor (por ejemplo, problema de red)
          o_data = error.message;
          o_error = "E2";
        }
      } else {
        // Otro tipo de error (no Axios) o Error completamente desconocido
        o_data = (error instanceof Error) ? error.message : String(error);
        o_error = "E3";
      }

      return {
        validation: o_error,
        response: o_data
      };
    }
  }

  const fun_context_email = async (s_payload: {}) => {

    try {
      const o_res = await RequestEmail(s_payload);
      return {
        validation: "OK",
        response: o_res.data
      };
    } catch (error: unknown) {

      let o_data: any = null;
      let o_error = "";

      if (isAxiosError(error)) {
        if (error.response) {
          // El servidor respondió con un código de error
          o_data = error.response.data;
          o_error = "E1";
        } else {
          // No hubo respuesta del servidor (por ejemplo, problema de red)
          o_data = error.message;
          o_error = "E2";
        }
      } else {
        // Otro tipo de error (no Axios) o Error completamente desconocido
        o_data = (error instanceof Error) ? error.message : String(error);
        o_error = "E3";
      }

      return {
        validation: o_error,
        response: o_data
      };
    }
  }

  const fun_context_verificar_codigo = async (s_payload: {}) => {

    try {
      const o_res = await RequestVerificarCodigo(s_payload);
      setValueEmail(o_res.data.result.usu_usu_eml);
      setValueSignAuthorized(true);
      return {
        validation: "OK",
        response: o_res.data
      };
    } catch (error: unknown) {

      let o_data: any = null;
      let o_error = "";

      if (isAxiosError(error)) {
        if (error.response) {
          // El servidor respondió con un código de error
          o_data = error.response.data;
          o_error = "E1";
        } else {
          // No hubo respuesta del servidor (por ejemplo, problema de red)
          o_data = error.message;
          o_error = "E2";
        }
      } else {
        // Otro tipo de error (no Axios) o Error completamente desconocido
        o_data = (error instanceof Error) ? error.message : String(error);
        o_error = "E3";
      }

      return {
        validation: o_error,
        response: o_data
      };
    }
  }

  const fun_context_restablecer_password = async (s_payload: {}) => {

    try {
      const o_res = await RequestRestPassword(s_payload);
      setValueSignAuthorized(false);
      return {
        validation: "OK",
        response: o_res.data
      };
    } catch (error: unknown) {

      let o_data: any = null;
      let o_error = "";

      if (isAxiosError(error)) {
        if (error.response) {
          // El servidor respondió con un código de error
          o_data = error.response.data;
          o_error = "E1";
        } else {
          // No hubo respuesta del servidor (por ejemplo, problema de red)
          o_data = error.message;
          o_error = "E2";
        }
      } else {
        // Otro tipo de error (no Axios) o Error completamente desconocido
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
    <AuthContext.Provider value={{
      fun_context_signin_usuario,
      fun_context_registrar_usuario,
      fun_context_obtener_one_usuario,
      fun_context_profile,
      fun_context_cerrar_sesion,
      fun_context_email,
      fun_context_verificar_codigo,
      fun_context_restablecer_password,
      valueUser,
      valueEmail,
      isAuthenticated,
      valueSignAuthorized
    }}>
      {children}
    </AuthContext.Provider>
  )
}