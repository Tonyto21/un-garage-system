#!/bin/bash

echo "🔍 Verifying and fixing UN Garage System updates..."

# Check 1: Database schema update for agency field
echo "1. Checking database schema for agency field..."
if grep -q "agency TEXT DEFAULT 'UN House Liberia'" backend/models/index.js; then
    echo "   ✅ Agency field exists in users table"
else
    echo "   ❌ Agency field missing. Fixing..."
    sed -i "s/role TEXT CHECK(role IN ('admin', 'requestor', 'mechanic')) NOT NULL,/role TEXT CHECK(role IN ('admin', 'requestor', 'mechanic')) NOT NULL,\n        agency TEXT DEFAULT 'UN House Liberia',/" backend/models/index.js
fi

# Check 2: User model updates
echo "2. Checking User model updates..."
if grep -q "agency TEXT DEFAULT 'UN House Liberia'" backend/models/User.js; then
    echo "   ✅ User model includes agency in INSERT"
else
    echo "   ❌ User model missing agency. Fixing CREATE method..."
    # Fix the CREATE method
    sed -i "s/const { name, email, password, role } = user;/const { name, email, password, role, agency } = user;/" backend/models/User.js
    sed -i "s/INSERT INTO users (name, email, password_hash, role) VALUES/INSERT INTO users (name, email, password_hash, role, agency) VALUES/" backend/models/User.js
    sed -i "s/\[name, email, passwordHash, role\]/\[name, email, passwordHash, role, agency || 'UN House Liberia'\]/" backend/models/User.js
fi

# Check 3: Seed file agencies
echo "3. Checking seed file agencies..."
if grep -q "'UNDP Liberia'" backend/seed.js; then
    echo "   ✅ Seed file has agency data"
else
    echo "   ❌ Seed file missing agency data. Please check manually."
fi

# Check 4: ServiceRequest model agency joins
echo "4. Checking ServiceRequest model agency joins..."
if grep -q "u.agency" backend/models/ServiceRequest.js; then
    echo "   ✅ ServiceRequest includes agency in queries"
else
    echo "   ❌ ServiceRequest missing agency. Fixing..."
    # Fix getAll method
    sed -i "s/u.name as requestor_name,/u.name as requestor_name, u.agency,/" backend/models/ServiceRequest.js
fi

# Check 5: Frontend agency display
echo "5. Checking frontend agency display..."
if grep -q "request.agency" frontend/app.js; then
    echo "   ✅ Frontend displays agency"
else
    echo "   ❌ Frontend missing agency display. Will need manual update."
fi

echo ""
echo "📊 Verification complete!"
echo "If any fixes were needed, they've been applied."
echo ""
echo "Next steps:"
echo "1. Re-seed the database: cd backend && node seed.js"
echo "2. Restart the server"
echo "3. Test the application"
