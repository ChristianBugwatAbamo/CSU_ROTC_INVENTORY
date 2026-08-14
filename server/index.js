const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { initDatabase, all, get, run, resetSeed } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure public/uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `${name}_${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// Initialize Database on server start
initDatabase().catch(err => {
    console.error('Fatal DB Init Error:', err);
});

// ─── IMAGE UPLOAD ENDPOINT ───────────────────────────────────────────────────
app.post(['/api/upload', '/api/inventory/upload'], upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded.' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl, filename: req.file.filename });
});

// ─── SUMMARY / OVERVIEW ──────────────────────────────────────────────────────
app.get(['/api/summary', '/api/inventory/summary'], async (req, res) => {
    try {
        const totalItemsRow = await get('SELECT COUNT(*) as count FROM items');

        const totals = await get(`
            SELECT 
                SUM(serviceable_qty) as total_serviceable,
                SUM(repairable_qty) as total_repairable,
                SUM(condemned_qty) as total_condemned
            FROM items
        `);

        const categoryRows = await all(`
            SELECT category,
                COUNT(*) as item_count,
                SUM(serviceable_qty) as serviceable,
                SUM(repairable_qty) as repairable,
                SUM(condemned_qty) as condemned
            FROM items
            GROUP BY category
            ORDER BY category ASC
        `);

        const borrowedRow = await get(`SELECT COUNT(*) as count FROM borrowings WHERE status = 'Active'`);
        const overdueRow = await get(`
            SELECT COUNT(*) as count FROM borrowings 
            WHERE status = 'Active' AND expected_return_date < CURRENT_TIMESTAMP
        `);

        res.json({
            totalItems: totalItemsRow.count,
            totalServiceable: totals.total_serviceable || 0,
            totalRepairable: totals.total_repairable || 0,
            totalCondemned: totals.total_condemned || 0,
            byCategory: categoryRows,
            currentlyBorrowed: borrowedRow.count,
            overdueCount: overdueRow.count
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── EQUIPMENT ITEMS CRUD ─────────────────────────────────────────────────────
app.get(['/api/items', '/api/inventory/items'], async (req, res) => {
    try {
        const items = await all(`
            SELECT id, name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty,
                   COALESCE(borrowable, 1) as borrowable, image_url, description, created_at, updated_at
            FROM items ORDER BY category ASC, name ASC
        `);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get(['/api/items/:id', '/api/inventory/items/:id'], async (req, res) => {
    try {
        const item = await get(`
            SELECT id, name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty,
                   COALESCE(borrowable, 1) as borrowable, image_url, description, created_at, updated_at
            FROM items WHERE id = ?
        `, [req.params.id]);
        if (!item) return res.status(404).json({ error: 'Item not found.' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post(['/api/items', '/api/inventory/items'], async (req, res) => {
    const { name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, borrowable, image_url, description } = req.body;
    if (!name || !category) {
        return res.status(400).json({ error: 'Item name and category are required.' });
    }
    try {
        const existing = await get('SELECT id FROM items WHERE LOWER(name) = LOWER(?)', [name.trim()]);
        if (existing) {
            return res.status(400).json({ error: 'DUPLICATE_ITEM_NAME', message: `An item named "${name}" already exists.` });
        }
        const result = await run(
            `INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, borrowable, image_url, description)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name.trim(), category, unit_of_measure || 'pcs',
             serviceable_qty || 0, repairable_qty || 0, condemned_qty || 0,
             borrowable !== undefined && borrowable !== null ? (borrowable ? 1 : 0) : 1, image_url || null, description || '']
        );
        const newItem = await get(`
            SELECT id, name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty,
                   COALESCE(borrowable, 1) as borrowable, image_url, description, created_at, updated_at
            FROM items WHERE id = ?
        `, [result.lastID]);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put(['/api/items/:id', '/api/inventory/items/:id'], async (req, res) => {
    const { id } = req.params;
    const { name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, borrowable, image_url, description } = req.body;
    try {
        const existing = await get('SELECT * FROM items WHERE id = ?', [id]);
        if (!existing) return res.status(404).json({ error: 'Item not found.' });

        if (name && name.toLowerCase() !== existing.name.toLowerCase()) {
            const dup = await get('SELECT id FROM items WHERE LOWER(name) = LOWER(?) AND id != ?', [name.trim(), id]);
            if (dup) return res.status(400).json({ error: 'DUPLICATE_ITEM_NAME', message: `An item named "${name}" already exists.` });
        }

        await run(
            `UPDATE items SET name=?, category=?, unit_of_measure=?, serviceable_qty=?, repairable_qty=?, condemned_qty=?, borrowable=?, image_url=?, description=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
            [
                name || existing.name,
                category || existing.category,
                unit_of_measure || existing.unit_of_measure,
                serviceable_qty ?? existing.serviceable_qty,
                repairable_qty ?? existing.repairable_qty,
                condemned_qty ?? existing.condemned_qty,
                borrowable !== undefined && borrowable !== null ? (borrowable ? 1 : 0) : existing.borrowable,
                image_url !== undefined ? image_url : existing.image_url,
                description ?? existing.description,
                id
            ]
        );
        const updated = await get(`
            SELECT id, name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty,
                   COALESCE(borrowable, 1) as borrowable, image_url, description, created_at, updated_at
            FROM items WHERE id = ?
        `, [id]);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete(['/api/items/:id', '/api/inventory/items/:id'], async (req, res) => {
    const { id } = req.params;
    try {
        const existing = await get('SELECT * FROM items WHERE id = ?', [id]);
        if (!existing) return res.status(404).json({ error: 'Item not found.' });
        await run('DELETE FROM items WHERE id = ?', [id]);
        res.json({ message: `Item "${existing.name}" deleted successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/inventory/borrowings/by-cadet/:borrower_id — Cadet Portal lookup
app.get(['/api/borrowings/by-cadet/:borrower_id', '/api/inventory/borrowings/by-cadet/:borrower_id'], async (req, res) => {
    try {
        const { borrower_id } = req.params;
        const rows = await all(`
            SELECT b.*, i.name as item_name, i.category as item_category, i.unit_of_measure
            FROM borrowings b
            JOIN items i ON b.item_id = i.id
            WHERE b.borrower_id = ?
            ORDER BY b.created_at DESC
        `, [borrower_id]);
        const now = new Date().toISOString();
        const enriched = rows.map(b => ({
            ...b,
            is_overdue: b.status === 'Active' && b.expected_return_date < now
        }));
        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get(['/api/borrowings', '/api/inventory/borrowings'], async (req, res) => {
    try {
        const { status, search } = req.query;
        let sql = `
            SELECT b.*, i.name as item_name, i.category as item_category, i.unit_of_measure
            FROM borrowings b
            JOIN items i ON b.item_id = i.id
            WHERE 1=1
        `;
        const params = [];

        if (status) { sql += ` AND b.status = ?`; params.push(status); }
        if (search) {
            sql += ` AND (b.borrower_name LIKE ? OR b.borrower_id LIKE ? OR i.name LIKE ?)`;
            const t = `%${search}%`;
            params.push(t, t, t);
        }

        sql += ` ORDER BY b.created_at DESC`;
        const rows = await all(sql, params);
        const now = new Date().toISOString();
        const enriched = rows.map(b => ({
            ...b,
            is_overdue: b.status === 'Active' && b.expected_return_date < now
        }));
        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post(['/api/borrowings', '/api/inventory/borrowings'], async (req, res) => {
    const { item_id, quantity, borrower_name, borrower_id, borrower_contact, expected_return_date, checkout_notes, handled_by } = req.body;
    if (!item_id || !borrower_name || !borrower_id || !expected_return_date) {
        return res.status(400).json({ error: 'item_id, borrower_name, borrower_id, and expected_return_date are required.' });
    }
    try {
        const item = await get('SELECT * FROM items WHERE id = ?', [item_id]);
        if (!item) return res.status(404).json({ error: 'Item not found.' });

        const qty = quantity || 1;
        if (item.serviceable_qty < qty) {
            return res.status(400).json({ error: `Only ${item.serviceable_qty} serviceable unit(s) of "${item.name}" available.` });
        }

        const checkout_date = new Date().toISOString();
        const result = await run(
            `INSERT INTO borrowings (item_id, quantity, borrower_name, borrower_id, borrower_contact, checkout_date, expected_return_date, checkout_notes, handled_by, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`,
            [item_id, qty, borrower_name.trim(), borrower_id.trim(), borrower_contact || null, checkout_date, expected_return_date, checkout_notes || null, handled_by || 'Supply Officer']
        );

        // Deduct from serviceable quantity
        await run(`UPDATE items SET serviceable_qty = serviceable_qty - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [qty, item_id]);

        const newBorrowing = await get(`
            SELECT b.*, i.name as item_name, i.unit_of_measure
            FROM borrowings b JOIN items i ON b.item_id = i.id
            WHERE b.id = ?`, [result.lastID]);

        res.status(201).json({ message: 'Equipment checked out successfully.', borrowing: newBorrowing });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put(['/api/borrowings/:id/return', '/api/inventory/borrowings/:id/return'], async (req, res) => {
    const { id } = req.params;
    const { return_condition, return_notes, handled_by } = req.body;
    if (!return_condition) {
        return res.status(400).json({ error: 'return_condition is required (Good, Damaged, or Lost).' });
    }
    try {
        const borrowing = await get('SELECT * FROM borrowings WHERE id = ?', [id]);
        if (!borrowing) return res.status(404).json({ error: 'Borrowing record not found.' });
        if (borrowing.status !== 'Active') return res.status(400).json({ error: 'This borrowing has already been returned.' });

        const actualReturnDate = new Date().toISOString();
        await run(
            `UPDATE borrowings SET status='Returned', actual_return_date=?, return_condition=?, return_notes=?, handled_by=COALESCE(?,handled_by), updated_at=CURRENT_TIMESTAMP WHERE id=?`,
            [actualReturnDate, return_condition, return_notes || null, handled_by || null, id]
        );

        // Add back to appropriate qty column based on condition
        const qty = borrowing.quantity;
        if (return_condition === 'Good') {
            await run(`UPDATE items SET serviceable_qty = serviceable_qty + ?, updated_at=CURRENT_TIMESTAMP WHERE id=?`, [qty, borrowing.item_id]);
        } else if (return_condition === 'Damaged') {
            await run(`UPDATE items SET repairable_qty = repairable_qty + ?, updated_at=CURRENT_TIMESTAMP WHERE id=?`, [qty, borrowing.item_id]);
        } else if (return_condition === 'Lost') {
            await run(`UPDATE items SET condemned_qty = condemned_qty + ?, updated_at=CURRENT_TIMESTAMP WHERE id=?`, [qty, borrowing.item_id]);
        }

        const updated = await get(`
            SELECT b.*, i.name as item_name, i.unit_of_measure
            FROM borrowings b JOIN items i ON b.item_id = i.id
            WHERE b.id = ?`, [id]);

        res.json({ message: 'Equipment returned successfully.', borrowing: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── RESET DATABASE ───────────────────────────────────────────────────────────
app.post(['/api/seed/reset', '/api/inventory/seed/reset'], async (req, res) => {
    try {
        resetSeed();
        res.json({ message: 'Database reset successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve production build
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`CSU ROTC Inventory API Server running on port ${PORT}`);
});
