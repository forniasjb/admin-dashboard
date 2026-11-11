// Minimal CSV helpers used by the Reports export.

const escapeCell = (value) => {
  let text = String(value ?? '');
  // Neutralise spreadsheet formulas (CSV injection).
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** columns: [{ label, value: (row) => any }] */
export const toCsv = (columns, rows) =>
  [
    columns.map((c) => escapeCell(c.label)).join(','),
    ...rows.map((row) => columns.map((c) => escapeCell(c.value(row))).join(',')),
  ].join('\r\n');

/** Triggers a browser download of the given CSV text. The BOM keeps Excel happy with UTF-8. */
export const downloadCsv = (filename, csv) => {
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
