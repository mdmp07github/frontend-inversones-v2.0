import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import InputText from "@/components/own/input/input-text"
import InputNumber from "@/components/own/input/input-number"
import InputSingleSelect from "@/components/own/input/input-single-select"
import InputPicker from "@/components/own/input/input-picker"
import InputTextArea from "@/components/own/input/input-text-area"
import { Form } from "@/components/ui/form"
import Icons from "@/images/icons/icons"
import { useEffect, useRef, useState } from "react"
import { useTipoVela } from "@/context/Entidad/TipoVelaContext"
import { useModalMessage } from "@/context/Components/ModalMessageContext"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import { useAppContext } from "@/context/AppContext"
import Swal from "sweetalert2"
import { useEntidad } from "@/context/Entidad/EntidadContext"

const g_data_posiciones = [
  {
    label: "Lista de posiciones",
    options: [
      { ico: <Icons icon="" />, cod: "V", des: "Verde" },
      { ico: <Icons icon="" />, cod: "R", des: "Rojo" },
    ],
  }
]

interface iOdataTipoVelaData {
  id: string;
  tdv_tdv_cod: string;
  tdv_tdv_des: string;
  tdv_tdv_sbl: string;
  tdv_tdv_col: string;
  tdv_tdv_cdf: string;
  tdv_tdv_cdt: string;
  tdv_tdv_prd: string;
}

interface iListTipoVela {
  label: string;
  options: {
    ico?: JSX.Element;
    cod: string;
    des: string;
  }[];
}

interface TipoVelaData {
  id: string;
  tdv_tdv_cod: string;
  tdv_tdv_des: string;
  tdv_tdv_sbl: string;
  tdv_tdv_col: string;
  tdv_tdv_cdf: string;
  tdv_tdv_cdt: string;
  tdv_tdv_prd: string;
}

function fun_tipo_vela_codigo(s_data: TipoVelaData[], s_cod: string) {

  const item = s_data.find(x => x.tdv_tdv_cod === s_cod);
  return item ? item.id : "";
}

