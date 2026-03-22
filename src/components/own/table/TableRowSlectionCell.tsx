import { Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

interface TableRowSlectionCellProps<TData> {
  row: Row<TData>;
}

export default function TableRowSlectionCell<TData>({
  row,
}: TableRowSlectionCellProps<TData>) {
  return (
    <Checkbox
      variant="black"
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  );
}