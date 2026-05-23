import { chromium } from "playwright";
import { createServer } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "public", "catchmons");
const size = Number(process.env.CATCHMON_PNG_SIZE || 512);
const spriteSize = Number(process.env.CATCHMON_SPRITE_SIZE || Math.round(size * 0.875));

await fs.mkdir(outDir, { recursive: true });

const server = await createServer({
  root: projectRoot,
  logLevel: "error",
  server: {
    host: "127.0.0.1",
  },
});

let browser;

try {
  await server.listen();
  const baseUrl = server.resolvedUrls?.local?.[0];
  if (!baseUrl) {
    throw new Error("Vite server did not expose a local URL.");
  }

  browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: size + 64, height: size + 64 },
    deviceScaleFactor: 1,
  });

  const exportUrl = new URL("scripts/catchmon-export.html", baseUrl);
  exportUrl.searchParams.set("size", String(size));
  exportUrl.searchParams.set("spriteSize", String(spriteSize));

  await page.goto(exportUrl.href, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__CATCHMON_EXPORT_READY__ === true);

  const ids = await page.$$eval("[data-catchmon-id]", (nodes) =>
    nodes.map((node) => node.getAttribute("data-catchmon-id"))
  );

  for (const id of ids) {
    const element = page.locator(`[data-catchmon-id="${id}"]`);
    await element.screenshot({
      path: path.join(outDir, `${id}.png`),
      omitBackground: true,
      animations: "disabled",
    });
  }

  console.log(`Exported ${ids.length} transparent PNG files to ${path.relative(projectRoot, outDir)}`);
} finally {
  if (browser) {
    await browser.close();
  }
  await server.close();
}
