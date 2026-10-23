import logo from "../../public/images/logo/web_logo_dark.png";

/**
 * Receipts as PDF files, made in the browser. The PDF library is loaded only
 * when a receipt is asked for, so no page carries it.
 *
 * DEMO: the receipt is drawn from what the page already shows; there is no
 * server copy of it yet.
 */

/** A5, in points. */
const W = 420;
const H = 595;
const M = 32;

const COLORS = {
  brand: "#f26a1b",
  brandTint: "#fff5ee",
  headline: "#0b1020",
  content: "#3c4457",
  muted: "#6b7385",
  line: "#e4e7ef",
  canvas: "#f5f6fa",
  success: "#16a34a",
  successTint: "#e8f6ed",
  danger: "#dc2626",
  dangerTint: "#fdecec",
  warning: "#eab308",
  warningTint: "#fcf1c6",
};

/** Text the PDF's built-in fonts can draw: the true minus sign becomes a hyphen. */
const safe = (text) => String(text).replace(/−/g, "-");

/** A rounded rectangle as an SVG path, `w` by `h` with corners of `r`. */
const rounded = (w, h, r) =>
  `M ${r} 0 H ${w - r} Q ${w} 0 ${w} ${r} V ${h - r} Q ${w} ${h} ${w - r} ${h} H ${r} Q 0 ${h} 0 ${h - r} V ${r} Q 0 0 ${r} 0 Z`;

