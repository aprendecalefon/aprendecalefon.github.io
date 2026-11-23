// Dibuja el certificado de finalización sobre la plantilla (2000×1414) y lo descarga en PDF
const DIRECTOR = "Director de Aprende Calefón";
const VERIFY = "aprendecalefon.github.io/verificar";
const BG = new URL("../assets/cert-bg.jpg", import.meta.url).href;
const SIG = new URL("../assets/firma.png", import.meta.url).href;
const load = src => new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = src; });

function spaced(x, t, px, ls, X, Y, maxW, font, color) {
  let size = px;
  for (; size > 14; size--) { x.font = font.replace("{s}", size); const w = [...t].reduce((a, ch) => a + x.measureText(ch).width + ls * size / px, 0); if (w <= maxW) break; }
  x.font = font.replace("{s}", size); x.fillStyle = color; let cx = X;
  for (const ch of t) { x.fillText(ch, cx, Y); cx += x.measureText(ch).width + ls * size / px; }
}

export async function drawCertificate(canvas, { name, course, date, code }) {
  await Promise.all([document.fonts.load("500 40px Montserrat"), document.fonts.load("700 20px Inter")]).catch(() => {});
  const [bg, sig] = await Promise.all([load(BG), load(SIG)]);
  canvas.width = 2000; canvas.height = 1414;
  const x = canvas.getContext("2d");
  x.drawImage(bg, 0, 0, 2000, 1414);
  spaced(x, name, 56, 0, 136, 540, 610, "500 {s}px Montserrat, Arial, sans-serif", "#2f3e4d");
  spaced(x, course.toUpperCase(), 46, 4, 136, 797, 1270, "400 {s}px Montserrat, Arial, sans-serif", "#c19a3c");
  x.font = "500 23px Montserrat, Arial, sans-serif"; x.fillStyle = "#3c4a57";
  x.fillText("FECHA DE FINALIZACIÓN:  " + date, 136, 902);
  x.font = "500 17px Montserrat, Arial, sans-serif"; x.fillStyle = "#7a8691";
  x.fillText("Código de verificación: " + code + "  ·  " + VERIFY, 136, 935);
  const r = Math.min(440 / sig.width, 150 / sig.height), w = sig.width * r, h = sig.height * r;
  x.drawImage(sig, 1665 - w / 2, 1298 - h, w, h);
  x.font = "700 22px Inter, Arial, sans-serif"; x.fillStyle = "#e8401e";
  x.fillText(DIRECTOR, 1430, 1342);
  return canvas;
}

export async function downloadCertificate(data, filename) {
  const c = document.createElement("canvas");
  await drawCertificate(c, data);
  if (!window.jspdf) throw new Error("jspdf");
  const pdf = new window.jspdf.jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  pdf.addImage(c.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 297, 210);
  pdf.save(filename);
}
