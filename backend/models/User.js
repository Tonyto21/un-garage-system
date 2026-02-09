const db = require('./index');
const bcrypt = require('bcryptjs');

class User {
    static async create(user) {
        const { name, email, password, role, agency } = user;
        const passwordHash = await bcrypt.hash(password, 10);
        
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (name, email, password_hash, role, agency) VALUES (?, ?, ?, ?, ?)`,
                [name, email, passwordHash, role, agency || 'UN House Liberia'],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, name, email, role, agency: agency || 'UN House Liberia' });
                }
            );
        });
    }
    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT id, name, email, role, agency, created_at FROM users WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
    static async getAll() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT id, name, email, role, agency, created_at FROM users ORDER BY created_at DESC`, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
    static async update(id, updates) {
        const fields = [];
        const values = [];
        
        if (updates.name) {
            fields.push('name = ?');
            values.push(updates.name);
        }
        if (updates.email) {
            fields.push('email = ?');
            values.push(updates.email);
        }
        if (updates.role) {
            fields.push('role = ?');
            values.push(updates.role);
        }
        if (updates.agency !== undefined) {
            fields.push('agency = ?');
            values.push(updates.agency);
        }
        
        if (fields.length === 0) return null;
        
        values.push(id);
        
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
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
            db.run(`DELETE FROM users WHERE id = ?`, [id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    static async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}

module.exports = User;