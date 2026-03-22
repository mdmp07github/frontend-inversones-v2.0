import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"
import { Link, useNavigate } from "react-router-dom"
import { Form } from "@/components/ui/form"
import { z } from "zod"
import Icons from "@/images/icons/icons"
import imgGithub from "@/images/images/imgGithub.png"
import imgGoogle from "@/images/images/imgGoogle.png"
import imgFacebook from "@/images/images/imgFacebook.png"
import InputPassword from "@/components/own/input/input-password"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import InputText from "@/components/own/input/input-text"
import { useAuth } from "@/context/Autenticacion/AuthContext"
import { useModalMessage } from "@/context/Components/ModalMessageContext"
import { Spinner } from "@/components/ui/spinner"
import { useEffect, useState, useTransition } from "react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { fun_context_registrar_usuario, fun_context_obtener_one_usuario } = useAuth();
  const { fun_context_target_message, fun_context_modal_message } = useModalMessage();
  const [valueLoadingButton, setValueLoadingButton] = useState(false);
  const [valuePending, startTransitionPending] = useTransition();
  const o_navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  const formSchema = z.object({
    idNombres: z.string().min(1, {
      message: "El nombre es obligatorio.",
    }),
    idApellidos: z.string().min(1, {
      message: "El apellido es obligatorio.",
    }),
    idCorreo: z.string().min(1, {
      message: "El correo es obligatorio.",
    }),
    idPassword: z.string().min(1, {
      message: "La contraseña es obligatoria.",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idNombres: "Mauro",
      idApellidos: "Miche",
      idCorreo: "mauro.miche.perez@outlook.com",
      idPassword: "Mauro123",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {

    startTransitionPending(() => {
      async function met_procedimiento() {

        setValueLoadingButton(true);

        let o_payload_1 = {
          usu_usu_eml: values.idCorreo
        }

        let o_payload_2 = {
          usu_usu_urn: values.idNombres,
          usu_usu_ura: values.idApellidos,
          usu_usu_eml: values.idCorreo,
          usu_usu_pwd: values.idPassword,
        }

        let o_response_1 = await fun_context_obtener_one_usuario(o_payload_1);

        let o_validar_1 = false;
        if (o_response_1.validation === "OK") {
          if (o_response_1.response.result.length === 0) {
            o_validar_1 = true;
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

        if (o_validar_1) {

          let o_response_2 = await fun_context_registrar_usuario(o_payload_2);

          if (o_response_2.validation === "OK") {
            o_navigate("/signin");
            fun_context_modal_message("S", "Mensaje de éxito", "Se creó con éxito el usuario.");
          } else if (o_response_2.validation === "E1") {
            if (typeof o_response_2.response.message !== "string") {
              for (let i = 0; i < o_response_2.response.message.length; i++) {
                fun_context_target_message("E", "Error: " + o_response_2.response.error, o_response_2.response.message[i]);
              }
            } else {
              fun_context_target_message("E", o_response_2.response.error, o_response_2.response.message);
            }
          } else if (o_response_2.validation === "E2") {
            fun_context_target_message("E", "Error: 500", o_response_2.response);
          } else {
            fun_context_target_message("E", "Error: 500", o_response_2.response);
          }
        }

        setValueLoadingButton(false);
      }
      met_procedimiento();
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crea tu cuenta</CardTitle>
          <CardDescription>
            Introduce tu correo electrónico a continuación para crear tu cuenta, o utiliza tu cuenta de GitHub, Google o Facebook para registrarte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <div className="flex gap-2">
                  <Button className="w-full flex flex-1" variant="black" type="button">
                    <img src={imgGithub} alt={"Imagen Github"} className="w-6 h-6" />
                    GitHub
                  </Button>
                  <Button className="w-full flex flex-1" variant="black" type="button">
                    <img src={imgGoogle} alt={"Imagen Google"} className="w-6 h-6" />
                    Google
                  </Button>
                  <Button className="w-full flex flex-1" variant="black" type="button">
                    <img src={imgFacebook} alt={"Imagen Facebook"} className="w-6 h-6" />
                    Facebook
                  </Button>
                </div>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  O continuar con
                </FieldSeparator>
                <div className="flex gap-4">
                  <InputText form={form} name="idNombres" label="Nombres" placeholder="Ingrese Nombres" binding />
                  <InputText form={form} name="idApellidos" label="Apellidos" placeholder="Ingrese Apellidos" binding />
                </div>
                <InputText form={form} name="idCorreo" label="Correo Electrónico" placeholder="Ingrese Correo" binding />
                <InputPassword form={form} name="idPassword" label="Contraseña" placeholder="Ingrese Contraseña" binding />
                <Field>
                  <Button type="submit" variant="green" disabled={valueLoadingButton || valuePending}>
                    {valueLoadingButton || valuePending ? (
                      <>
                        <Spinner />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Icons icon="add-user-male" />
                        Crear Cuenta
                      </>
                    )}
                  </Button>
                  <FieldDescription className="text-center">
                    ¿Ya tienes una cuenta? <Link to="/signin">Iniciar sesión</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Al hacer clic en continuar, acepta nuestros <a href="#">Términos de servicio</a>{" "}
        y <a href="#">Política de privacidad</a>.
      </FieldDescription>
    </div>
  )
}
