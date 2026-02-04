const fs = require('fs');
const path = require('path');

const MENU_PATH = path.join(__dirname, '..', 'js', 'menu-data.js');
const MAPPING_PATH = path.join(__dirname, '..', 'images', 'menu', 'mapping.txt');

if (!fs.existsSync(MAPPING_PATH)) {
    console.error('Mapping file not found:', MAPPING_PATH);
    process.exit(1);
}

const mappings = fs.readFileSync(MAPPING_PATH, 'utf8').split(/\r?\n/).filter(Boolean).map(line => {
    const parts = line.split('|');
    return { original: parts[0], local: parts[1] };
});

let text = fs.readFileSync(MENU_PATH, 'utf8');
for (const m of mappings) {
    const escaped = m.original.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const reDouble = new RegExp('"' + escaped + '"', 'g');
    const reSingle = new RegExp("'" + escaped + "'", 'g');
    text = text.replace(reDouble, '"' + m.local + '"');
    text = text.replace(reSingle, "'" + m.local + "'");
}

fs.copyFileSync(MENU_PATH, MENU_PATH + '.backup2');
fs.writeFileSync(MENU_PATH, text, 'utf8');
console.log('Applied mapping to', MENU_PATH, 'backup saved to', MENU_PATH + '.backup2');
