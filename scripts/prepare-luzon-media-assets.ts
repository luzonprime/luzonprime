/**
 * Regenerates the Luzon Media brand assets in public/luzon-media/ from the raw
 * files the brand supplied in ./luzon_media/.
 *
 *   luzon_media_logo.jpg  ->  logo.png           (tight crop, white keyed out)
 *                         ->  logo-on-dark.png   (navy wordmark reversed to white)
 *   arca_cetificate.jpg   ->  arcon-certificate.jpg (levelled + sharpened)
 *
 * Run: npx tsx scripts/prepare-luzon-media-assets.ts
 *
 * Not covered here: spiral-mark.png and the two media-partner logos
 * (partner-nigerian-breweries.png, partner-zee-world.png). Those were lifted
 * from pages 6, 20 and 21 of "Luzon Media Company Profile.pdf" — the only clean
 * source available for them — cleaned with the same paper-keying pass below,
 * and committed directly. Re-extract from the PDF if they ever need redoing.
 */
import sharp from "sharp";
import path from "path";

const SRC_DIR = path.join(process.cwd(), "luzon_media");
const OUT_DIR = path.join(process.cwd(), "public", "luzon-media");

type Raw = { data: Buffer; width: number; height: number };

const lum = (d: Buffer, i: number) => Math.max(d[i], d[i + 1], d[i + 2]) / 255;
const sat = (d: Buffer, i: number) => {
  const mx = Math.max(d[i], d[i + 1], d[i + 2]);
  const mn = Math.min(d[i], d[i + 1], d[i + 2]);
  return mx === 0 ? 0 : (mx - mn) / mx;
};

/**
 * Bounding box of everything that is not near-white paper, so the logo can be
 * cropped tight regardless of how much whitespace the source file carries.
 */
function inkBox({ data, width, height }: Raw, channels: number) {
  let x0 = width, x1 = -1, y0 = height, y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      if (lum(data, i) < 0.86 || sat(data, i) > 0.14) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

async function main() {
  // ---------------------------------------------------------------- logo ---
  const logoSrc = path.join(SRC_DIR, "luzon_media_logo.jpg");
  const probe = await sharp(logoSrc).raw().toBuffer({ resolveWithObject: true });
  const box = inkBox(
    { data: probe.data, width: probe.info.width, height: probe.info.height },
    probe.info.channels
  );

  const PAD = 6;
  const cropped = await sharp(logoSrc)
    .extract({
      left: box.left - PAD,
      top: box.top - PAD,
      width: box.width + PAD * 2,
      height: box.height + PAD * 2,
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = cropped;
  const { width, height } = info;

  // Paper (bright and unsaturated) becomes transparent. The 0.80–0.93 ramp
  // keeps the anti-aliased rim of each stroke soft instead of stair-stepped.
  for (let i = 0; i < data.length; i += 4) {
    if (sat(data, i) > 0.14) continue;
    const L = lum(data, i);
    if (L >= 0.93) data[i + 3] = 0;
    else if (L > 0.8) data[i + 3] = Math.round(255 * ((0.93 - L) / 0.13));
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, "logo.png"));
  console.log("✓ logo.png");

  // Reversed lockup: the mark sits above a blank gutter, so everything below
  // that gutter is wordmark. Only its navy letterforms flip to white — the cyan
  // "O" sphere and the "media" line are already legible on dark.
  const rowInk = new Array<number>(height).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 40) rowInk[y]++;
    }
  }
  let wordmarkTop = height;
  for (let y = Math.floor(height * 0.4); y < height; y++) {
    if (rowInk[y] === 0) {
      let end = y;
      while (end + 1 < height && rowInk[end + 1] === 0) end++;
      wordmarkTop = end + 1;
      break;
    }
  }
  for (let y = wordmarkTop; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] === 0) continue;
      if (lum(data, i) < 0.42) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }
  }
  await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, "logo-on-dark.png"));
  console.log("✓ logo-on-dark.png");

  // --------------------------------------------------------- certificate ---
  // A phone photo: slightly warm, soft, with a sliver of desk showing on the
  // right. Trim the right/top/bottom edges only — the left margin is flush with
  // the "Dated this" line, so cropping it would clip the text.
  const certSrc = path.join(SRC_DIR, "arca_cetificate.jpg");
  const cert = await sharp(certSrc).metadata();
  await sharp(certSrc)
    .extract({
      left: 0,
      top: Math.round(cert.height! * 0.012),
      width: Math.round(cert.width! * 0.962),
      height: Math.round(cert.height! * 0.978),
    })
    .resize({ width: 1200, kernel: "lanczos3" })
    .modulate({ saturation: 0.92, brightness: 1.04 })
    .normalise({ lower: 1, upper: 99 })
    .sharpen({ sigma: 1.1 })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(OUT_DIR, "arcon-certificate.jpg"));
  console.log("✓ arcon-certificate.jpg");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
