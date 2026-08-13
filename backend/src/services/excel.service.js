export const excelService = {
  exportToCsv(rows, filename = "export.csv") {
    if (!rows || rows.length === 0) return "";
    const cols = Object.keys(rows[0]);
    const cell = (v) => {
      const s = v == null ? "" : String(v);
      return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [cols.map(cell).join(",")];
    for (const r of rows) lines.push(cols.map((c) => cell(r[c])).join(","));
    return lines.join("\r\n");
  },
  importFromCsv(text) {
    const rows = text.replace(/\r\n/g, "\n").split("\n").filter((l) => l.trim());
    if (!rows.length) return [];
    const cols = this._parseRow(rows[0]);
    return rows.slice(1).map((line) => {
      const vals = this._parseRow(line);
      const obj = {};
      cols.forEach((c, i) => { obj[c] = vals[i] !== undefined ? vals[i] : ""; });
      return obj;
    });
  },
  _parseRow(line) {
    const out = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else inQuotes = false; }
        else cur += ch;
      } else if (ch === '"') inQuotes = true;
      else if (ch === ",") { out.push(cur); cur = ""; }
      else cur += ch;
    }
    out.push(cur);
    return out;
  }
};
