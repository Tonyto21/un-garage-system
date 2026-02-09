const express = require('express');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get all users (Admin only)
router.get('/', auth, requireRole(['admin']), async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create user (Admin only)
router.post('/', auth, requireRole(['admin']), async (req, res) => {
    try {
        const { name, email, password, role, agency } = req.body;
        
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'Name, email, password and role are required' });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = await User.create({ name, email, password, role, agency });
        res.status(201).json(user);
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user (Admin only)
router.put('/:id', auth, requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Don't allow password updates via this route
        delete updates.password;
        delete updates.password_hash;
        
        const result = await User.update(id, updates);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user (Admin only)
router.delete('/:id', auth, requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        
        // Don't allow self-deletion
        if (req.user.id === parseInt(id)) {
            return res.status(400).json({ error: 'Cannot delete yourself' });
        }
        
        const result = await User.delete(id);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;