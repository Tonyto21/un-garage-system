const express = require('express');
const Vehicle = require('../models/Vehicle');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get all vehicles
router.get('/', auth, async (req, res) => {
    try {
        const vehicles = await Vehicle.getAll();
        res.json(vehicles);
    } catch (error) {
        console.error('Get vehicles error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create vehicle (Admin only)
router.post('/', auth, requireRole(['admin']), async (req, res) => {
    try {
        const { number_plate, make, model, year, current_mileage, status } = req.body;
        
        if (!number_plate || !make || !model) {
            return res.status(400).json({ error: 'Number plate, make and model are required' });
        }

        const vehicle = await Vehicle.create({
            number_plate,
            make,
            model,
            year: year || null,
            current_mileage: current_mileage || 0,
            status: status || 'active'
        });
        
        res.status(201).json(vehicle);
    } catch (error) {
        console.error('Create vehicle error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update vehicle (Admin only)
router.put('/:id', auth, requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const result = await Vehicle.update(id, updates);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        res.json({ message: 'Vehicle updated successfully' });
    } catch (error) {
        console.error('Update vehicle error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete vehicle (Admin only)
router.delete('/:id', auth, requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await Vehicle.delete(id);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Delete vehicle error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get vehicles under service
router.get('/under-service', auth, async (req, res) => {
    try {
        const vehicles = await Vehicle.getVehiclesUnderService();
        res.json(vehicles);
    } catch (error) {
        console.error('Get under service vehicles error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;