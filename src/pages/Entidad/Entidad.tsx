import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import InputSingleSelect from "@/components/own/input/input-single-select"
import InputPicker from "@/components/own/input/input-picker"
import { Form } from "@/components/ui/form"
import Icons from "@/images/icons/icons"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from "react-router-dom"
import { useEntidad } from "@/context/Entidad/EntidadContext"
import { useModalMessage } from "@/context/Components/ModalMessageContext"
import { useTipoVela } from "@/context/Entidad/TipoVelaContext"
import { useAppContext } from "@/context/AppContext"
import Swal from "sweetalert2"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface EntidadData {
  id: string;
  ent_ent_cod: string;
  ent_ent_nom?: string;
  ent_ent_des?: string;
  ent_ent_tdv: string;
  ent_ent_pos: string;
  ent_ent_val: string;
  ent_ent_fdr: string;
  ent_ent_hdr: string;
  ent_ent_ano: string;
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

interface chartData {
  idEntidad: string;
  date: string;
  vAccion: number;
  valor: number;
  fullLabel: string;
  bColor: string;
  tColor: string;
  description?: string;
  tipoVelaCodigo: string;
  entidadCodigo: string;
  posicion: string;
  nombreEntidad?: string;
}

export const description = "A bar chart with negative values"

const chartConfig = {
  vAccion: {
    label: "Acción", // El texto que se verá en el tooltip
  },
  valor: {
    label: "valor",
  },
} satisfies ChartConfig

// --- Componente de Etiqueta Personalizada ---
const renderCustomLabel = (chartData: chartData[], props: any) => {
  const { x, y, value, width, index } = props;
  if (!value) return null;

  const parts = value.split(" ");
  const dateText = parts[0];
  const letter = parts[1];

  const dataItem = chartData[index];
  const isNegative = (dataItem?.valor || 0) < 0;

  // Usamos el color definido en el objeto o uno por defecto
  const bBgColor = dataItem?.bColor || "#089981";
  const btXColor = dataItem?.tColor || "#089981";

  // Ajustes de posición (fuera de la barra)
  const yOffsetDate = isNegative ? 17 : -9;

  return (
    <g>
      {/* Texto de la fecha */}
      <text
        x={x + width / 2 - 10}
        y={y}
        dy={yOffsetDate}
        fill="#fff"
        fontSize={11}
        textAnchor="middle"
      >
        {dateText}
      </text>

      {/* Fondo de la letra B (Color Dinámico) */}
      <rect
        x={x + width / 2 + 25}
        y={y + (isNegative ? 5 : -22)}
        width={18}
        height={18}
        rx={4}
        fill={bBgColor}
      />

      {/* Texto de la letra B */}
      <text
        x={x + width / 2 + 34}
        y={y + (isNegative ? 17 : -9)}
        fill={btXColor}
        fontSize={11}
        fontWeight="bold"
        textAnchor="middle"
      >
        {letter}
      </text>
    </g>
  );
};

function fun_tipo_vela_codigo(s_data: TipoVelaData[], s_cod: string) {

  const item = s_data.find(x => x.id === s_cod);
  return item ? item.tdv_tdv_cod : "";
}

function fun_tipo_vela_simbolo(s_data: TipoVelaData[], s_cod: string) {

  const item = s_data.find(x => x.id === s_cod);
  return item ? item.tdv_tdv_sbl : "";
}

function fun_tipo_vela_color_fondo(s_data: TipoVelaData[], s_cod: string) {

  const item = s_data.find(x => x.id === s_cod);
  return item ? item.tdv_tdv_cdf : "";
}

function fun_tipo_vela_color_texto(s_data: TipoVelaData[], s_cod: string) {

  const item = s_data.find(x => x.id === s_cod);
  return item ? item.tdv_tdv_cdt : "";
}

function Entidad() {

  const { fun_context_entidad_delete, fun_context_entidad_filter } = useEntidad();
  const { fun_context_tipo_vela_list_all } = useTipoVela();
  const { data, setData } = useAppContext();
  const { fun_context_modal_message, fun_context_target_message } = useModalMessage();
  const [selectedBar, setSelectedBar] = useState<any>(null)
  const [vOdataEntidad, setOdataEntidad] = useState<EntidadData[]>([])
  const [vOdataTipoVela, setOdataTipoVela] = useState<TipoVelaData[]>([])
  const [chartData, setChartData] = useState<chartData[]>([])
  const [rOpenFiltros, setOpenFiltros] = useState(false);
  const [openPopover, setOpenPopover] = useState(false)
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0, transform: "" })
  const [valoresIniciales, setValoresIniciales] = useState<any>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const o_navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {

    if (hasRun.current) return;
    hasRun.current = true;

    async function met_procedimiento() {

      let oEntidad = form.getValues().idCbxAccion || "0";

      let o_response_1 = await fun_context_entidad_filter(oEntidad, "0", "0", "0", "0", "0", "0", "0");

      if (o_response_1.validation === "OK") {
        if (o_response_1.response.result !== undefined) {
          setOdataEntidad(o_response_1.response.result.rows);
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

      let o_response_2 = await fun_context_tipo_vela_list_all();

      if (o_response_2.validation === "OK") {
        if (o_response_2.response.result !== undefined) {
          setOdataTipoVela(o_response_2.response.result.rows);
        } else {
          fun_context_target_message("W", "Mensaje de advertencia", o_response_2.response.message);
        }
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
    met_procedimiento();
  }, [])

  useEffect(() => {

    if (vOdataEntidad.length === 0 || vOdataTipoVela.length === 0) return;

    let chartData: any[] = [];

    vOdataEntidad.forEach(reg => {
      const ollave = {
        idEntidad: reg.id,
        date: reg.ent_ent_fdr,
        vAccion: parseFloat(reg.ent_ent_val),
        valor: reg.ent_ent_pos === "V" ? 250 : -250,
        fullLabel: reg.ent_ent_fdr + " " + fun_tipo_vela_simbolo(vOdataTipoVela, reg.ent_ent_tdv),
        bColor: fun_tipo_vela_color_fondo(vOdataTipoVela, reg.ent_ent_tdv),
        tColor: fun_tipo_vela_color_texto(vOdataTipoVela, reg.ent_ent_tdv),
        description: reg.ent_ent_des || "Sin descripción disponible",
        tipoVelaCodigo: fun_tipo_vela_codigo(vOdataTipoVela, reg.ent_ent_tdv),
        entidadCodigo: reg.ent_ent_cod,
        posicion: reg.ent_ent_pos,
        nombreEntidad: reg.ent_ent_nom
      };
      chartData.push(ollave);
    });

    chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setChartData(chartData);

  }, [vOdataEntidad, vOdataTipoVela]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpenPopover(false)
      }
    }

    if (openPopover) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openPopover])

  const oAcciones = [
    {
      label: "Acciones",
      options: [
        { ico: <Icons icon="trading" />, cod: "BTCUSD", des: "BTCUSD" },
        { ico: <Icons icon="trading" />, cod: "HOLO", des: "HOLO" },
        { ico: <Icons icon="trading" />, cod: "MLGO", des: "MLGO" },
        { ico: <Icons icon="trading" />, cod: "LBRA", des: "LBRA" },
        { ico: <Icons icon="trading" />, cod: "CANF", des: "CANF" },
        { ico: <Icons icon="trading" />, cod: "LAES", des: "LAES" },
        { ico: <Icons icon="trading" />, cod: "NCEW", des: "NCEW" },
        { ico: <Icons icon="trading" />, cod: "LCID", des: "LCID" },
        { ico: <Icons icon="trading" />, cod: "WNW", des: "WNW" },
        { ico: <Icons icon="trading" />, cod: "USDPEN", des: "USDPEN" },
        { ico: <Icons icon="trading" />, cod: "GELS", des: "GELS" },
        { ico: <Icons icon="trading" />, cod: "WOK", des: "WOK" },
        { ico: <Icons icon="trading" />, cod: "SLNH", des: "SLNH" },
      ].sort((a, b) => a.cod.localeCompare(b.cod)),
    }
  ]

  const oAnios = [
    {
      label: "Años",
      options: [
        { ico: <Icons icon="trading" />, cod: "2020", des: "2020" },
        { ico: <Icons icon="trading" />, cod: "2021", des: "2021" },
        { ico: <Icons icon="trading" />, cod: "2022", des: "2022" },
        { ico: <Icons icon="trading" />, cod: "2023", des: "2023" },
        { ico: <Icons icon="trading" />, cod: "2024", des: "2024" },
        { ico: <Icons icon="trading" />, cod: "2025", des: "2025" },
        { ico: <Icons icon="trading" />, cod: "2026", des: "2026" },
        { ico: <Icons icon="trading" />, cod: "2027", des: "2027" }
      ],
    }
  ]

  const formSchema = z.object({
    idCbxAccion: z.string().optional(),
    idPkrRangoFechas: z
      .object({
        from: z.date({ message: "Debe seleccionar la fecha inicial." }),
        to: z.date({ message: "Debe seleccionar la fecha final." }).optional(),
      })
      .refine((v) => v.from && v.to, {
        message: "Debe seleccionar un rango completo (inicio y fin).",
      }),
    idCbxAnio: z.string().optional(),
    tipoFiltro: z.string().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idCbxAccion: data?.idCbxAccion || "HOLO",
      idPkrRangoFechas: { from: new Date(new Date().setDate(new Date().getDate() - 7)), to: new Date() },
      idCbxAnio: new Date().getFullYear().toString(),
      tipoFiltro: "0",
    },
  })

  const tipoFiltro = form.watch("tipoFiltro");

  const onSubmitFiltros = async (values: z.infer<typeof formSchema>) => {

    console.log("Filtros aplicados:", "");

    let oFechaInicio = values.idPkrRangoFechas?.from ? values.idPkrRangoFechas.from.toISOString().split("T")[0] : "0";
    let oFechaFin = values.idPkrRangoFechas?.to ? values.idPkrRangoFechas.to.toISOString().split("T")[0] : "0";

    let o_response_1 = await fun_context_entidad_filter("0", "0", "0", "0", "0", "0", "0", "0");
    if (values.tipoFiltro === "1") {
      o_response_1 = await fun_context_entidad_filter("0", "0", "0", "0", "0", oFechaInicio, oFechaFin, "0");
    } else if (values.tipoFiltro === "2") {
      o_response_1 = await fun_context_entidad_filter("0", "0", "0", "0", "0", "0", "0", values.idCbxAnio || "0");
    }

    if (o_response_1.validation === "OK") {
      if (o_response_1.response.result !== undefined) {
        setChartData([]);
        let vOdataEntidadFilter: EntidadData[] = o_response_1.response.result.rows;
        setOdataEntidad(vOdataEntidadFilter);
        setOpenFiltros(false);
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

  const on_open_filtros = () => {
    setValoresIniciales(form.getValues()); // guardar estado actual
    setOpenFiltros(true);
  };

  const on_click_dialog_limpiar = async () => {

    form.reset()
    let oAnio = form.getValues().idCbxAnio || "0";
    let o_response_1 = await fun_context_entidad_filter("0", "0", "0", "0", "0", "0", "0", oAnio);

    if (o_response_1.validation === "OK") {
      if (o_response_1.response.result !== undefined) {
        setChartData([]);
        let vOdataEntidadFilter: EntidadData[] = o_response_1.response.result.rows;
        setOdataEntidad(vOdataEntidadFilter);
        setOpenFiltros(false);
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

  const on_click_dialog_cancelar = () => {
    if (valoresIniciales) {
      form.reset(valoresIniciales);
    }
    setOpenFiltros(false);
  };

  const on_change_entidad = async () => {

    const values = form.getValues();

    let o_response_1 = await fun_context_entidad_filter(values.idCbxAccion || "0", "0", "0", "0", "0", "0", "0", "0");

    if (o_response_1.validation === "OK") {
      if (o_response_1.response.result !== undefined) {
        setChartData([]);
        let vOdataEntidadFilter: EntidadData[] = o_response_1.response.result.rows;
        setOdataEntidad(vOdataEntidadFilter);
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

  let on_click_insertar = () => {

    const values = form.getValues();
    setData({ idCbxAccion: values.idCbxAccion });
    o_navigate('/insertar')
  }

  let on_click_editar = (s_datos: any) => {

    s_datos.idCbxAccion = form.getValues().idCbxAccion;
    setData(s_datos);
    o_navigate('/editar')
  }

  let on_click_eliminar = async (s_datos: any) => {

    Swal.fire({
      title: "Solicitud de confirmación",
      text: "¿Desea eliminar los datos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#089981",
      cancelButtonColor: "#F23645",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      theme: "dark"
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("Eliminar entidad con ID: " + s_datos.idEntidad);

        let o_response_1 = await fun_context_entidad_delete(s_datos.idEntidad);

        if (o_response_1.validation === "OK") {
          if (o_response_1.response.result !== undefined) {
            fun_context_modal_message("S", "Mensaje de éxito", "Los datos se han eliminado correctamente.");
            setChartData(prevData => prevData.filter(item => item.idEntidad !== s_datos.idEntidad));
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

  return (
    <>
      <h4 className="text-3xl font-semibold text-neutral-700 dark:text-neutral-200 underline">
        Entidad
      </h4>
      <div className="mt-3 ml-1 w-full">
        <Form {...form}>
          <form className="space-y-2 flex justify-between w-full items-end" onSubmit={form.handleSubmit(onSubmitFiltros)}>
            <div className="mb-auto">
              <InputSingleSelect form={form} name="idCbxAccion" data={oAcciones} label="Acción" placeholder="-- Seleccione --" filter selIcon binding onChange={() => on_change_entidad()} />
            </div>
            <Button type="button" variant="blue" onClick={() => on_open_filtros()}>
              <Icons icon="filter1" />
              Filtros
            </Button>
          </form>
        </Form>
      </div>
      <div className="w-full mt-3">
        <Card className="aspect-3/1 overflow-visible flex flex-col">
          <CardHeader className="flex justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle>Bar Chart - Negative</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </div>
            <div>
              <Button variant="green" onClick={() => on_click_insertar()}>
                <Icons icon="plus1" />
                Insertar vela
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 relative">
            {/* <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 30, right: 0, left: 0, bottom: 50 }}
                style={{ overflow: "visible" }}
              >
                <CartesianGrid vertical={false} />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      labelKey="vAccion"
                      formatter={(value, name, item) => [" Valor de acción: ", item.payload.vAccion]}
                    />
                  }
                />
                <Bar
                  dataKey="valor"
                  onClick={(data, index, e: any) => {
                    const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect()
                    const clickX = e.clientX - rect.left
                    const clickY = e.clientY - rect.top
                    const popoverWidth = 320
                    const popoverHeight = 160
                    const margin = 20
                    let posX = clickX
                    let posY = clickY
                    let transform = "translate(-50%, -120%)"
                    if (clickX + popoverWidth > rect.width - margin) {
                      posX = clickX - 160
                    } else {
                      posX = clickX + 160
                    }
                    if (clickY + popoverHeight > rect.height - margin) {
                      transform = "translate(-50%, -10%)"
                      posY = clickY - 260
                    } else {
                      transform = "translate(-50%, -120%)"
                      posY = clickY + 0
                    }
                    setSelectedBar(data.payload)
                    setPopoverPos({
                      x: posX,
                      y: posY,
                      transform
                    })
                    setOpenPopover(true)
                  }}
                >
                  <LabelList
                    dataKey="fullLabel"
                    position="top"
                    content={(props) => renderCustomLabel(chartData, props)}
                  />
                  {chartData.map((item, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={item.valor > 0 ? "#089981" : "#F23645"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer> */}
            {/* <ChartContainer config={chartConfig} className="h-full w-full">
              <div
                className="w-full h-full"
                style={{
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  position: 'relative',
                  display: 'block'
                }}
              >
                <div
                  style={{
                    width: `${chartData.length * 100}px`, // Ajusta el número (100) según el ancho que quieras por barra
                    minWidth: "100%",
                    height: "100%"
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      accessibilityLayer
                      data={chartData}
                      margin={{ top: 30, right: 20, left: 20, bottom: 50 }}
                      style={{ overflow: "visible" }}
                    >
                      <CartesianGrid vertical={false} />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            indicator="dot"
                            labelKey="vAccion"
                            formatter={(value, name, item) => [" Valor de acción: ", item.payload.vAccion]}
                          />
                        }
                      />
                      <Bar
                        dataKey="valor"
                        onClick={(data, index, e: any) => {
                          if (!data) return;

                          // Obtenemos el punto exacto del click dentro del SVG
                          const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                          const posX = e.clientX - rect.left;
                          const posY = e.clientY - rect.top;

                          // Determinamos si el popover debe abrirse a la izquierda o derecha para no salirse del contenedor
                          const isNearRightEdge = posX + 320 > (chartData.length * 100);

                          setSelectedBar(data.payload);
                          setPopoverPos({
                            x: posX,
                            y: posY,
                            // Ajustamos el transform para que no tape el click y sea dinámico
                            transform: isNearRightEdge ? "translate(-100%, -100%)" : "translate(0%, -100%)"
                          });
                          setOpenPopover(true);
                        }}
                      >
                        <LabelList
                          dataKey="fullLabel"
                          position="top"
                          content={(props) => renderCustomLabel(chartData, props)}
                        />
                        {chartData.map((item, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={item.valor > 0 ? "#089981" : "#F23645"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {openPopover && selectedBar && (
                    <div
                      ref={popoverRef}
                      className="absolute w-80 bg-white dark:bg-neutral-900 border shadow-lg rounded-md p-3 text-sm z-999999 animate-in fade-in zoom-in-95 duration-150"
                      style={{
                        left: popoverPos.x + 0,
                        top: popoverPos.y + 0,
                        transform: popoverPos.transform,
                        pointerEvents: 'auto'
                      }}
                    >
                      <div className="flex justify-between w-full content-center">
                        <span className="font-semibold text-xl mb-2 content-center">Fecha: {selectedBar.fullLabel.split(" ")[0]}</span>
                        <div className="flex gap-2">
                          <Button variant="yellow" size="icon" tooltip="Editar" onClick={() => on_click_editar(selectedBar)}>
                            <Icons icon="edit" />
                          </Button>
                          <Button variant="red" size="icon" tooltip="Eliminar" onClick={() => on_click_eliminar(selectedBar)}>
                            <Icons icon="delete" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-1 wrap-break-word whitespace-normal mb-4">
                        <ScrollArea className="h-30">
                          <span className="font-semibold">Descripción:</span> {selectedBar.description}
                        </ScrollArea>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <Button variant="orange">
                          <Icons icon="pdf" />
                          Ver PDF
                        </Button>
                        <Button variant="blue">
                          <Icons icon="image" />
                          Ver Imagen
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ChartContainer> */}
            <ChartContainer config={chartConfig} className="h-full w-full">
              <div
                className="w-full h-full"
                style={{
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: `${chartData.length * 100}px`,
                    minWidth: "100%",
                    height: "100%",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 30, right: 20, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid vertical={false} />
                      <Bar
                        dataKey="valor"
                        onClick={(data, index, e: React.MouseEvent<SVGElement>) => {
                          if (!data) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          const xCenter = rect.left + rect.width / 2;
                          const yTop = rect.top;

                          setSelectedBar(data.payload);
                          setPopoverPos({
                            x: xCenter,
                            y: yTop,
                            transform: "translate(-50%, -105%)"
                          });
                          setOpenPopover(true);
                        }}
                      >
                        <LabelList
                          dataKey="fullLabel"
                          position="top"
                          content={(props) => renderCustomLabel(chartData, props)}
                        />
                        {chartData.map((item, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={item.valor > 0 ? "#089981" : "#F23645"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {openPopover && selectedBar && (
                    <div
                      ref={popoverRef}
                      className="fixed w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-xl p-4 animate-in fade-in zoom-in-95 duration-200"
                      style={{
                        left: `${popoverPos.x - 200}px`,
                        top: `${popoverPos.y + 10}px`,
                        transform: popoverPos.transform,
                        zIndex: 9999999,
                        pointerEvents: 'auto',
                      }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-lg text-neutral-900 dark:text-neutral-50">
                          Fecha: {selectedBar.fullLabel.split(" ")[0]}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="yellow" size="icon" tooltip="Editar" onClick={() => on_click_editar(selectedBar)}>
                            <Icons icon="edit" />
                          </Button>
                          <Button variant="red" size="icon" tooltip="Eliminar" onClick={() => on_click_eliminar(selectedBar)}>
                            <Icons icon="delete" />
                          </Button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-lg underline font-bold mb-1">Descripción</p>
                        <ScrollArea className="h-24 text-sm">
                          {selectedBar.description}
                        </ScrollArea>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="orange"><Icons icon="pdf" /> PDF</Button>
                        {/* <Button variant="blue"><Icons icon="image" /> Imagen</Button> */}
                      </div>
                      <button
                        onClick={() => setOpenPopover(false)}
                        className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm shrink-0">
            <div className="flex gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total valor for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>
      <Dialog open={rOpenFiltros} onOpenChange={setOpenFiltros}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Icons icon="filter1" /><span>Filtros</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitFiltros)} className="flex flex-col gap-3">
              <RadioGroup
                defaultValue={form.getValues().tipoFiltro}
                value={form.watch("tipoFiltro")}
                onValueChange={(value) => form.setValue("tipoFiltro", value)}
                className="grid grid-cols-2"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="1" id="r1" />
                  Por rango de fechas
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="2" id="r2" />
                  Por año
                </div>
              </RadioGroup>
              {tipoFiltro === "1" && (
                <InputPicker form={form} name="idPkrRangoFechas" type="range" format="dd/mm/yyyy" placeholder="Ingrese Fechas" label="Rango" />
              )}
              {tipoFiltro === "2" && (
                <InputSingleSelect form={form} name="idCbxAnio" data={oAnios} label="Año" placeholder="-- Seleccione --" filter selIcon />
              )}
              <DialogFooter className="mt-4">
                <Button type="submit" variant="green">
                  <Icons icon="filter1" />
                  Filtrar
                </Button>
                <Button type="button" variant="blue" onClick={() => on_click_dialog_limpiar()} >
                  <Icons icon="clear1" />
                  Limpiar
                </Button>
                <Button type="button" variant="red" onClick={() => on_click_dialog_cancelar()} >
                  <Icons icon="cancel1" />
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Entidad