/** Splits text into lines no wider than `width` at `size` in `font`. */
function wrap(text, font, size, width) {
  const lines = [];
  let line = "";
  for (const word of safe(text).split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > width && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Makes a receipt and saves it as a PDF. On an A5 page: the StripCard logo
 * and the receipt's reference, under a brand rule; who it was with, what it
 * was, the amount (struck through when `struck`) and its status, on a tinted
 * panel; the details, a line each; a note, if there is one; a thank-you, with
 * where to ask about it; and when the receipt was issued.
 *
 *   receipt  { ref, name, kind, amount, tone ("in", "out" or "stopped"),
 *              struck, status, statusTone (as StatusBadge's: "success",
 *              "warning", "danger", "brand" or "neutral"), details:
 *              [[label, value]], note, supportEmail, company, fileName }
 */
export async function downloadReceiptPdf(receipt) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const color = (hex) => {
    const n = Number.parseInt(hex.slice(1), 16);
    return rgb(
      ((n >> 16) & 255) / 255,
      ((n >> 8) & 255) / 255,
      (n & 255) / 255,
    );
  };
  const C = Object.fromEntries(
    Object.entries(COLORS).map(([k, v]) => [k, color(v)]),
  );

  const pdf = await PDFDocument.create();
  pdf.setTitle(`StripCard receipt ${receipt.ref}`);
  pdf.setAuthor(receipt.company);
  pdf.setCreator("StripCard");
  const page = pdf.addPage([W, H]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const text = (
    value,
    x,
    y,
    { size = 10, font = regular, fill = C.headline, align = "left" } = {},
  ) => {
    const s = safe(value);
    const width = font.widthOfTextAtSize(s, size);
    const at =
      align === "right" ? x - width : align === "center" ? x - width / 2 : x;
    page.drawText(s, { x: at, y, size, font, color: fill });
    return width;
  };
  const box = (x, top, w, h, r, fill) =>
    page.drawSvgPath(rounded(w, h, r), { x, y: top, color: fill });

  // ── The head: the logo, and the receipt's reference ─────────────────────
  let y = H - M;
  const bytes = await fetch(logo.src).then((response) =>
    response.arrayBuffer(),
  );
  const image = await pdf.embedPng(bytes);
  const logoW = 116;
  const logoH = (image.height / image.width) * logoW;
  page.drawImage(image, { x: M, y: y - logoH, width: logoW, height: logoH });
  text("RECEIPT", W - M, y - 9, {
    size: 8,
    font: bold,
    fill: C.muted,
    align: "right",
  });
  text(`#${receipt.ref}`, W - M, y - 23, {
    size: 11,
    font: bold,
    align: "right",
  });
  y -= logoH + 16;
  page.drawRectangle({ x: M, y, width: W - M * 2, height: 2, color: C.brand });
  y -= 18;

  // ── Who, what, how much ─────────────────────────────────────────────────
  const panelH = 128;
  box(M, y, W - M * 2, panelH, 12, C.canvas);
  const mid = W / 2;
  text(receipt.name, mid, y - 30, { size: 13, font: bold, align: "center" });
  text(receipt.kind, mid, y - 45, { size: 9, fill: C.muted, align: "center" });
  const amountFill =
    receipt.tone === "in"
      ? C.success
      : receipt.tone === "stopped"
        ? C.danger
        : C.headline;
  const amountW = text(receipt.amount, mid, y - 78, {
    size: 24,
    font: bold,
    fill: amountFill,
    align: "center",
  });
  if (receipt.struck)
    page.drawRectangle({
      x: mid - amountW / 2,
      y: y - 70,
      width: amountW,
      height: 1.4,
      color: C.danger,
    });
  // The status, as the dashboard's badge: a dot in its tone on a tint of it.
  const [pillFill, dot] = {
    success: [C.successTint, C.success],
    warning: [C.warningTint, C.warning],
    danger: [C.dangerTint, C.danger],
    brand: [C.brandTint, C.brand],
    neutral: [C.line, C.muted],
  }[receipt.statusTone];
  const pillW = bold.widthOfTextAtSize(receipt.status, 8.5) + 22;
  box(mid - pillW / 2, y - 94, pillW, 17, 8.5, pillFill);
  page.drawCircle({
    x: mid - pillW / 2 + 8,
    y: y - 102.5,
    size: 2,
    color: dot,
  });
  text(receipt.status, mid + 3, y - 105.5, {
    size: 8.5,
    font: bold,
    align: "center",
  });
  y -= panelH + 14;

  // ── The details ─────────────────────────────────────────────────────────
  for (const [i, [label, value]] of receipt.details.entries()) {
    if (i > 0)
      page.drawRectangle({
        x: M,
        y: y + 9,
        width: W - M * 2,
        height: 0.6,
        color: C.line,
      });
    text(label, M, y - 5, { size: 9.5, fill: C.muted });
    text(value, W - M, y - 5, { size: 9.5, font: bold, align: "right" });
    y -= 26;
  }

  // ── A note on a pending or stopped payment ──────────────────────────────
  if (receipt.note) {
    const lines = wrap(receipt.note, regular, 9, W - M * 2 - 24);
    const h = lines.length * 13 + 16;
    y -= 4;
    box(
      M,
      y,
      W - M * 2,
      h,
      10,
      receipt.tone === "stopped" ? C.dangerTint : C.warningTint,
    );
    lines.forEach((line, i) =>
      text(line, M + 12, y - 19 - i * 13, {
        size: 9,
        fill: receipt.tone === "stopped" ? C.danger : C.content,
      }),
    );
    y -= h + 10;
  }

  // ── Thank you ───────────────────────────────────────────────────────────
  const thanksH = 70;
  const thanksTop = Math.min(y - 4, M + 34 + thanksH);
  box(M, thanksTop, W - M * 2, thanksH, 12, C.brandTint);
  text("Thank you for choosing StripCard!", mid, thanksTop - 24, {
    size: 12.5,
    font: bold,
    fill: C.brand,
    align: "center",
  });
  text(
    "We appreciate your trust. Keep this receipt for your records.",
    mid,
    thanksTop - 40,
    {
      size: 8.5,
      fill: C.content,
      align: "center",
    },
  );
  text(
    `Questions about this payment? Write to ${receipt.supportEmail}`,
    mid,
    thanksTop - 54,
    {
      size: 8.5,
      fill: C.muted,
      align: "center",
    },
  );

  // ── The foot ────────────────────────────────────────────────────────────
  // As the dashboard writes a date and time: "23 Oct 2026, 11:31 AM".
  const now = new Date();
  const issued = `${now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  page.drawRectangle({
    x: M,
    y: M + 16,
    width: W - M * 2,
    height: 0.6,
    color: C.line,
  });
  text(`${receipt.company}  ·  Receipt issued ${issued}`, M, M, {
    size: 7.5,
    fill: C.muted,
  });
  text("stripcard.com", W - M, M, {
    size: 7.5,
    font: bold,
    fill: C.brand,
    align: "right",
  });

  const blob = new Blob([await pdf.save()], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = receipt.fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
