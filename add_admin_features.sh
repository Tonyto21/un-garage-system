#!/bin/bash

echo "🚀 Adding Admin Features to UN Garage System..."

# 1. Create Create User Modal HTML/JS
echo "1. Adding Create User functionality..."
cat > frontend/templates/create-user-modal.html << 'TEMPLATEEOF'
<div id="create-user-modal-content">
    <h3 style="margin-bottom: 20px; color: #333;">Create New User</h3>
    <form id="create-user-form">
        <div class="form-row">
            <div class="form-group">
                <label for="new-user-name"><i class="fas fa-user"></i> Full Name *</label>
                <input type="text" id="new-user-name" placeholder="John Doe" required>
            </div>
            <div class="form-group">
                <label for="new-user-email"><i class="fas fa-envelope"></i> Email *</label>
                <input type="email" id="new-user-email" placeholder="john.doe@un.org" required>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="new-user-password"><i class="fas fa-lock"></i> Password *</label>
                <input type="password" id="new-user-password" placeholder="Minimum 6 characters" required>
            </div>
            <div class="form-group">
                <label for="new-user-role"><i class="fas fa-user-tag"></i> Role *</label>
                <select id="new-user-role" required>
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="requestor">Requestor</option>
                    <option value="mechanic">Mechanic</option>
                </select>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="new-user-agency"><i class="fas fa-building"></i> Agency</label>
                <select id="new-user-agency">
                    <option value="UN House Liberia">UN House Liberia</option>
                    <option value="UNDP Liberia">UNDP Liberia</option>
                    <option value="UNICEF Liberia">UNICEF Liberia</option>
                    <option value="WFP Liberia">WFP Liberia</option>
                    <option value="WHO Liberia">WHO Liberia</option>
                    <option value="FAO Liberia">FAO Liberia</option>
                    <option value="UNHCR Liberia">UNHCR Liberia</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="new-user-agency-other"><i class="fas fa-building"></i> Other Agency</label>
                <input type="text" id="new-user-agency-other" placeholder="Enter agency name" style="display: none;">
            </div>
        </div>
        
        <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="app.hideModal()">
                <i class="fas fa-times"></i> Cancel
            </button>
            <button type="submit" class="btn-primary">
                <i class="fas fa-user-plus"></i> Create User
            </button>
        </div>
    </form>
</div>
TEMPLATEEOF

# 2. Create Create Vehicle Modal HTML
echo "2. Adding Create Vehicle functionality..."
cat > frontend/templates/create-vehicle-modal.html << 'TEMPLATEEOF'
<div id="create-vehicle-modal-content">
    <h3 style="margin-bottom: 20px; color: #333;">Add New Vehicle</h3>
    <form id="create-vehicle-form">
        <div class="form-row">
            <div class="form-group">
                <label for="new-vehicle-plate"><i class="fas fa-car"></i> Plate Number *</label>
                <input type="text" id="new-vehicle-plate" placeholder="UN-XXX-AL" required style="text-transform: uppercase;">
            </div>
            <div class="form-group">
                <label for="new-vehicle-make"><i class="fas fa-industry"></i> Make *</label>
                <select id="new-vehicle-make" required>
                    <option value="">Select Make</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Mitsubishi">Mitsubishi</option>
                    <option value="Ford">Ford</option>
                    <option value="Land Rover">Land Rover</option>
                    <option value="Isuzu">Isuzu</option>
                    <option value="Other">Other</option>
                </select>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="new-vehicle-model"><i class="fas fa-car-side"></i> Model *</label>
                <input type="text" id="new-vehicle-model" placeholder="Land Cruiser, Hilux, etc." required>
            </div>
            <div class="form-group">
                <label for="new-vehicle-year"><i class="fas fa-calendar-alt"></i> Year</label>
                <input type="number" id="new-vehicle-year" placeholder="2023" min="2000" max="2026">
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="new-vehicle-mileage"><i class="fas fa-tachometer-alt"></i> Current Mileage (km)</label>
                <input type="number" id="new-vehicle-mileage" placeholder="0" min="0">
            </div>
            <div class="form-group">
                <label for="new-vehicle-status"><i class="fas fa-info-circle"></i> Status</label>
                <select id="new-vehicle-status">
                    <option value="active">Active</option>
                    <option value="under_service">Under Service</option>
                </select>
            </div>
        </div>
        
        <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="app.hideModal()">
                <i class="fas fa-times"></i> Cancel
            </button>
            <button type="submit" class="btn-primary">
                <i class="fas fa-plus"></i> Add Vehicle
            </button>
        </div>
    </form>
