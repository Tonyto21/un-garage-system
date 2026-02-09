const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '..', 'database.sqlite'));

// Create tables
db.serialize(() => {
       // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'requestor', 'mechanic')) NOT NULL,
        agency TEXT DEFAULT 'UN House Liberia',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Vehicles table
    db.run(`CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        number_plate TEXT UNIQUE NOT NULL,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER,
        current_mileage INTEGER,
        status TEXT CHECK(status IN ('active', 'under_service')) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Service Requests table
    db.run(`CREATE TABLE IF NOT EXISTS service_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        requestor_id INTEGER NOT NULL,
        vehicle_id INTEGER NOT NULL,
        service_type TEXT CHECK(service_type IN ('preventive', 'repair', 'inspection', 'emergency')) NOT NULL,
        priority TEXT CHECK(priority IN ('scheduled', 'non_scheduled', 'emergency')) NOT NULL,
        description TEXT NOT NULL,
        photo_url TEXT,
        status TEXT CHECK(status IN ('submitted', 'approved', 'rejected', 'completed')) DEFAULT 'submitted',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (requestor_id) REFERENCES users(id),
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )`);

    // Work Orders table
    db.run(`CREATE TABLE IF NOT EXISTS work_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_request_id INTEGER UNIQUE NOT NULL,
        assigned_mechanic_id INTEGER NOT NULL,
        instructions TEXT,
        status TEXT CHECK(status IN ('pending', 'in_progress', 'completed', 'closed')) DEFAULT 'pending',
        started_at DATETIME,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_request_id) REFERENCES service_requests(id),
        FOREIGN KEY (assigned_mechanic_id) REFERENCES users(id)
    )`);

    // Work Logs table
    db.run(`CREATE TABLE IF NOT EXISTS work_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        work_order_id INTEGER NOT NULL,
        notes TEXT NOT NULL,
        hours_spent REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
    )`);

    console.log('✅ Database tables created successfully');
});

module.exports = db;