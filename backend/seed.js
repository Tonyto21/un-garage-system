require('dotenv').config();
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

async function seedDatabase() {
    console.log('🌱 Seeding database with demo data...');

    // Clear existing data
    await runQuery('DELETE FROM work_logs');
    await runQuery('DELETE FROM work_orders');
    await runQuery('DELETE FROM service_requests');
    await runQuery('DELETE FROM vehicles');
    await runQuery('DELETE FROM users');

    // Create demo users with the names you specified
    const users = [
        {
            name: 'Shem Namayi',
            email: 'shem.admin@un.org',
            password: await bcrypt.hash('admin123', 10),
            role: 'admin'
        },
        {
            name: 'James Hoff',
            email: 'james.requestor@un.org',
            password: await bcrypt.hash('requestor123', 10),
            role: 'requestor'
        },
        {
            name: 'Joseph Forkpah',
            email: 'joseph.focal@un.org',
            password: await bcrypt.hash('focal123', 10),
            role: 'requestor'
        },
        {
            name: 'Anthony Waweru',
            email: 'anthony.mechanic@un.org',
            password: await bcrypt.hash('mechanic123', 10),
            role: 'mechanic'
        }
    ];

    for (const user of users) {
        await runQuery(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [user.name, user.email, user.password, user.role]
        );
    }

    // Create demo vehicles
    const vehicles = [
        {
            number_plate: 'UN-001-AL',
            make: 'Toyota',
            model: 'Land Cruiser',
            year: 2022,
            current_mileage: 45000,
            status: 'active'
        },
        {
            number_plate: 'UN-002-AL',
            make: 'Toyota',
            model: 'Hilux',
            year: 2021,
            current_mileage: 65000,
            status: 'active'
        },
        {
            number_plate: 'UN-003-AL',
            make: 'Nissan',
            model: 'Patrol',
            year: 2023,
            current_mileage: 12000,
            status: 'active'
        },
        {
            number_plate: 'UN-004-AL',
            make: 'Mitsubishi',
            model: 'Pajero',
            year: 2020,
            current_mileage: 85000,
            status: 'under_service'
        }
    ];

    for (const vehicle of vehicles) {
        await runQuery(
            'INSERT INTO vehicles (number_plate, make, model, year, current_mileage, status) VALUES (?, ?, ?, ?, ?, ?)',
            [vehicle.number_plate, vehicle.make, vehicle.model, vehicle.year, vehicle.current_mileage, vehicle.status]
        );
    }

    // Create demo service requests
    const serviceRequests = [
        {
            requestor_id: 2, // James Hoff
            vehicle_id: 1,
            service_type: 'preventive',
            priority: 'scheduled',
            description: 'Routine 50,000km service - oil change, filter replacement, brake inspection',
            status: 'approved'
        },
        {
            requestor_id: 3, // Joseph Forkpah
            vehicle_id: 2,
            service_type: 'repair',
            priority: 'non_scheduled',
            description: 'Engine overheating issue, needs radiator inspection and possible replacement',
            status: 'submitted'
        },
        {
            requestor_id: 2, // James Hoff
            vehicle_id: 4,
            service_type: 'emergency',
            priority: 'emergency',
            description: 'Brake failure while on field mission - complete brake system inspection required',
            status: 'completed'
        },
        {
            requestor_id: 3, // Joseph Forkpah
            vehicle_id: 3,
            service_type: 'inspection',
            priority: 'scheduled',
            description: 'Annual safety inspection as per UN vehicle policy',
            status: 'approved'
        }
    ];

    for (const request of serviceRequests) {
        await runQuery(
            `INSERT INTO service_requests (requestor_id, vehicle_id, service_type, priority, description, status, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, datetime('now', ?))`,
            [
                request.requestor_id,
                request.vehicle_id,
                request.service_type,
                request.priority,
                request.description,
                request.status,
                `-${Math.floor(Math.random() * 30)} days`
            ]
        );
    }

    // Create demo work orders
    const workOrders = [
        {
            service_request_id: 1,
            assigned_mechanic_id: 4, // Anthony Waweru
            instructions: 'Complete full 50,000km service package. Check all fluid levels and tire pressure.',
            status: 'in_progress',
            started_at: "datetime('now', '-2 days')"
        },
        {
            service_request_id: 3,
            assigned_mechanic_id: 4, // Anthony Waweru
            instructions: 'Emergency brake system repair. Priority 1 - vehicle must be ready within 24 hours.',
            status: 'closed',
            started_at: "datetime('now', '-5 days')",
            completed_at: "datetime('now', '-4 days')"
        },
        {
            service_request_id: 4,
            assigned_mechanic_id: 4, // Anthony Waweru
            instructions: 'Annual safety inspection - full checklist required including lights, brakes, tires, seatbelts.',
            status: 'pending'
        }
    ];

    for (const order of workOrders) {
        await runQuery(
            `INSERT INTO work_orders (service_request_id, assigned_mechanic_id, instructions, status, started_at, completed_at, created_at) 
             VALUES (?, ?, ?, ?, ${order.started_at || 'NULL'}, ${order.completed_at || 'NULL'}, datetime('now', ?))`,
            [
                order.service_request_id,
                order.assigned_mechanic_id,
                order.instructions,
                order.status,
                `-${Math.floor(Math.random() * 10)} days`
            ]
        );
    }

    // Create demo work logs
    const workLogs = [
        {
            work_order_id: 2,
            notes: 'Diagnosed brake system - found leaking master cylinder. Ordered replacement parts.',
            hours_spent: 2.5
        },
        {
            work_order_id: 2,
            notes: 'Replaced master cylinder and bled brake lines. Test drive successful - brakes working normally.',
            hours_spent: 3.0
        },
        {
            work_order_id: 1,
            notes: 'Completed oil change and filter replacement. Tire rotation done.',
            hours_spent: 1.5
        }
    ];

    for (const log of workLogs) {
        await runQuery(
            `INSERT INTO work_logs (work_order_id, notes, hours_spent, created_at) 
             VALUES (?, ?, ?, datetime('now', ?))`,
            [
                log.work_order_id,
                log.notes,
                log.hours_spent,
                `-${Math.floor(Math.random() * 5)} days`
            ]
        );
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Demo Users:');
    console.log('Admin: shem.admin@un.org / admin123');
    console.log('Requestor: james.requestor@un.org / requestor123');
    console.log('Requestor: joseph.focal@un.org / focal123');
    console.log('Mechanic: anthony.mechanic@un.org / mechanic123');
    console.log('\n🚗 Demo vehicles created');
    console.log('📝 Demo service requests created');
    console.log('🔧 Demo work orders created');

    db.close();
}

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

// Run seeding
seedDatabase().catch(console.error);