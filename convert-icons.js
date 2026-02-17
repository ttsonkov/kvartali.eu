// Node.js script to convert SVG to PNG icons
// Run: npm install sharp && node convert-icons.js

const fs = require('fs');
const path = require('path');

async function convertIcons() {
    let sharp;
    try {
        sharp = require('sharp');
    } catch (e) {
        console.error('Please install sharp first: npm install sharp');
        process.exit(1);
    }

    const iconSvg = fs.readFileSync('icon.svg');
    const ogSvg = fs.readFileSync('og-image.svg');

    const sizes = [72, 96, 128, 144, 192, 512];

    console.log('Generating PNG icons from icon.svg...');
    
    for (const size of sizes) {
        const output = `icon-${size}.png`;
        await sharp(iconSvg)
            .resize(size, size)
            .png()
            .toFile(output);
        console.log(`  Created ${output} (${size}x${size})`);
    }

    // Generate og-image.png
    console.log('  Creating og-image.png (1200x630)');
    await sharp(ogSvg)
        .resize(1200, 630)
        .png()
        .toFile('og-image.png');

    // Generate placeholder screenshots
    console.log('  Creating screenshot1.png (540x720)');
    await sharp(ogSvg)
        .resize(540, 720, { fit: 'contain', background: { r: 102, g: 126, b: 234 } })
        .png()
        .toFile('screenshot1.png');

    console.log('  Creating screenshot2.png (1024x768)');
    await sharp(ogSvg)
        .resize(1024, 768, { fit: 'contain', background: { r: 102, g: 126, b: 234 } })
        .png()
        .toFile('screenshot2.png');

    console.log('\nDone! Generated files:');
    const files = fs.readdirSync('.').filter(f => 
        f.match(/^icon-\d+\.png$/) || f === 'og-image.png' || f.match(/^screenshot\d\.png$/)
    );
    files.forEach(f => console.log(`  ${f}`));
    
    console.log('\nNote: Replace screenshot1.png and screenshot2.png with actual app screenshots.');
}

convertIcons().catch(console.error);
