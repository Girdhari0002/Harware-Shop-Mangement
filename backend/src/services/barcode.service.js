import QRCode from "qrcode";

const L = ["0001101","0011001","0010011","0111101","0100011","0110001","0101111","0111011","0110111","0101011"];
const R = ["1110010","1100110","1101100","1000010","1011100","1001110","1100010","1111100","1110000","1001111"];
const G = ["0100111","0110011","0011011","0100001","0011101","0111001","0001011","0010001","0011100","0111010"];

// EAN-13 left-side parity table (first digit -> L/G pattern for the 6 data digits)
const EAN_PARITY = ["LLLLLL","LLGLLL","LLGLGG","LLLGGG","LGLLLG","LGLLGL","LLGLLG","LLLGLL","LGGLLL","LGLLLG"];

const digits = (v) => String(v || "").replace(/\D/g, "");

export const generateBarcodeSvg = (value, { height = 60, fontSize = 12 } = {}) => {
  let d = digits(value);
  if (d.length === 13) {
    // EAN-13: use left parity table
    const parity = EAN_PARITY[parseInt(d[0], 10)] || "LLLLLL";
    const left = d.slice(1, 7).split("").map((ch, i) => (parity[i] === "L" ? L : G)[parseInt(ch, 10)]);
    const right = d.slice(7, 13).split("").map((ch) => R[parseInt(ch, 10)]);
    const bars = ["101"].concat(left).concat(["01010"]).concat(right).concat(["101"]).join("");
    d = d; // keep 13-digit display
    return renderSvg(bars, height, fontSize, d);
  }
  // UPC-A (12 digits) -> treat as EAN with leading 0
  if (d.length === 12) d = "0" + d;
  if (d.length !== 13) return "";
  const parity = "LLLLLL";
  const left = d.slice(1, 7).split("").map((ch) => L[parseInt(ch, 10)]);
  const right = d.slice(7, 13).split("").map((ch) => R[parseInt(ch, 10)]);
  const bars = ["101"].concat(left).concat(["01010"]).concat(right).concat(["101"]).join("");
  return renderSvg(bars, height, fontSize, d.slice(1));
};

const renderSvg = (bars, height, fontSize, label) => {
  const width = bars.length;
  let path = "";
  for (let i = 0; i < bars.length; i++) if (bars[i] === "1") path += `M${i} 0 h1 v${height - fontSize - 4} z `;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path d="${path}" fill="#000"/><rect x="0" y="${height - fontSize}" width="${width}" height="${fontSize}" fill="#fff"/><text x="${width / 2}" y="${height - 2}" font-family="monospace" font-size="${fontSize}" text-anchor="middle" fill="#000">${label}</text></svg>`;
};

// QR codes (arbitrary text/URLs, not just fixed-length numeric codes) — real encoder, so it
// scales to whatever payload is needed (a plain code, a full verification URL, etc.).
export const generateQrSvg = async (data, { size = 128 } = {}) => {
  const str = String(data ?? "");
  if (!str) return "";
  try {
    return await QRCode.toString(str, { type: "svg", margin: 1, width: size });
  } catch {
    return "";
  }
};
