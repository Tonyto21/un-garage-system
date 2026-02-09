const db = require('./index');

class WorkLog {
    static async create(log) {
        const { work_order_id, notes, hours_spent } = log;
        
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO work_logs (work_order_id, notes, hours_spent) VALUES (?, ?, ?)`,
                [work_order_id, notes, hours_spent || 0],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...log });
                }
            );
        });
    }

    static async getByWorkOrderId(workOrderId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM work_logs WHERE work_order_id = ? ORDER BY created_at DESC`,
                [workOrderId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }
}

module.exports = WorkLog;