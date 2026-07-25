import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '3306'),
};

let pool = null;

async function getPool() {
  if (pool) return pool;

  try {
    // 1. Establish basic connection to check / create the database
    const tempConnection = await mysql.createConnection(dbConfig);
    await tempConnection.query('CREATE DATABASE IF NOT EXISTS `promacon_next_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    await tempConnection.end();

    // 2. Establish connection pool with the created database
    pool = mysql.createPool({
      ...dbConfig,
      database: 'promacon_next_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // 3. Initialize schema
    await initTables();

    return pool;
  } catch (error) {
    console.error('Database connection / initialization failed:', error);
    throw error;
  }
}

async function initTables() {
  const conn = await pool.getConnection();
  try {
    // Create users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Create inquiries table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        project_type VARCHAR(100) NOT NULL,
        budget VARCHAR(100) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'Lead',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Seed default admin account if not exists
    const [adminUsers] = await conn.query('SELECT * FROM users WHERE username = ?', ['admin']);
    if (adminUsers.length === 0) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
      console.log('Seeded default admin user: admin / admin123');
    }

    // Seed default customer account if not exists
    const [customerUsers] = await conn.query('SELECT * FROM users WHERE username = ?', ['customer']);
    if (customerUsers.length === 0) {
      const hashedPassword = bcrypt.hashSync('customer123', 10);
      await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', ['customer', hashedPassword]);
      console.log('Seeded default customer user: customer / customer123');
    }

    // Seed default designer account if not exists
    const [designerUsers] = await conn.query('SELECT * FROM users WHERE username = ?', ['designer']);
    if (designerUsers.length === 0) {
      const hashedPassword = bcrypt.hashSync('designer123', 10);
      await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', ['designer', hashedPassword]);
      console.log('Seeded default designer user: designer / designer123');
    }

    // Seed default manager account if not exists
    const [managerUsers] = await conn.query('SELECT * FROM users WHERE username = ?', ['manager']);
    if (managerUsers.length === 0) {
      const hashedPassword = bcrypt.hashSync('manager123', 10);
      await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', ['manager', hashedPassword]);
      console.log('Seeded default manager user: manager / manager123');
    }
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  } finally {
    conn.release();
  }
}

// Global query execution wrapper
export async function query(sql, params) {
  const currentPool = await getPool();
  const [results] = await currentPool.query(sql, params);
  return results;
}
