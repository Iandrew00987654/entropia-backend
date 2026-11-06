import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'entropia_db',
  connectionLimit: 5,
});

// Prueba rápida de conexión al levantar el servidor
export async function testConnection(): Promise<void> {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('✅ Conexión exitosa a MariaDB (entropia_db)');
  } catch (err) {
    console.error('❌ Error conectando a MariaDB:', err);
  } finally {
    if (conn) conn.release();
  }
}