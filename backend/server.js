require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const vehicleRoutes = require('./routes/vehicles');
const requestRoutes = require('./routes/requests');
const workOrderRoutes = require('./routes/workorders');

// Import database models to initialize them
require('./models/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/requests', requestRoutes);
app.use('/work-orders', workOrderRoutes);

// Stats routes
const statsRoutes = require('./routes/stats');
app.use('/stats', statsRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'UN Garage Management System API',
        version: '1.0.0',
        endpoints: {
            auth: '/auth/login, /auth/logout, /auth/me',
            users: '/users (admin only)',
            vehicles: '/vehicles',
            requests: '/requests, /requests/my (requestor only)',
            workOrders: '/work-orders, /work-orders/my (mechanic only)'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API documentation available at http://localhost:${PORT}/`);
});