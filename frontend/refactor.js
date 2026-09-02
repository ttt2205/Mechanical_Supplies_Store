const fs = require('fs');
let code = fs.readFileSync('src/data/mock-products.ts', 'utf8');

let attachmentIdCounter = 1000;
code = code.replace(/images:\s*\[([\s\S]*?)\]/g, (match, arrayContent) => {
    const urls = [];
    const regex = /['"](.*?)['"]/g;
    let m;
    while ((m = regex.exec(arrayContent)) !== null) {
        urls.push(m[1]);
    }
    
    if (urls.length === 0) return match;

    const newArrayContent = urls.map((url, i) => {
        attachmentIdCounter++;
        return `      { attachment_id: ${attachmentIdCounter}, url: '${url}', order: ${i + 1}, is_current: true }`;
    }).join(',\n');

    return `images: [\n${newArrayContent}\n    ]`;
});

fs.writeFileSync('src/data/mock-products.ts', code);
console.log('Updated mock-products.ts');
