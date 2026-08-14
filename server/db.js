const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'rotc_inventory.db');
const SCHEMA_PATH = path.join(__dirname, '..', 'database', 'schema.sql');
const SEED_PATH = path.join(__dirname, '..', 'database', 'seed.sql');

let db = null;

function saveDb() {
    if (!db) return;
    try {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
    } catch (err) {
        console.error('Error saving SQLite database to disk:', err);
    }
}

function executeMultiStatementSql(sqlContent) {
    // Strip comments and split by semicolon
    const statements = sqlContent
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n')
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    for (const stmt of statements) {
        try {
            db.run(stmt);
        } catch (err) {
            console.error('SQL Execution Error on statement:', stmt, '\nError:', err.message);
        }
    }
}

async function initDatabase() {
    const SQL = await initSqlJs();
    if (fs.existsSync(DB_PATH)) {
        try {
            const filebuffer = fs.readFileSync(DB_PATH);
            db = new SQL.Database(filebuffer);
            console.log('Loaded existing SQLite database from:', DB_PATH);
        } catch (err) {
            console.warn('Could not read existing DB file, initializing new DB:', err.message);
            db = new SQL.Database();
        }
    } else {
        db = new SQL.Database();
        console.log('Created new in-memory SQLite database.');
    }

    db.run('PRAGMA foreign_keys = ON;');

    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    executeMultiStatementSql(schemaSql);

    // Add borrowable column if missing in older databases
    const tableInfo = db.exec("PRAGMA table_info('items');");
    const hasBorrowable = tableInfo.length > 0 && tableInfo[0].values.some(column => column[1] === 'borrowable');
    if (!hasBorrowable) {
        db.run('ALTER TABLE items ADD COLUMN borrowable INTEGER NOT NULL DEFAULT 1;');
    }

    // Add received_by column if missing in borrowings table
    const borrowingsInfo = db.exec("PRAGMA table_info('borrowings');");
    const hasReceivedBy = borrowingsInfo.length > 0 && borrowingsInfo[0].values.some(column => column[1] === 'received_by');
    if (!hasReceivedBy) {
        db.run('ALTER TABLE borrowings ADD COLUMN received_by TEXT;');
    }

    saveDb();

    // Check if items count is 0
    const res = all('SELECT COUNT(*) as count FROM items');
    const count = res.length > 0 ? res[0].count : 0;

    if (count === 0) {
        console.log('Database empty. Executing ROTC sample seed data...');
        const seedSql = fs.readFileSync(SEED_PATH, 'utf8');
        executeMultiStatementSql(seedSql);
        saveDb();
        console.log('Database seeded successfully.');
    } else {
        console.log(`Database initialized. Found ${count} catalog items.`);
    }
}

function all(sql, params = []) {
    if (!db) return [];
    try {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) {
            rows.push(stmt.getAsObject());
        }
        stmt.free();
        return rows;
    } catch (err) {
        console.error('Error executing query:', sql, params, err);
        return [];
    }
}

function get(sql, params = []) {
    const rows = all(sql, params);
    return rows.length > 0 ? rows[0] : null;
}

function run(sql, params = []) {
    if (!db) return { lastID: null };
    db.run(sql, params);
    const lastIdRow = get('SELECT last_insert_rowid() as id');
    saveDb();
    return { lastID: lastIdRow ? lastIdRow.id : null };
}

function resetSeed() {
    const seedSql = fs.readFileSync(SEED_PATH, 'utf8');
    executeMultiStatementSql(seedSql);
    saveDb();
}

module.exports = {
    initDatabase,
    all: (sql, params) => Promise.resolve(all(sql, params)),
    get: (sql, params) => Promise.resolve(get(sql, params)),
    run: (sql, params) => Promise.resolve(run(sql, params)),
    resetSeed
};
