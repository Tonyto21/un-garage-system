const db = require('./index');

class Vehicle {
    static async create(vehicle) {
        const { number_plate, make, model, year, current_mileage, status } = vehicle;
        
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO vehicles (number_plate, make, model, year, current_mileage, status) VALUES (?, ?, ?, ?, ?, ?)`,
                [number_plate, make, model, year, current_mileage, status || 'active'],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...vehicle });
                }
            );
        });
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM vehicles ORDER BY created_at DESC`, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM vehicles WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static async update(id, updates) {
        const fields = [];
        const values = [];
        
        if (updates.number_plate) {
            fields.push('number_plate = ?');
            values.push(updates.number_plate);
        }
        if (updates.make) {
            fields.push('make = ?');
            values.push(updates.make);
        }
        if (updates.model) {
            fields.push('model = ?');
            values.push(updates.model);
        }
        if (updates.year) {
            fields.push('year = ?');
            values.push(updates.year);
        }
        if (updates.current_mileage) {
            fields.push('current_mileage = ?');
            values.push(updates.current_mileage);
        }
        if (updates.status) {
            fields.push('status = ?');
            values.push(updates.status);
        }
        
        if (fields.length === 0) return null;
        
        values.push(id);
        
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE vehicles SET ${fields.join(', ')} WHERE id = ?`,
                values,
                function(err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                }
            );
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM vehicles WHERE id = ?`, [id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    static async getVehiclesUnderService() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM vehicles WHERE status = 'under_service'`, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

module.exports = Vehicle;