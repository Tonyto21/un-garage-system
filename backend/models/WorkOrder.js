const db = require('./index');

class WorkOrder {
    static async create(workOrder) {
        const { service_request_id, assigned_mechanic_id, instructions } = workOrder;
        
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO work_orders (service_request_id, assigned_mechanic_id, instructions) VALUES (?, ?, ?)`,
                [service_request_id, assigned_mechanic_id, instructions || ''],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...workOrder, status: 'pending' });
                }
            );
        });
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT wo.*, 
                       u.name as mechanic_name,
                       sr.description as request_description,
                       sr.priority,
                       v.number_plate
                FROM work_orders wo
                JOIN users u ON wo.assigned_mechanic_id = u.id
                JOIN service_requests sr ON wo.service_request_id = sr.id
                JOIN vehicles v ON sr.vehicle_id = v.id
                ORDER BY wo.created_at DESC
            `, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getByMechanicId(mechanicId) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT wo.*, 
                       sr.description as request_description,
                       sr.priority,
                       v.number_plate,
                       v.make,
                       v.model
                FROM work_orders wo
                JOIN service_requests sr ON wo.service_request_id = sr.id
                JOIN vehicles v ON sr.vehicle_id = v.id
                WHERE wo.assigned_mechanic_id = ?
                ORDER BY 
                    CASE wo.status 
                        WHEN 'pending' THEN 1
                        WHEN 'in_progress' THEN 2
                        WHEN 'completed' THEN 3
                        WHEN 'closed' THEN 4
                    END,
                    wo.created_at DESC
            `, [mechanicId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT wo.*, 
                       u.name as mechanic_name,
                       sr.description as request_description,
                       sr.priority,
                       sr.requestor_id,
                       v.number_plate,
                       v.make,
                       v.model
                FROM work_orders wo
                JOIN users u ON wo.assigned_mechanic_id = u.id
                JOIN service_requests sr ON wo.service_request_id = sr.id
                JOIN vehicles v ON sr.vehicle_id = v.id
                WHERE wo.id = ?
            `, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static async updateStatus(id, status) {
        const updates = { status };
        
        if (status === 'in_progress') {
            updates.started_at = new Date().toISOString();
        } else if (status === 'completed' || status === 'closed') {
            updates.completed_at = new Date().toISOString();
        }
        
        const fields = ['status = ?'];
        const values = [status];
        
        if (updates.started_at) {
            fields.push('started_at = ?');
            values.push(updates.started_at);
        }
        if (updates.completed_at) {
            fields.push('completed_at = ?');
            values.push(updates.completed_at);
        }
        
        values.push(id);
        
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE work_orders SET ${fields.join(', ')} WHERE id = ?`,
                values,
                function(err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                }
            );
        });
    }

    static async getStats() {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                    SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed
                FROM work_orders
            `, [], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
}

module.exports = WorkOrder;