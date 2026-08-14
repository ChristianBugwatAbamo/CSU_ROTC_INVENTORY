-- CSU ROTC Unit Inventory Database Schema
-- Headquarters Caraga State University Main Campus ROTC Unit (Activated)

-- 1. Equipment Status Table
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    unit_of_measure TEXT NOT NULL DEFAULT 'pcs',
    serviceable_qty INTEGER NOT NULL DEFAULT 0,
    repairable_qty INTEGER NOT NULL DEFAULT 0,
    condemned_qty INTEGER NOT NULL DEFAULT 0,
    borrowable INTEGER NOT NULL DEFAULT 1,
    image_url TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Borrow / Return Log Table
CREATE TABLE IF NOT EXISTS borrowings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    borrower_name TEXT NOT NULL,
    borrower_id TEXT NOT NULL,
    borrower_contact TEXT,
    checkout_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expected_return_date DATETIME NOT NULL,
    actual_return_date DATETIME,
    return_condition TEXT CHECK(return_condition IN ('Good', 'Damaged', 'Lost')) DEFAULT NULL,
    checkout_notes TEXT,
    return_notes TEXT,
    handled_by TEXT NOT NULL DEFAULT 'Supply Officer',
    status TEXT CHECK(status IN ('Active', 'Returned', 'Overdue')) NOT NULL DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_borrowings_status ON borrowings(status);
CREATE INDEX IF NOT EXISTS idx_borrowings_item_id ON borrowings(item_id);
CREATE INDEX IF NOT EXISTS idx_borrowings_expected_return ON borrowings(expected_return_date);
