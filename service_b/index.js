const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'rootpass',
  database: process.env.MYSQL_DATABASE || 'serviceb_db'
};

async function initDb() {
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      note VARCHAR(255)
    )
  `);
  await conn.end();
}

app.get('/combined', async (req, res) => {
  try {
    const response = await fetch('http://service-a:5000/greet');
    const data = await response.json();

    const conn = await mysql.createConnection(dbConfig);
    await conn.execute('INSERT INTO logs (note) VALUES (?)', ['combined called']);
    await conn.end();

    res.json({ from_service_b: 'Hello from Service B', service_a_says: data.message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
initDb().then(() => {
  app.listen(PORT, () => console.log(`Service B running on port ${PORT}`));
});