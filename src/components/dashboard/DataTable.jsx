import { cn } from "@/lib/cn";

/**
 * The dashboard's table, so every list of records reads the same: a boxed
 * table (a rounded border round it, a rule between every row and every
 * column), its column names on a tinted band, rows that tint on hover, and
 * under the rows, inside the box, what shows when there are none and a
 * footer.
 *
 *   columns  [{ key, header, cell: (row) => node, align, grow, className }]:
 *            `align` "right" for figures; `grow` makes a column take the
 *            room the others leave, its long text cut short with an ellipsis
 *            rather than widening the table; `className` goes on the column's
 *            header and every cell in it, so a column can step aside in a
 *            narrow table ("hidden @xl:table-cell"). Keep the first column
 *            always shown: it carries no rule on its left.
 *   rows     the rows; `rowKey` names each (its `id` by default)
 *   caption  what the table is, for screen readers
 *   empty    what shows in place of the rows when there are none
 *   footer   under the rows, in the box
 *   onRowClick  (row) => void: a row opens on a click, or on Enter or Space
 *            when it has focus (each row then takes focus in turn)
 *   actions  (row) => node: what sits at the end of each row, in a column of
 *            its own (an ActionMenu, say); a click in it does not open the
 *            row. `actionsLabel` names the column for screen readers.
 *
 * The box scrolls sideways inside itself if a table is ever wider than its
 * panel, so it never pushes the page wider. Column widths go by the panel
 * (container queries), not the screen.
 */
export function DataTable({
  columns,
  rows,
  rowKey = (row) => row.id,
  caption,
  empty,
  footer,
  onRowClick,
  actions,
  actionsLabel = "Actions",
  className,
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-card",
        className,
      )}
    >
      <div className="relative overflow-x-auto [scrollbar-width:thin]">
        <table className="w-full text-left">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-canvas">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "border-l border-line px-4 py-3 text-[0.6875rem] font-semibold tracking-[0.1em] whitespace-nowrap text-muted uppercase first:border-l-0",
                    column.align === "right" && "text-right",
                    column.grow && "w-full",
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th scope="col" className="w-0 border-l border-line px-2 py-3">
                  <span className="sr-only">{actionsLabel}</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (event) => {
                        if (event.target !== event.currentTarget) return;
                        if (event.key !== "Enter" && event.key !== " ") return;
                        event.preventDefault();
                        onRowClick(row);
                      }
                    : undefined
                }
                className={cn(
                  "group border-t border-line",
                  onRowClick &&
                    "cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand",
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "border-l border-line px-4 py-3.5 align-middle transition-colors group-hover:bg-canvas/50 first:border-l-0",
                      column.align === "right" && "text-right",
                      column.grow && "w-full max-w-0",
                      column.className,
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
                {actions && (
                  <td
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                    className="w-0 cursor-default border-l border-line px-2 py-3.5 text-center align-middle transition-colors group-hover:bg-canvas/50"
                  >
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && empty && (
        <div className="border-t border-line px-6 py-12 text-center">
          {empty}
        </div>
      )}

      {footer && (
        <div className="border-t border-line bg-canvas/40 px-4 py-3">
          {footer}
        </div>
      )}
    </div>
  );
}

/**
 * A cell's two lines: the main one, and a quieter one under it. `figures`
 * sets them in even-width numerals.
 */
export function CellLines({ main, under, strong = true, figures, className }) {
  return (
    <span className={cn("block min-w-0 leading-tight", className)}>
      <span
        className={cn(
          "block truncate text-sm text-headline",
          strong ? "font-semibold" : "font-medium",
          figures && "tabular-nums",
        )}
      >
        {main}
      </span>
      {under && (
        <span
          className={cn(
            "mt-1 block truncate text-xs text-muted",
            figures && "tabular-nums",
          )}
        >
          {under}
        </span>
      )}
    </span>
  );
}
