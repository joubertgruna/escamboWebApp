require('dotenv').config();

const path = require('path');
const db = require(path.join(__dirname, '..', 'src', 'config', 'database'));

async function exportUsers() {
  try {
    const users = await db('users').select('*');
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error fetching users:', err.message || err);
    process.exit(1);
  }
}

exportUsers();
