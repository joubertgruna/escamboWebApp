require('dotenv').config();

const path = require('path');
const db = require(path.join(__dirname, '..', 'src', 'config', 'database'));
const bcrypt = require('bcryptjs');

async function resetPasswords({ target = 'all', password = 'Test@1234' } = {}) {
  try {
    const users = await db('users').select('id', 'email');

    const targets = users.filter(() => true); // default: all

    const hashed = await bcrypt.hash(password, 12);

    const updated = [];

    for (const u of targets) {
      await db('users').where({ id: u.id }).update({ password_hash: hashed, updated_at: db.fn.now() });
      updated.push({ id: u.id, email: u.email });
    }

    console.log(`✅ Updated password for ${updated.length} users`);
    updated.forEach(u => console.log(` - id: ${u.id}  email: ${u.email}`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error resetting passwords:', err.message || err);
    process.exit(1);
  }
}

// CLI
const args = process.argv.slice(2);
const passwordArg = args[0] || 'Test@1234';
resetPasswords({ password: passwordArg });
