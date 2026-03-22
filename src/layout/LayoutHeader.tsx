import { ModeToggle } from "@/components/mode-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Icons from "@/images/icons/icons"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/Autenticacion/AuthContext"
import { useModalMessage } from "@/context/Components/ModalMessageContext"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

function LayoutHeader() {

  const { fun_context_profile, fun_context_cerrar_sesion, isAuthenticated } = useAuth();
  const { fun_context_target_message } = useModalMessage();
  const [valueVisibleProfile, setVisibleProfile] = useState(false);
  const [valueNombreCompleto, setNombreCompleto] = useState("");
  const [valueNombreAvatar, setNombreAvatar] = useState("");
  const [valueCorreo, setCorreo] = useState("");
  const [valuePlan, setPlan] = useState("");
  const o_navigate = useNavigate();

  useEffect(() => {

    if (isAuthenticated) {

      async function met_profile() {
        let o_response_1 = await fun_context_profile();

        setVisibleProfile(false);
        if (o_response_1.validation === "OK") {
          if (o_response_1.response.result !== undefined) {
            let s_obj = o_response_1.response.result;
            setNombreCompleto(s_obj.usu_usu_urn + " " + s_obj.usu_usu_ura)
            setNombreAvatar(s_obj.usu_usu_urn.substring(0, 1) + s_obj.usu_usu_ura.substring(0, 1))
            setCorreo(s_obj.usu_usu_eml);
            setPlan(s_obj.usu_usu_pln === "F" ? "Plan FREE" : "Plan PRO")
            setVisibleProfile(true);
          } else {
            fun_context_target_message("W", "Mensaje de advertencia", o_response_1.response.message);
            met_cerrar_sesion();
          }
        } else if (o_response_1.validation === "E1") {
          if (typeof o_response_1.response.message !== "string") {
            for (let i = 0; i < o_response_1.response.message.length; i++) {
              fun_context_target_message("E", "Error: " + o_response_1.response.error, o_response_1.response.message[i]);
            }
          } else {
            fun_context_target_message("E", o_response_1.response.error, o_response_1.response.message);
          }
          met_cerrar_sesion();
        } else if (o_response_1.validation === "E2") {
          fun_context_target_message("E", "Error: 500", o_response_1.response);
          met_cerrar_sesion();
        } else {
          fun_context_target_message("E", "Error: 500", o_response_1.response);
          met_cerrar_sesion();
        }
      }
      met_profile();
    }
  }, [isAuthenticated])

  const fun_on_click_cerrar_sesion = () => {

    Swal.fire({
      title: "Solicitud de confirmación",
      text: "¿Desea cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#14a44d",
      cancelButtonColor: "#dc4c64",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      theme: "dark"
    }).then(async (result) => {
      if (result.isConfirmed) {
        let o_response_1 = await fun_context_cerrar_sesion();

        if (o_response_1.validation === "OK") {
          if (o_response_1.response.result !== undefined) {
            o_navigate('/')
            location.reload();
          } else {
            fun_context_target_message("W", "Mensaje de advertencia", o_response_1.response.message);
          }
        } else if (o_response_1.validation === "E1") {
          if (typeof o_response_1.response.message !== "string") {
            for (let i = 0; i < o_response_1.response.message.length; i++) {
              fun_context_target_message("E", "Error: " + o_response_1.response.error, o_response_1.response.message[i]);
            }
          } else {
            fun_context_target_message("E", o_response_1.response.error, o_response_1.response.message);
          }
        } else if (o_response_1.validation === "E2") {
          fun_context_target_message("E", "Error: 500", o_response_1.response);
        } else {
          fun_context_target_message("E", "Error: 500", o_response_1.response);
        }
      }
    });
  }

  const met_cerrar_sesion = async () => {

    let o_response_1 = await fun_context_cerrar_sesion();

    if (o_response_1.validation === "OK") {
      if (o_response_1.response.result !== undefined) {
        o_navigate('/')
        console.log("Sesión cerrada correctamente");
      } else {
        fun_context_target_message("W", "Mensaje de advertencia", o_response_1.response.message);
      }
    } else if (o_response_1.validation === "E1") {
      if (typeof o_response_1.response.message !== "string") {
        for (let i = 0; i < o_response_1.response.message.length; i++) {
          fun_context_target_message("E", "Error: " + o_response_1.response.error, o_response_1.response.message[i]);
        }
      } else {
        fun_context_target_message("E", o_response_1.response.error, o_response_1.response.message);
      }
    } else if (o_response_1.validation === "E2") {
      fun_context_target_message("E", "Error: 500", o_response_1.response);
    } else {
      fun_context_target_message("E", "Error: 500", o_response_1.response);
    }
  }

  const fun_on_click_inciar_sesion = () => {
    o_navigate('/signin')
  }

  const fun_on_click_registrarse = () => {
    o_navigate('/signup')
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-muted/50">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex gap-2 items-center">
          {isAuthenticated && valueVisibleProfile ? (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>MM</AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 mx-3">
                  <div className="flex justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 shrink-0">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>{valueNombreAvatar}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-none">{valueNombreCompleto}</p>
                        <p className="text-blue-400 hover:underline text-sm break-all leading-normal">
                          {valueCorreo}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mt-2">
                      <span className="font-semibold leading-none">Plan: </span>
                      <Badge variant="green" className="whitespace-nowrap">
                        {valuePlan}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm mt-3">
                    <p>Desarrollador full-stack 🎉</p>
                    <ul className="ml-6 list-disc [&>li]:mt-1">
                      <li><span className="underline">Front-End:</span> React, NextJS</li>
                      <li><span className="underline">Back-End:</span> NestJs, PostgreSQL</li>
                    </ul>
                  </div>
                  <div className="mt-3 text-sm space-y-1">
                    <p>📍 Jr. Lucanas 171 José Gálvez, VMT</p>
                    <p>🔗 <a href="https://ui.shadcn.com/docs/components" className="text-blue-400 hover:underline">ui.shadcn.com</a></p>
                    <p>💼 Abierta a freelance y colaboraciones.</p>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex gap-2">
                    <Button variant="orange" className="flex-1 flex">
                      <Icons icon="user1" />
                      <span>Perfil</span>
                    </Button>
                    <Button variant="blue" className="flex-1 flex">
                      <Icons icon="setting1" />
                      <span>Ajustes</span>
                    </Button>
                  </div>
                  <Button variant="red" className="w-full mt-2" onClick={() => fun_on_click_cerrar_sesion()}>
                    <Icons icon="logout" />
                    <span>Cerrar Sesión</span>
                  </Button>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
              <Button type="submit" variant="green" onClick={() => fun_on_click_inciar_sesion()}>
                <Icons icon="user1" />
                <span>Iniciar Sesión</span>
              </Button>
              <Button type="submit" variant="blue" onClick={() => fun_on_click_registrarse()}>
                <Icons icon="add-user-male" />
                <span>Regístrate</span>
              </Button>
            </>
          )}
          <ModeToggle />
        </div>
      </header>
    </>
  )
}

export default LayoutHeader