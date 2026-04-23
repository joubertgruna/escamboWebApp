const fs = require('fs');
const path = require('path');
const db = require('../src/config/database');

(async () => {
  try {
    const uploadsDir = path.resolve(__dirname, '..', 'uploads');
    // pick a source image that already exists in uploads
    const sourceCandidates = fs.readdirSync(uploadsDir).filter((f) => /\.(png|jpg|jpeg|webp)$/.test(f));
    if (!sourceCandidates.length) {
      console.error('Nenhuma imagem encontrada em backend/uploads. Por favor, coloque a imagem desejada em backend/uploads e rode este script novamente.');
      process.exit(1);
    }

    const source = sourceCandidates[0];
    const destName = `bulk_image_for_all_items${path.extname(source)}`;
    const destPath = path.join(uploadsDir, destName);

    // copy source to dest (idempotent)
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(path.join(uploadsDir, source), destPath);
      console.log('Copied', source, 'to', destName);
    } else {
      console.log('Destination already exists:', destName);
    }

    const urlPath = `/uploads/${destName}`;

    // fetch all items
    const items = await db('items').select('id');
    console.log('Found', items.length, 'items');

    let inserted = 0;
    for (const item of items) {
      const existing = await db('photos').where({ item_id: item.id }).first();
      const isPrimary = !existing ? true : false;

      await db('photos').insert({
        item_id: item.id,
        url: urlPath,
        is_primary: isPrimary,
        order: 0,
        created_at: new Date(),
      });
      inserted += 1;
    }

    console.log('Inserted photo for items:', inserted);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(2);
  } finally {
    try { await db.destroy(); } catch (e) {}
  }
})();
