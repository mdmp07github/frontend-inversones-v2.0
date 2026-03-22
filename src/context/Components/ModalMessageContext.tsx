import React, { createContext, useContext } from "react";
import Swal, { SweetAlertResult } from "sweetalert2";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

type MessageType = "S" | "E" | "W" | "I" | "Q";

type ModalMessageContextType = {
  fun_context_target_message: (s_tipo: MessageType, s_titulo: string, s_message: string) => void;
  fun_context_modal_message: (s_tipo: MessageType, s_titulo: string, s_message: string) => Promise<SweetAlertResult<any>> | undefined;
};

export const ModalMessageContext = createContext<ModalMessageContextType | undefined>(undefined);

export const useModalMessage = () => {

  const o_context = useContext(ModalMessageContext);
  if (!o_context) {
    throw new Error("useModalMessage deberia estar dentro de ModalMessageProvider")
  }

  return o_context;
}

export const ModalMessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const fun_context_target_message = (s_tipo: MessageType, s_titulo: string, s_message: string) => {
    const common = {
      description: s_message,
      duration: 2500
    }

    switch (s_tipo) {
      case "S":
        toast.success(s_titulo, { position: "top-right", ...common });
        break;
      case "E":
        toast.error(s_titulo, { position: "top-right", ...common });
        break;
      case "W":
        toast.warning(s_titulo, { position: "top-right", ...common });
        break;
      case "I":
        toast.info(s_titulo, { position: "top-right", ...common });
        break;
      case "Q":
        toast(s_titulo, { position: "top-right", ...common });
        break;
      default:
        toast(s_titulo, { position: "top-right", ...common });
    }
  }

  const fun_context_modal_message = (s_tipo: MessageType, s_titulo: string, s_message: string) => {

    if (s_tipo === "S") {
      return Swal.fire({
        title: s_titulo,
        text: s_message,
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#089981",
        theme: "dark"
      });
    } else if (s_tipo === "E") {
      return Swal.fire({
        title: s_titulo,
        text: s_message,
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#F23645",
        theme: "dark"
      });
    } else if (s_tipo === "W") {
      return Swal.fire({
        title: s_titulo,
        text: s_message,
        icon: "warning",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#c6b342",
        theme: "dark"
      });
    } else if (s_tipo === "I") {
      return Swal.fire({
        title: s_titulo,
        text: s_message,
        icon: "info",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#0d6efd",
        theme: "dark"
      });
    } else if (s_tipo === "Q") {
      return Swal.fire({
        title: s_titulo,
        text: s_message,
        icon: "question",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#6c757d",
        theme: "dark"
      });
    }
  }

  return (
    <ModalMessageContext.Provider value={{
      fun_context_target_message,
      fun_context_modal_message
    }}>
      <Toaster />
      {children}
    </ModalMessageContext.Provider>
  )
}