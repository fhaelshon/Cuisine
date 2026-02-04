const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const MENU_PATH = path.join(__dirname, '..', 'js', 'menu-data.js');
const IMAGES_DIR = path.join(__dirname, '..', 'images', 'menu');
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

let items;
try {
    items = require(MENU_PATH);
} catch (err) {
    console.error('Failed to require menu-data.js:', err);
    process.exit(1);
}

function getExt(u) {
    try {
        const urlObj = new URL(u);
        const p = urlObj.pathname;
        const ext = path.extname(p);
        return ext || '.jpg';
    } catch (e) { return '.jpg'; }
}

function slugify(s) {
    return (s||'item').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            if (res.statusCode >=300 && res.statusCode <400 && res.headers.location) {
                return resolve(download(res.headers.location, dest));
            }
            if (res.statusCode !== 200) return reject(new Error('Status ' + res.statusCode));
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', reject);
    });
}

(async () => {
    console.log('Items:', items.length);
    for (const item of items) {
        if (!item || !item.image) continue;
        const img = item.image;
        if (!/^https?:\/\//i.test(img)) continue;
        const ext = getExt(img);
        const filename = `menu-${item.id}-${slugify(item.name||'item')}${ext}`;
        const dest = path.join(IMAGES_DIR, filename);
        try {
            console.log(`Downloading id:${item.id} -> ${filename}`);
            await download(img, dest);
            console.log(`Saved ${dest}`);
            item.image = `images/menu/${filename}`;
        } catch (err) {
            console.error(`Failed id:${item.id} ${img}: ${err.message}`);
        }
    }

    // write back menu-data.js
    const header = `// Complete African Cuisine Menu Data\n`;
    const content = header + 'const menuItems = ' + JSON.stringify(items, null, 4) + ';\n\n' +
    "// Export for use in main.js\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = menuItems;\n}\n";
    fs.copyFileSync(MENU_PATH, MENU_PATH + '.fetch-backup');
    fs.writeFileSync(MENU_PATH, content, 'utf8');
    console.log('Wrote updated', MENU_PATH);
})();
