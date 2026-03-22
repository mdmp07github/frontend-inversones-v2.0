import { Table } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Squircle } from "lucide-react"
import clsx from "clsx"

interface TableRowSlectionHeaderProps<TData> {
  table: Table<TData>
}

export default function TableRowSlectionHeader<TData>({
  table,
}: TableRowSlectionHeaderProps<TData>) {
  const isAllSelected = table.getIsAllPageRowsSelected()
  const isSomeSelected = table.getIsSomePageRowsSelected()

  return (
    <div className="relative flex items-center justify-center">
      <Checkbox
        variant="black"
        checked={
          isAllSelected ||
          (isSomeSelected && "indeterminate")
        }
        onCheckedChange={(value) =>
          table.toggleAllRowsSelected(!!value)
        }
        aria-label="Select all"
        className={clsx(
          isAllSelected &&
          "[&_[data-slot=checkbox-indicator]]:hidden"
        )}
      />

      {isAllSelected && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white dark:text-[#441306]">
          <Squircle className="size-3.5 text-current" />
        </span>
      )}
    </div>
  )
}