function Insertar() {

  const { fun_context_entidad_insert } = useEntidad();
  const { fun_context_tipo_vela_list_all } = useTipoVela();
  const { data } = useAppContext();
  const { fun_context_modal_message, fun_context_target_message } = useModalMessage();
  const [vOdataTipoVela, setOdataTipoVela] = useState<iOdataTipoVelaData[]>([])
  const [vListTipoVela, setListTipoVela] = useState<iListTipoVela[]>([])
  const o_navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {

    if (hasRun.current) return;
    hasRun.current = true;

    async function met_procedimiento() {

      let o_response_1 = await fun_context_tipo_vela_list_all();

      if (o_response_1.validation === "OK") {
        if (o_response_1.response.result !== undefined) {
          setOdataTipoVela(o_response_1.response.result.rows);
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
    met_procedimiento();
  }, [])

  useEffect(() => {

    if (vOdataTipoVela.length === 0) return;

    let oVector: any[] = [];
    vOdataTipoVela.forEach(reg => {
      const oLlave = {
        ico: <Icons icon="" />,
        cod: reg.tdv_tdv_cod,
        des: reg.tdv_tdv_des,
      };
      oVector.push(oLlave);
    });

    setListTipoVela([
      {
        label: "Lista de tipos de vela",
        options: oVector,
      }
    ]);
  }, [vOdataTipoVela]);

  const formSchema = z.object({
    idEntidad: z.string().min(1, "La entidad es obligatoria"),
    idNombre: z.string().optional(),
    idPosicion: z.string().min(1, "Debe seleccionar una posición"),
    idTipoVela: z.string().min(1, "Debe seleccionar el tipo de vela"),
    idFechaRegistro: z.date({ message: "Debe seleccionar una fecha." }),
    idValor: z.string().min(1, "El valor debe ser mayor o igual a 0"),
    idDescripcion: z.string().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idEntidad: data?.idCbxAccion || "",
      idNombre: "",
      idPosicion: "",
      idTipoVela: "",
      idFechaRegistro: new Date(),
      idValor: "0.00",
      idDescripcion: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {

    Swal.fire({
      title: "Solicitud de confirmación",
      text: "¿Desea guardar los datos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#089981",
      cancelButtonColor: "#F23645",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      theme: "dark"
    }).then(async (result) => {
      if (result.isConfirmed) {

        let o_payload_1 = {
          ent_ent_cod: values.idEntidad,
          ent_ent_nom: values.idNombre,
          ent_ent_des: values.idDescripcion,
          ent_ent_tdv: fun_tipo_vela_codigo(vOdataTipoVela, values.idTipoVela),
          ent_ent_pos: values.idPosicion,
          ent_ent_fdr: values.idFechaRegistro.getFullYear().toString() + "-" + (values.idFechaRegistro.getMonth() + 1).toString().padStart(2, '0') + "-" + values.idFechaRegistro.getDate().toString().padStart(2, '0'),
          ent_ent_hdr: values.idFechaRegistro.getHours().toString().padStart(2, '0') + ":" + values.idFechaRegistro.getMinutes().toString().padStart(2, '0'),
          ent_ent_val: parseFloat(values.idValor).toFixed(4).toString(),
          ent_ent_ano: values.idFechaRegistro.getFullYear().toString(),
        }
        /* console.log(o_payload_1) */

        let o_response_1 = await fun_context_entidad_insert(o_payload_1);

        if (o_response_1.validation === "OK") {
          if (o_response_1.response.result !== undefined) {
            fun_context_modal_message("S", "Mensaje de éxito", "Los datos se han guardado correctamente.");
            o_navigate('/entidad');
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

  let on_click_limpiar = () => {

    Swal.fire({
      title: "Solicitud de confirmación",
      text: "¿Desea limpiar los campos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#089981",
      cancelButtonColor: "#F23645",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      theme: "dark"
    }).then(async (result) => {
      if (result.isConfirmed) {
        form.reset();
      }
    });
  }

  let on_click_cancelar = () => {

    Swal.fire({
      title: "Solicitud de confirmación",
      text: "¿Desea cancelar la operación?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#089981",
      cancelButtonColor: "#F23645",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      theme: "dark"
    }).then(async (result) => {
      if (result.isConfirmed) {
        o_navigate('/entidad');
      }
    });
  }

  return (
    <>
      <div className="flex justify-between w-full">
        <h4 className="text-3xl font-semibold text-neutral-700 dark:text-neutral-200 underline">
          Ingresar vela
        </h4>
        <div className="flex gap-2">
          <Button variant="green" onClick={form.handleSubmit(onSubmit)}>
            <Icons icon="save" />Guardar
          </Button>
          <Button variant="blue" onClick={() => on_click_limpiar()}>
            <Icons icon="clear1" />Limpiar
          </Button>
          <Button variant="red" onClick={() => on_click_cancelar()}>
            <Icons icon="cancel1" />Cancelar
          </Button>
        </div>
      </div>
      <div className="w-full mt-5">
        <Form {...form}>
          <form className="space-y-2">
            <div className="flex gap-2 m-1 mt-2">
              <InputText form={form} name="idEntidad" label="Entidad" placeholder="Ingrese entidad" disable binding />
              <InputText form={form} name="idNombre" label="Nombre" placeholder="Ingrese nombre" />
              <InputSingleSelect form={form} name="idPosicion" label="Posición" data={g_data_posiciones} placeholder="-- Seleccione --" selGroup binding />
            </div>
            <div className="flex gap-2 m-1 mt-5">
              <InputSingleSelect form={form} name="idTipoVela" label="Tipo de vela" data={vListTipoVela} placeholder="-- Seleccione --" selGroup binding />
              <InputPicker form={form} name="idFechaRegistro" label="Fecha de registro" placeholder="Ingrese fecha de registro" format="dd/mm/yyyy" binding />
              <InputNumber form={form} name="idValor" label="Valor" placeholder="Ingrese valor" maxDecimal={4} fixed binding />
            </div>
            <div className="flex gap-2 m-1 mt-5">
              <InputTextArea form={form} name="idDescripcion" label="Descripción" placeholder="Ingrese descripción" />
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

export default Insertar;