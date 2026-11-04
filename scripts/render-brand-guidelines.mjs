import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
const playwright = await import(
  process.env.PLAYWRIGHT_MODULE
    ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
    : "playwright"
);
const { chromium } = playwright.default ?? playwright;

const source = process.argv[2];
const output = process.argv[3] ?? "docs/brand-guidelines-pages";

if (!source) {
  console.error("Usage: node scripts/render-brand-guidelines.mjs <pdf> [output]");
  process.exit(1);
}

const pdf = await fs.readFile(source);
await fs.mkdir(output, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
const page = await browser.newPage({ viewport: { width: 1600, height: 2200 } });
await page.goto("about:blank");

const base64 = pdf.toString("base64");
const pdfBase64 = base64;
const pageCount = await page.evaluate(async (encoded) => {
  const pdfjs = await import(
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs"
  );
  pdfjs.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

  const bytes = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
  const pdfDocument = await pdfjs.getDocument({ data: bytes }).promise;
  return pdfDocument.numPages;
}, base64);

for (let index = 1; index <= pageCount; index += 1) {
  await page.evaluate(async ({ encoded, pageNumber }) => {
    const pdfjs = await import(
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs"
    );
    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
    const bytes = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
    const pdfDocument = await pdfjs.getDocument({ data: bytes }).promise;
    const pdfPage = await pdfDocument.getPage(pageNumber);
    const viewport = pdfPage.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.setAttribute("data-page", String(pageNumber));
    document.body.replaceChildren(canvas);
    await pdfPage.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
  }, { encoded: pdfBase64, pageNumber: index });

  const filename = `page-${String(index).padStart(3, "0")}.png`;
  await page.locator(`canvas[data-page="${index}"]`).screenshot({
    path: path.join(output, filename),
  });
}

await browser.close();
console.log(`Rendered ${pageCount} pages to ${output}`);