</div>
TEMPLATEEOF

# 3. Create Create Work Order Modal HTML
echo "3. Adding Create Work Order functionality..."
cat > frontend/templates/create-workorder-modal.html << 'TEMPLATEEOF'
<div id="create-workorder-modal-content">
    <h3 style="margin-bottom: 20px; color: #333;">Create Work Order</h3>
    <form id="create-workorder-form">
        <div class="form-row">
            <div class="form-group">
                <label for="workorder-request"><i class="fas fa-clipboard-list"></i> Service Request *</label>
                <select id="workorder-request" required>
                    <option value="">Select Approved Request</option>
                </select>
            </div>
            <div class="form-group">
                <label for="workorder-mechanic"><i class="fas fa-user-cog"></i> Assign Mechanic *</label>
                <select id="workorder-mechanic" required>
                    <option value="">Select Mechanic</option>
                </select>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group form-full">
                <label for="workorder-instructions"><i class="fas fa-file-alt"></i> Instructions</label>
                <textarea id="workorder-instructions" rows="4" placeholder="Special instructions for the mechanic..."></textarea>
            </div>
        </div>
        
        <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="app.hideModal()">
                <i class="fas fa-times"></i> Cancel
            </button>
            <button type="submit" class="btn-primary">
                <i class="fas fa-tools"></i> Create Work Order
            </button>
        </div>
    </form>
</div>
TEMPLATEEOF

# 4. Update app.js with admin functions
echo "4. Updating app.js with admin functions..."
# Backup original app.js
cp frontend/app.js frontend/app.js.backup

# Add the new functions to app.js
cat >> frontend/app.js << 'JSEOF'

// Admin Functions
UNGarageApp.prototype.showCreateUserModal = async function() {
    const content = await this.loadTemplate('create-user-modal.html');
    this.showModal('Create New User', content);
    
    // Setup form submission
    document.getElementById('create-user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.createUser();
    });
    
    // Agency other field toggle
    document.getElementById('new-user-agency').addEventListener('change', function() {
        const otherField = document.getElementById('new-user-agency-other');
        otherField.style.display = this.value === 'Other' ? 'block' : 'none';
        if (this.value !== 'Other') otherField.required = false;
    });
};

UNGarageApp.prototype.showCreateVehicleModal = async function() {
    const content = await this.loadTemplate('create-vehicle-modal.html');
    this.showModal('Add New Vehicle', content);
    
    document.getElementById('create-vehicle-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.createVehicle();
    });
    
    // Vehicle make other field
    document.getElementById('new-vehicle-make').addEventListener('change', function() {
        const modelField = document.getElementById('new-vehicle-model');
        if (this.value === 'Other') {
            modelField.placeholder = 'Enter vehicle make and model';
        } else {
            modelField.placeholder = 'Land Cruiser, Hilux, etc.';
        }
    });
};

UNGarageApp.prototype.showCreateWorkOrderModal = async function() {
    const content = await this.loadTemplate('create-workorder-modal.html');
    this.showModal('Create Work Order', content);
    
    // Load approved requests and mechanics
    await this.loadWorkOrderFormData();
    
    document.getElementById('create-workorder-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.createWorkOrder();
    });
};

