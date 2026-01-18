import { cn } from "@/lib/utils"

export function Table({ children, className}) {
    return(
        <div className="relative w-full overflow-auto">
            <table className={cn("w-full caption-bottom text-sm", className)}>
                {children}
            </table>
        </div>
    )
}

export function TableHeader({ children}) {
    return <thead className="[&_tr]:border-b">{children}</thead>
}

export function TableBody({ children }) {
    return <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
  }
  
  export function TableRow({ children, className }) {
    return (
      <tr className={cn("border-b transition-colors hover:bg-muted/50", className)}>
        {children}
      </tr>
    )
  }
  
  export function TableHead({ children, className }) {
    return (
      <th className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground", className)}>
        {children}
      </th>
    )
  }
  
  export function TableCell({ children, className }) {
    return (
      <td className={cn("p-4 align-middle", className)}>
        {children}
      </td>
    )
  }