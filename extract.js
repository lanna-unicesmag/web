const fs = require('fs');
const html = fs.readFileSync('presentacion.html', 'utf8');

const regex = /<div class="slide[^>]*data-index="(\d+)"[^>]*>([\s\S]*?)<\!-- ===/g;
let content = '';
let match;
while ((match = regex.exec(html)) !== null) {
    const slideNum = parseInt(match[1]) + 1;
    content += "## Diapositiva " + slideNum + "\n";
    
    // Naively extract anything in a <p>, <h1>, <h2>, <h3>, <div class="lanna-label">, <strong ... lanna-gold-bold>
    const tagRegex = /<([a-zA-Z0-9]+)[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/\1>/g;
    let tagMatch;
    while ((tagMatch = tagRegex.exec(match[2])) !== null) {
        const cls = tagMatch[2];
        let text = tagMatch[3].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        // Decode html entities
        text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&ntilde;/g, 'ñ').replace(/&Ntilde;/g, 'Ñ').replace(/&iacute;/g, 'í').replace(/&oacute;/g, 'ó').replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é').replace(/&uacute;/g, 'ú').replace(/&middot;/g, '·').replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"');
        if (text.length > 2 && !cls.includes('pres-') && !cls.includes('slide') && !cls.includes('fade')) {
            content += "- **[" + cls + "]**: " + text + "\n";
        }
    }
    content += "\n";
}
fs.writeFileSync('lanna_contenido_presentacion.md', content);
console.log('Created markdown.');
