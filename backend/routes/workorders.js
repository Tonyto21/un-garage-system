const express = require('express');
const WorkOrder = require('../models/WorkOrder');
const WorkLog = require('../models/WorkLog');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get all work orders (Admin only)
router.get('/', auth, requireRole(['admin']), async (req, res) => {
    try {
        const workOrders = await WorkOrder.getAll();
        res.json(workOrders);
    } catch (error) {
        console.error('Get work orders error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get my work orders (Mechanic only)
router.get('/my', auth, requireRole(['mechanic']), async (req, res) => {
    try {
        const workOrders = await WorkOrder.getByMechanicId(req.user.id);
        res.json(workOrders);
    } catch (error) {
        console.error('Get my work orders error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create work order (Admin only)
router.post('/', auth, requireRole(['admin']), async (req, res) => {
    try {
        const { service_request_id, assigned_mechanic_id, instructions } = req.body;
        
        if (!service_request_id || !assigned_mechanic_id) {
            return res.status(400).json({ error: 'Service request ID and mechanic ID are required' });
        }

        const workOrder = await WorkOrder.create({
            service_request_id,
            assigned_mechanic_id,
            instructions
        });
        
        res.status(201).json(workOrder);
    } catch (error) {
        console.error('Create work order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update work order status
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }
        
        const workOrder = await WorkOrder.findById(id);
        
        if (!workOrder) {
            return res.status(404).json({ error: 'Work order not found' });
        }
        
        // Check permissions
        if (req.user.role === 'mechanic' && workOrder.assigned_mechanic_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only update your own work orders' });
        }
        
        const result = await WorkOrder.updateStatus(id, status);
        
        if (result.changes === 0) {
            return res.status(400).json({ error: 'Failed to update status' });
        }
        
        res.json({ message: 'Work order status updated successfully' });
    } catch (error) {
        console.error('Update work order status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add work log (Mechanic only)
router.post('/:id/logs', auth, requireRole(['mechanic']), async (req, res) => {
    try {
        const { id } = req.params;
        const { notes, hours_spent } = req.body;
        
        if (!notes) {
            return res.status(400).json({ error: 'Notes are required' });
        }
        
        const workOrder = await WorkOrder.findById(id);
        
        if (!workOrder) {
            return res.status(404).json({ error: 'Work order not found' });
        }
        
        if (workOrder.assigned_mechanic_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only add logs to your own work orders' });
        }
        
        const workLog = await WorkLog.create({
            work_order_id: id,
            notes,
            hours_spent: hours_spent || 0
        });
        
        res.status(201).json(workLog);
    } catch (error) {
        console.error('Add work log error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get work logs for a work order
router.get('/:id/logs', auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const workOrder = await WorkOrder.findById(id);
        
        if (!workOrder) {
            return res.status(404).json({ error: 'Work order not found' });
        }
        
        // Check permissions
        if (req.user.role === 'mechanic' && workOrder.assigned_mechanic_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only view logs for your own work orders' });
        }
        
        const logs = await WorkLog.getByWorkOrderId(id);
        res.json(logs);
    } catch (error) {
        console.error('Get work logs error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get work order statistics (Admin only)
router.get('/stats', auth, requireRole(['admin']), async (req, res) => {
    try {
        const stats = await WorkOrder.getStats();
        res.json(stats);
    } catch (error) {
        console.error('Get work order stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;