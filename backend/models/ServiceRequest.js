const db = require('./index');

class ServiceRequest {
    static async create(request) {
        const { requestor_id, vehicle_id, service_type, priority, description, photo_url } = request;
        
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO service_requests (requestor_id, vehicle_id, service_type, priority, description, photo_url) VALUES (?, ?, ?, ?, ?, ?)`,
                [requestor_id, vehicle_id, service_type, priority, description, photo_url || null],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...request, status: 'submitted' });
                }
            );
        });
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT sr.*, u.name as requestor_name, v.number_plate, v.make, v.model 
                FROM service_requests sr
                JOIN users u ON sr.requestor_id = u.id
                JOIN vehicles v ON sr.vehicle_id = v.id
                ORDER BY sr.created_at DESC
            `, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getByRequestorId(requestorId) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT sr.*, v.number_plate, v.make, v.model 
                FROM service_requests sr
                JOIN vehicles v ON sr.vehicle_id = v.id
                WHERE sr.requestor_id = ?
                ORDER BY sr.created_at DESC
            `, [requestorId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT sr.*, u.name as requestor_name, v.number_plate, v.make, v.model 
                FROM service_requests sr
                JOIN users u ON sr.requestor_id = u.id
                JOIN vehicles v ON sr.vehicle_id = v.id
                WHERE sr.id = ?
            `, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static async updateStatus(id, status) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE service_requests SET status = ? WHERE id = ?`,
                [status, id],
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
                    SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted,
                    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
                FROM service_requests
            `, [], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
}

module.exports = ServiceRequest;