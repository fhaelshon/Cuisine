const fs = require('fs');
const path = require('path');

const MENU_PATH = path.join(__dirname, '..', 'js', 'menu-data.js');
const MAPPING_PATH = path.join(__dirname, '..', 'images', 'menu', 'mapping.txt');

let items;
try {
    items = require(MENU_PATH);
} catch (err) {
    console.error('Failed to require menu-data.js:', err);
    process.exit(1);
}

const mapping = {};
if (fs.existsSync(MAPPING_PATH)) {
    const lines = fs.readFileSync(MAPPING_PATH, 'utf8').split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
        const [orig, local] = line.split('|');
        mapping[orig] = local;
    }
}

for (const item of items) {
    if (!item || !item.image) continue;
    if (item.image.startsWith('data:')) continue;
    if (mapping[item.image]) {
        item.image = mapping[item.image];
    } else {
        // try to match by base URL without query
        const qIndex = item.image.indexOf('?');
        const base = qIndex >= 0 ? item.image.substring(0, qIndex) : item.image;
        const key = Object.keys(mapping).find(k => k.startsWith(base) || k.includes(base));
        if (key) item.image = mapping[key];
    }
}

const header = `// Complete African Cuisine Menu Data\n`;
const content = header + 'const menuItems = ' + JSON.stringify(items, null, 4) + ';\n\n' +
"// Export for use in main.js\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = menuItems;\n}\n";

fs.copyFileSync(MENU_PATH, MENU_PATH + '.regenerate-backup');
fs.writeFileSync(MENU_PATH, content, 'utf8');
console.log('Regenerated', MENU_PATH, 'with local image paths where mapped. Backup at', MENU_PATH + '.regenerate-backup');
