import sharp from "sharp";
import path from "path";

const NAVY = { r: 0x09, g: 0x1f, b: 0x46 };

async function main() {
  const srcPath = path.join(process.cwd(), "public", "logo.png");
  const outPath = path.join(process.cwd(), "public", "logo-light-bg.png");

  const image = sharp(srcPath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] === 0) continue; // fully transparent, leave untouched
    data[i] = NAVY.r;
    data[i + 1] = NAVY.g;
    data[i + 2] = NAVY.b;
    // alpha (data[i + 3]) untouched, preserving the original shape/anti-aliasing
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toFile(outPath);

  console.log(`Wrote ${outPath}`);
}

main();
