# UN Garage Management System

An Anthony Waweru creation of garage management system for One UN House Liberia.

## Features
- Role-based dashboards (Admin, Requestor, Mechanic)
- End-to-end workflow: Service Request → Approval → Work Order → Execution → Completion
- Real database persistence with SQLite
- Authentication & authorization
- Demo-ready with pre-seeded data

## Demo Users
- **Admin**: shem.admin@un.org / admin123
- **Requestor**: james.requestor@un.org / requestor123  
- **Requestor**: joseph.focal@un.org / focal123
- **Mechanic**: anthony.mechanic@un.org / mechanic123

## Tech Stack
- **Backend**: Node.js, Express, SQLite
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite (local file)

## Setup Instructions

### 1. Install Node.js
Download from https://nodejs.org

### 2. Run the system
```bash
cd backend
npm install
node seed.js
node server.js

# In another terminal:
cd frontend
python -m http.server 8000