UNGarageApp.prototype.loadTemplate = async function(templateName) {
    try {
        const response = await fetch(`templates/${templateName}`);
        if (!response.ok) throw new Error('Template not found');
        return await response.text();
    } catch (error) {
        console.error('Error loading template:', error);
        return '<p>Error loading form. Please refresh the page.</p>';
    }
};

UNGarageApp.prototype.loadWorkOrderFormData = async function() {
    try {
        // Load approved requests
        const requests = await this.apiRequest('/requests');
        const approvedRequests = requests?.filter(r => r.status === 'approved' && !r.work_order_exists) || [];
        
        const requestSelect = document.getElementById('workorder-request');
        requestSelect.innerHTML = '<option value="">Select Approved Request</option>';
        approvedRequests.forEach(request => {
            const option = document.createElement('option');
            option.value = request.id;
            option.textContent = `#${request.id} - ${request.number_plate} - ${request.service_type} (${request.requestor_name})`;
            requestSelect.appendChild(option);
        });
        
        // Load mechanics
        const users = await this.apiRequest('/users');
        const mechanics = users?.filter(u => u.role === 'mechanic') || [];
        
        const mechanicSelect = document.getElementById('workorder-mechanic');
        mechanicSelect.innerHTML = '<option value="">Select Mechanic</option>';
        mechanics.forEach(mechanic => {
            const option = document.createElement('option');
            option.value = mechanic.id;
            option.textContent = `${mechanic.name} (${mechanic.agency})`;
            mechanicSelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error loading work order form data:', error);
    }
};

UNGarageApp.prototype.createUser = async function() {
    const name = document.getElementById('new-user-name').value;
    const email = document.getElementById('new-user-email').value;
    const password = document.getElementById('new-user-password').value;
    const role = document.getElementById('new-user-role').value;
    let agency = document.getElementById('new-user-agency').value;
    
    if (agency === 'Other') {
        agency = document.getElementById('new-user-agency-other').value || 'UN House Liberia';
    }
    
    if (!name || !email || !password || !role) {
        alert('Please fill all required fields');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    const result = await this.apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, agency })
    });
    
    if (result) {
        alert('User created successfully!');
        this.hideModal();
        this.loadUsers(); // Refresh users table
    }
};

UNGarageApp.prototype.createVehicle = async function() {
    const number_plate = document.getElementById('new-vehicle-plate').value.toUpperCase();
    let make = document.getElementById('new-vehicle-make').value;
    const model = document.getElementById('new-vehicle-model').value;
    const year = document.getElementById('new-vehicle-year').value;
    const current_mileage = document.getElementById('new-vehicle-mileage').value || 0;
    const status = document.getElementById('new-vehicle-status').value;
    
    if (make === 'Other') {
        make = document.getElementById('new-vehicle-model').value.split(' ')[0] || 'Unknown';
    }
    
    if (!number_plate || !make || !model) {
        alert('Please fill all required fields');
        return;
    }
    
    const result = await this.apiRequest('/vehicles', {
        method: 'POST',
        body: JSON.stringify({
            number_plate,
            make,
            model,
            year: year || null,
            current_mileage: parseInt(current_mileage) || 0,
            status
        })
    });
    
    if (result) {
        alert('Vehicle added successfully!');
        this.hideModal();
        this.loadVehicles(); // Refresh vehicles table
    }
};

UNGarageApp.prototype.createWorkOrder = async function() {
    const service_request_id = document.getElementById('workorder-request').value;
    const assigned_mechanic_id = document.getElementById('workorder-mechanic').value;
    const instructions = document.getElementById('workorder-instructions').value;
    
    if (!service_request_id || !assigned_mechanic_id) {
        alert('Please select both a service request and a mechanic');
        return;
    }
    
    const result = await this.apiRequest('/work-orders', {
        method: 'POST',
        body: JSON.stringify({
            service_request_id,
            assigned_mechanic_id,
            instructions: instructions || ''
        })
    });
    
    if (result) {
        alert('Work order created successfully!');
        this.hideModal();
        this.loadWorkOrders(); // Refresh work orders table
    }
};

