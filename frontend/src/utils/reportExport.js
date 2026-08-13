const escapeCsvCell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// sections: [{ title?, columns: [{ label, value(row) }], rows }]
export const downloadCsv = (filename, sections) => {
  const lines = [];
  sections.forEach((sec, i) => {
    if (sec.title) lines.push(escapeCsvCell(sec.title));
    lines.push(sec.columns.map((c) => escapeCsvCell(c.label)).join(","));
    for (const row of sec.rows) lines.push(sec.columns.map((c) => escapeCsvCell(c.value(row))).join(","));
    if (i < sections.length - 1) lines.push("");
  });
  const blob = new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// sections: [{ heading?, columns: [{ label, value(row) }], rows, emptyMessage? }]
export const printReport = ({ title, subtitle, sections }) => {
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;

  const sectionsHtml = sections.map((sec) => {
    const head = sec.columns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join("");
    const body = sec.rows.length
      ? sec.rows.map((row) => `<tr>${sec.columns.map((c) => `<td>${escapeHtml(c.value(row))}</td>`).join("")}</tr>`).join("")
      : `<tr><td colspan="${sec.columns.length}" style="text-align:center;color:#888;">${escapeHtml(sec.emptyMessage || "No records")}</td></tr>`;
    return `
      ${sec.heading ? `<h3>${escapeHtml(sec.heading)}</h3>` : ""}
      <table>
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>`;
  }).join("");

  win.document.write(`
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #172033; }
          h2 { color: #2F66B3; margin-bottom: 4px; }
          h3 { color: #172033; margin: 20px 0 8px; }
          p.sub { color: #666; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; font-size: 13px; }
          th { background: #f2f5fa; }
        </style>
      </head>
      <body>
        <h2>${escapeHtml(title)}</h2>
        ${subtitle ? `<p class="sub">${escapeHtml(subtitle)}</p>` : ""}
        ${sectionsHtml}
        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `);
  win.document.close();
};
