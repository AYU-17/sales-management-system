// run_seed.js — Runs all SQL seed files against the Railway MySQL database
// Usage: node run_seed.js

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlDir = path.join(__dirname, 'sql');

const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
  connectTimeout: 60000,
});

console.log('✅ Connected to Railway MySQL\n');

async function runSQL(label, sql) {
  try {
    await conn.query(sql);
    console.log(`  ✅ ${label}`);
  } catch (err) {
    if (err.message.includes('Duplicate entry') || err.message.includes('already exists')) {
      console.log(`  ⚠️  ${label} — already exists, skipping`);
    } else {
      console.log(`  ❌ ${label} — ${err.message}`);
    }
  }
}

// ── 1. Check existing tables ──────────────────────────────────────────────────
const [tables] = await conn.query("SHOW TABLES");
const tableNames = tables.map(r => Object.values(r)[0]);
console.log(`📋 Existing tables (${tableNames.length}): ${tableNames.join(', ') || 'none'}\n`);

// ── 2. Verify products exist ──────────────────────────────────────────────────
const [[{ cnt }]] = await conn.query("SELECT COUNT(*) as cnt FROM products WHERE is_active=1");
console.log(`🛒 Active products: ${cnt}`);

if (cnt < 1) {
  console.log('  ❌ No active products! Please add products first.\n');
  process.exit(1);
}

// ── 3. Verify admin exists ────────────────────────────────────────────────────
const [[{ admCnt }]] = await conn.query("SELECT COUNT(*) as admCnt FROM admins");
const [[{ execCnt }]] = await conn.query("SELECT COUNT(*) as execCnt FROM executives");
console.log(`👤 Admins: ${admCnt}, Executives: ${execCnt}\n`);

// ── 4. Run the demo seed stored procedure ────────────────────────────────────
console.log('🚀 Running 200-row demo seed (this runs as a stored procedure)...');

const demoSql = fs.readFileSync(path.join(sqlDir, 'seed_sales_demo_200.sql'), 'utf8');

// Split on DELIMITER changes — execute the procedure creation then call it
try {
  // Drop old procedure if exists
  await conn.query("DROP PROCEDURE IF EXISTS seed_sales_demo_200");

  // Extract the procedure body (between CREATE PROCEDURE ... END$$ parts)
  const procedureMatch = demoSql.match(/CREATE PROCEDURE[\s\S]+?END\$\$/i);
  if (!procedureMatch) throw new Error('Could not parse procedure from SQL file');

  const procedureBody = procedureMatch[0].replace(/\$\$$/, '');

  await conn.query(procedureBody);
  console.log('  ✅ Procedure created');

  await conn.query("CALL seed_sales_demo_200()");
  console.log('  ✅ Procedure executed');

  await conn.query("DROP PROCEDURE IF EXISTS seed_sales_demo_200");
  console.log('  ✅ Procedure cleaned up');
} catch (err) {
  console.log(`  ❌ Demo seed failed: ${err.message}`);
}

// ── 5. Final summary ──────────────────────────────────────────────────────────
console.log('\n📊 Final row counts:');
const checkTables = ['admins','executives','areas','vendors','products','orders','order_items','payments'];
for (const t of checkTables) {
  const [[row]] = await conn.query(`SELECT COUNT(*) as c FROM \`${t}\``);
  console.log(`  ${t.padEnd(20)} → ${row.c} rows`);
}

await conn.end();
console.log('\n🎉 Database setup complete!');
console.log('\n🔑 Login credentials:');
console.log('  Admin    → admin@salesmanagement.com  / Admin@123');
console.log('  Executive→ rahul@example.com           / Exec@123');