UNGarageApp.prototype.deleteUser = async function(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        const result = await this.apiRequest(`/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (result) {
            alert('User deleted successfully!');
            this.loadUsers(); // Refresh users table
        }
    }
};

UNGarageApp.prototype.showVehicleDetails = async function(vehicleId) {
    const vehicle = await this.apiRequest(`/vehicles/${vehicleId}`);
    
    if (vehicle) {
        const content = `
            <div style="display: grid; gap: 15px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <h4 style="margin-bottom: 10px; color: #333;">Vehicle Information</h4>
                        <p><strong>Plate Number:</strong> ${vehicle.number_plate}</p>
                        <p><strong>Make:</strong> ${vehicle.make}</p>
                        <p><strong>Model:</strong> ${vehicle.model}</p>
                        <p><strong>Year:</strong> ${vehicle.year || 'Not specified'}</p>
                    </div>
                    <div>
                        <h4 style="margin-bottom: 10px; color: #333;">Status & Mileage</h4>
                        <p><strong>Current Mileage:</strong> ${vehicle.current_mileage?.toLocaleString() || '0'} km</p>
                        <p><strong>Status:</strong> <span class="badge ${vehicle.status.replace('_', '-')}">${vehicle.status.replace('_', ' ')}</span></p>
                        <p><strong>Added:</strong> ${new Date(vehicle.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                
                ${this.currentUser.role === 'admin' ? `
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                        <h4 style="margin-bottom: 10px; color: #333;">Admin Actions</h4>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn-secondary" onclick="app.updateVehicleStatus(${vehicleId}, '${vehicle.status === 'active' ? 'under_service' : 'active'}')">
                                <i class="fas fa-sync-alt"></i> Set as ${vehicle.status === 'active' ? 'Under Service' : 'Active'}
                            </button>
                            <button class="btn-secondary" style="background: #ffeaea; color: #dc3545;" onclick="app.deleteVehicle(${vehicleId})">
                                <i class="fas fa-trash"></i> Delete Vehicle
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        this.showModal(`Vehicle: ${vehicle.number_plate}`, content);
    }
};

UNGarageApp.prototype.updateVehicleStatus = async function(vehicleId, newStatus) {
    const result = await this.apiRequest(`/vehicles/${vehicleId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
    });
    
    if (result) {
        alert(`Vehicle status updated to ${newStatus.replace('_', ' ')}`);
        this.hideModal();
        this.loadVehicles();
    }
};

UNGarageApp.prototype.deleteVehicle = async function(vehicleId) {
    if (confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
        const result = await this.apiRequest(`/vehicles/${vehicleId}`, {
            method: 'DELETE'
        });
        
        if (result) {
            alert('Vehicle deleted successfully!');
            this.hideModal();
            this.loadVehicles();
        }
    }
};
JSEOF

# 5. Update the users page to have Create User button
echo "5. Updating users page button..."
sed -i "s/<button class=\"btn-primary\" onclick=\"app.showCreateUserModal()\">/<button class=\"btn-primary\" onclick=\"app.showCreateUserModal()\">/" frontend/app.js 2>/dev/null || echo "Button update may need manual check"

# 6. Create templates directory
mkdir -p frontend/templates

# Move templates to directory
mv frontend/templates/create-user-modal.html frontend/templates/ 2>/dev/null || true
mv frontend/templates/create-vehicle-modal.html frontend/templates/ 2>/dev/null || true
mv frontend/templates/create-workorder-modal.html frontend/templates/ 2>/dev/null || true

echo ""
echo "✅ Admin features added successfully!"
echo ""
echo "Next steps:"
echo "1. Restart the frontend server"
echo "2. Login as admin"
echo "3. Check Users page for 'Add User' button"
echo "4. Check Vehicles page for 'Add Vehicle' button"
echo "5. Check Work Orders page for 'New Work Order' button"
