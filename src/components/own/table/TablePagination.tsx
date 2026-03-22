import { Table } from "@tanstack/react-table";
import DynamicPagination from "@/components/own/pagination/dynamic-pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Columns3 } from "lucide-react"

interface TablePaginationProps<TData> {
  table: Table<TData>;
  select?: Boolean;
}

export default function TablePagination<TData>({
  table,
  select = false,
}: TablePaginationProps<TData>) {

  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex gap-5 justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="black" className="ml-auto" tooltip="Mostrar/Ocultar">
                <Columns3 />
                Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {(column.columnDef.meta as { label?: string } | undefined)?.label ?? column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {select && (
            <div className="flex-1 font-semibold text-neutral-700 dark:text-neutral-400">
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} filas(s) seleccionadas.
            </div>
          )}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex gap-5">
            <p className="w-full self-center font-semibold text-neutral-700 dark:text-neutral-400">
              Página {currentPage} de {totalPages}
            </p>
            <DynamicPagination
              className="flex place-content-end"
              totalPages={totalPages}
              currentPage={currentPage}
              onChange={(page) => {
                table.setPageIndex(page - 1)
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}