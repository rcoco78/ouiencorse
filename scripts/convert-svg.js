const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Chemin des fichiers
const svgPath = path.join(__dirname, '../images/og-image.svg');
const jpgPath = path.join(__dirname, '../images/og-image.jpg');

// Lire le SVG
const svgBuffer = fs.readFileSync(svgPath);

// Convertir en JPG
sharp(svgBuffer)
    .resize(1200, 630)
    .jpeg({
        quality: 90,
        chromaSubsampling: '4:4:4'
    })
    .toFile(jpgPath)
    .then(() => {
        console.log('Conversion SVG vers JPG terminée !');
    })
    .catch(err => {
        console.error('Erreur lors de la conversion:', err);
    }); 