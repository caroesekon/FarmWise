const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SVG_PATH = path.join(__dirname, '..', 'public', 'logo.svg');
const OUTPUT_DIR = path.join(__dirname, '..', 'public');

const icons = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'favicon.ico', size: 48 },
  { name: 'apple-icon-180.png', size: 180 },
  { name: 'splash.png', size: 1284, background: '#1b5e20' },
];

async function generateIcons() {
  if (!fs.existsSync(SVG_PATH)) {
    console.error('❌ logo.svg not found in public folder');
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(SVG_PATH);

  console.log('🎨 Generating PWA icons from logo.svg...\n');

  for (const { name, size, background } of icons) {
    const outputPath = path.join(OUTPUT_DIR, name);

    try {
      if (background) {
        await sharp({
          create: {
            width: size,
            height: size,
            channels: 4,
            background: background,
          },
        })
          .composite([{ input: await sharp(svgBuffer).resize(Math.floor(size * 0.5), Math.floor(size * 0.5)).toBuffer(), gravity: 'center' }])
          .png()
          .toFile(outputPath);
      } else {
        await sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toFile(outputPath);
      }
      console.log(`  ✅ ${name} (${size}x${size})`);
    } catch (err) {
      console.error(`  ❌ ${name}: ${err.message}`);
    }
  }

  console.log('\n✨ PWA icons generated successfully!');
}

generateIcons();