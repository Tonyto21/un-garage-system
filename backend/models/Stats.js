const db = require('./index');

class Stats {
    static async getDashboardStats() {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    (SELECT COUNT(*) FROM service_requests) as total_requests,
                    (SELECT COUNT(*) FROM service_requests WHERE status = 'submitted') as pending_requests,
                    (SELECT COUNT(*) FROM service_requests WHERE status = 'approved') as approved_requests,
                    (SELECT COUNT(*) FROM service_requests WHERE status = 'completed') as completed_requests,
                    (SELECT COUNT(*) FROM work_orders WHERE status = 'in_progress') as active_work_orders,
                    (SELECT COUNT(*) FROM vehicles WHERE status = 'under_service') as vehicles_in_service,
                    (SELECT COUNT(DISTINCT assigned_mechanic_id) FROM work_orders WHERE status IN ('pending', 'in_progress')) as active_mechanics,
                    (SELECT AVG(julianday(completed_at) - julianday(created_at)) FROM work_orders WHERE completed_at IS NOT NULL) as avg_completion_days,
                    (SELECT COUNT(*) FROM vehicles) as total_vehicles,
                    (SELECT COUNT(*) FROM users WHERE role = 'requestor') as total_requestors
            `, [], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static async getMonthlyRequestTrend() {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    strftime('%Y-%m', created_at) as month,
                    COUNT(*) as count,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
                FROM service_requests
                WHERE created_at >= date('now', '-6 months')
                GROUP BY strftime('%Y-%m', created_at)
                ORDER BY month
            `, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getMechanicPerformance() {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    u.name as mechanic_name,
                    COUNT(wo.id) as total_jobs,
                    SUM(CASE WHEN wo.status = 'completed' THEN 1 ELSE 0 END) as completed_jobs,
                    SUM(CASE WHEN wo.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_jobs,
                    AVG(wl.hours_spent) as avg_hours_per_job
                FROM users u
                LEFT JOIN work_orders wo ON u.id = wo.assigned_mechanic_id
                LEFT JOIN work_logs wl ON wo.id = wl.work_order_id
                WHERE u.role = 'mechanic'
                GROUP BY u.id
                ORDER BY total_jobs DESC
            `, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getVehicleTypeStats() {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    make,
                    COUNT(*) as count,
                    SUM(CASE WHEN status = 'under_service' THEN 1 ELSE 0 END) as under_service,
                    AVG(current_mileage) as avg_mileage
                FROM vehicles
                GROUP BY make
                ORDER BY count DESC
            `, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

module.exports = Stats;
