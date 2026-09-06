// Generic table primitives.
export function Table({ columns, data, rowKey = 'id', emptyMessage = 'Aucune donnée.', renderActions }) {
  return (
    <div className="overflow-x-auto rounded-lg ring-1 ring-slate-200 dark:ring-slate-700">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
            {renderActions && <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-900">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row[rowKey]} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-sm text-slate-700 dark:text-slate-200 ${col.cellClassName || ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-4 py-3 text-right text-sm">
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}