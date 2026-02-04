const fs = require('fs');
const path = require('path');
const url = require('url');
const http = require('http');
const https = require('https');

const MENU_PATH = path.join(__dirname, '..', 'js', 'menu-data.js');
const IMAGES_DIR = path.join(__dirname, '..', 'images');

if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

let items;
try {
    items = require(MENU_PATH);
} catch (err) {
    console.error('Failed to require menu-data.js:', err);
    process.exit(1);
}

function getExtFromUrl(u) {
    try {
        const p = new url.URL(u).pathname;
        const ext = path.extname(p).split('?')[0] || '';
        if (ext && ext.length <= 5) return ext;
    } catch (e) {}
    return '.jpg';
}

function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function downloadFile(fileUrl, dest) {
    return new Promise((resolve, reject) => {
        const client = fileUrl.startsWith('https') ? https : http;
        const req = client.get(fileUrl, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // follow redirect
                return resolve(downloadFile(res.headers.location, dest));
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to get '${fileUrl}' (${res.statusCode})`));
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => file.close(() => resolve()));
        });
        req.on('error', (err) => reject(err));
    });
}

(async () => {
    console.log('Found', items.length, 'menu items.');
    const replacements = []; // {original, local}

    for (const item of items) {
        if (!item || !item.image) continue;
        const img = item.image;
        if (img.startsWith('data:')) {
            console.log(`[id:${item.id}] skipping inline data URI`);
            continue;
        }
        if (!/^https?:\/\//i.test(img)) {
            console.log(`[id:${item.id}] skipping non-http image: ${img}`);
            continue;
        }
        const ext = getExtFromUrl(img) || '.jpg';
        const filename = `menu-${item.id}-${slugify(item.name || 'item')}${ext}`;
        const localPath = path.join(IMAGES_DIR, filename);
        const relPath = `images/${filename}`;

        if (fs.existsSync(localPath)) {
            console.log(`[id:${item.id}] already downloaded -> ${relPath}`);
        } else {
            try {
                console.log(`[id:${item.id}] downloading ${img} -> ${relPath}`);
                await downloadFile(img, localPath);
                console.log(`[id:${item.id}] saved ${relPath}`);
            } catch (err) {
                console.error(`[id:${item.id}] failed to download:`, err.message);
                continue;
            }
        }

        replacements.push({ original: img, local: relPath });
    }

    if (replacements.length === 0) {
        console.log('No remote images found to replace.');
        return;
    }

    // Read original js file as text and replace occurrences of the original URL string with local path
    let text = fs.readFileSync(MENU_PATH, 'utf8');
    for (const r of replacements) {
        // replace exact quoted string occurrences (both single and double quotes)
        const escaped = r.original.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const reDouble = new RegExp('"' + escaped + '"', 'g');
        const reSingle = new RegExp("'" + escaped + "'", 'g');
        text = text.replace(reDouble, '"' + r.local + '"');
        text = text.replace(reSingle, "'" + r.local + "'");
    }

    // Backup the original file
    fs.copyFileSync(MENU_PATH, MENU_PATH + '.backup');
    fs.writeFileSync(MENU_PATH, text, 'utf8');
    console.log('Updated', MENU_PATH, 'with local image paths. Backup saved to', MENU_PATH + '.backup');
})();
