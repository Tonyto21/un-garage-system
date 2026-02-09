const express = require('express');
const Stats = require('../models/Stats');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get dashboard statistics (Admin only)
router.get('/dashboard', auth, requireRole(['admin']), async (req, res) => {
    try {
        const stats = await Stats.getDashboardStats();
        res.json(stats);
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get monthly request trend (Admin only)
router.get('/monthly-trend', auth, requireRole(['admin']), async (req, res) => {
    try {
        const trend = await Stats.getMonthlyRequestTrend();
        res.json(trend);
    } catch (error) {
        console.error('Get monthly trend error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get mechanic performance (Admin only)
router.get('/mechanic-performance', auth, requireRole(['admin']), async (req, res) => {
    try {
        const performance = await Stats.getMechanicPerformance();
        res.json(performance);
    } catch (error) {
        console.error('Get mechanic performance error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get vehicle type statistics (Admin only)
router.get('/vehicle-types', auth, requireRole(['admin']), async (req, res) => {
    try {
        const stats = await Stats.getVehicleTypeStats();
        res.json(stats);
    } catch (error) {
        console.error('Get vehicle type stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
