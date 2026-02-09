const express = require('express');
const ServiceRequest = require('../models/ServiceRequest');
const WorkOrder = require('../models/WorkOrder');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get all service requests (Admin only)
router.get('/', auth, requireRole(['admin']), async (req, res) => {
    try {
        const requests = await ServiceRequest.getAll();
        res.json(requests);
    } catch (error) {
        console.error('Get requests error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get my service requests (Requestor only)
router.get('/my', auth, requireRole(['requestor']), async (req, res) => {
    try {
        const requests = await ServiceRequest.getByRequestorId(req.user.id);
        res.json(requests);
    } catch (error) {
        console.error('Get my requests error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create service request (Requestor only)
router.post('/', auth, requireRole(['requestor']), async (req, res) => {
    try {
        const { vehicle_id, service_type, priority, description, photo_url } = req.body;
        
        if (!vehicle_id || !service_type || !priority || !description) {
            return res.status(400).json({ error: 'All fields except photo are required' });
        }

        const request = await ServiceRequest.create({
            requestor_id: req.user.id,
            vehicle_id,
            service_type,
            priority,
            description,
            photo_url
        });
        
        res.status(201).json(request);
    } catch (error) {
        console.error('Create request error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Approve service request (Admin only)
router.put('/:id/approve', auth, requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await ServiceRequest.updateStatus(id, 'approved');
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }
        
        res.json({ message: 'Request approved successfully' });
    } catch (error) {
        console.error('Approve request error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reject service request (Admin only)
router.put('/:id/reject', auth, requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await ServiceRequest.updateStatus(id, 'rejected');
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }
        
        res.json({ message: 'Request rejected successfully' });
    } catch (error) {
        console.error('Reject request error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get request statistics (Admin only)
router.get('/stats', auth, requireRole(['admin']), async (req, res) => {
    try {
        const stats = await ServiceRequest.getStats();
        res.json(stats);
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;