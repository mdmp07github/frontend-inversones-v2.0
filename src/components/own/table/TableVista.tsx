import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  VisibilityState,
  RowSelectionState,
  OnChangeFn,
} from "@tanstack/react-table"
import { useEffect, useState } from "react"
import TablePagination from "./TablePagination"
import { Spinner } from "@/components/ui/spinner";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core"

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"

type HeightKey = 3 | 5 | 7;

interface DataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  visibilityRow?: HeightKey
  select?: Boolean;
  numberRows?: number
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  isLoading?: boolean
  emptyMessage?: string
}

function TableVista<TData, TValue>({
  data,
  columns,
  visibilityRow = 5,
  numberRows = 5,
  select = false,
  rowSelection,
  onRowSelectionChange,
  isLoading = false,
  emptyMessage = "No hay registros para mostrar",
}: DataTableProps<TData, TValue>) {

  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: numberRows,
    pageIndex: 0,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [tableData, setTableData] = useState<TData[]>(data)
  /* const [rowSelection, setRowSelection] = useState<RowSelectionState>({}) */

  useEffect(() => {
    setTableData(data)
  }, [data])

  const table = useReactTable({
    data: tableData,
    columns,
    getRowId: (row: any) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
    },
    columnResizeMode: "onChange",
  })

  const heightMap: Record<HeightKey, string> = {
    3: "h-[201px]",
    5: "h-[307px]",
    7: "h-[413px]",
  };

  const getHeightClass = (value: HeightKey): string => {
    return heightMap[value];
  };

  function DraggableRow({
    row,
    children,
  }: {
    row: any
    children: (dragListeners: any) => React.ReactNode
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: row.id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="border-b hover:bg-muted/50"
      >
        {children(listeners)}
      </div>
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    setTableData(prev => {
      const oldIndex = prev.findIndex(
        (item: any) => item.id.toString() === active.id
      )
      const newIndex = prev.findIndex(
        (item: any) => item.id.toString() === over.id
      )

      const updated = [...prev]
      const [moved] = updated.splice(oldIndex, 1)
      updated.splice(newIndex, 0, moved)

      return updated
    })
  }

  return (
    <div className="space-y-4">
      <div className={`relative overflow-auto border rounded-md ${getHeightClass(visibilityRow)}`}> {/* 201 - 3, 308 - 5, 413 - 7 */}
        <div
          className="sticky top-0 z-20 bg-muted border-b"
          style={{
            minWidth: table.getTotalSize(),
            display: "grid",
            gridTemplateColumns: table
              .getVisibleLeafColumns()
              .map(col => `${col.getSize()}px`)
              .join(" "),
          }}
        >
          {table.getHeaderGroups()[0].headers.map(header => (
            <div
              key={header.id}
              className="px-2 py-1 font-medium whitespace-nowrap border-r content-center"
            >
              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className={`flex items-center justify-center ${visibilityRow === 3 ? 'py-15' : visibilityRow === 5 ? 'py-30' : 'py-40'}`}>
            <Spinner className="size-6 text-purple-500" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando información...
            </span>
          </div>
        ) : table.getRowModel().rows.length === 0 ? (
          <div className={`flex items-center justify-center py-30 text-sm text-muted-foreground ${visibilityRow === 3 ? 'py-15' : visibilityRow === 5 ? 'py-30' : 'py-40'}`}>
            {emptyMessage}
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={table.getRowModel().rows.map(row => row.id)}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map(row => (
                <DraggableRow key={row.id} row={row}>
                  {(dragListeners) => (
                    <div
                      style={{
                        minWidth: table.getTotalSize(),
                        display: "grid",
                        gridTemplateColumns: table
                          .getVisibleLeafColumns()
                          .map(col => `${col.getSize()}px`)
                          .join(" "),
                      }}
                    >
                      {row.getVisibleCells().map(cell => {
                        const isDragCell = cell.column.id === "drag"

                        return (
                          <div
                            key={cell.id}
                            className="px-2 py-2 border-r content-center"
                            {...(isDragCell ? dragListeners : {})}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </DraggableRow>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      <TablePagination table={table} select={select} />
    </div>
  )
}

export default TableVista
