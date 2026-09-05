import QRCode from "qrcode";

// Ported from the Convention site's lib/qr.ts. Rendered server-side as an
// inline SVG string -- no client JS, no canvas, no external QR-hosting API
// call. Callers embed the result directly via dangerouslySetInnerHTML
// (QRCode's own output, not user input).
export async function renderQrCodeSvg(data: string): Promise<string> {
  return QRCode.toString(data, { type: "svg", margin: 1, width: 128 });
}
