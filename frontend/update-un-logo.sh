#!/bin/bash

# Backup original files
cp index.html index.html.backup
cp style.css style.css.backup

# Update index.html to use actual UN logo
sed -i 's|<div class="un-logo-real">.*</div>|<div class="un-logo-real">\n                    <img src="images/un-logo.png" alt="UN Logo" class="un-logo-image">\n                    <div class="un-logo-text">\n                        <h1>UN GARAGE</h1>\n                        <h2>MANAGEMENT SYSTEM</h2>\n                    </div>\n                </div>|g' index.html

sed -i 's|<div class="un-logo-small">.*</div>|<div class="un-logo-small">\n                        <img src="images/un-logo.png" alt="UN Logo" style="width: 30px; height: 30px;">\n                    </div>|g' index.html

# Update CSS for UN logo image
cat >> style.css << 'CSSEOF'

/* UN Logo Image Styling */
.un-logo-image {
    width: 80px;
    height: 80px;
    object-fit: contain;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.un-logo-real {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 25px;
    text-align: center;
}

.un-logo-text h1 {
    color: #2c6cc4;
    font-size: 28px;
    font-weight: 700;
    margin-top: 15px;
    margin-bottom: 5px;
    letter-spacing: 1px;
}

.un-logo-text h2 {
    color: #5b92e5;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
}

.login-subtitle {
    color: #666;
    font-size: 14px;
    background: #f8f9fa;
    padding: 8px 15px;
    border-radius: 20px;
    display: inline-block;
    margin-top: 10px;
}

/* Sidebar logo */
.sidebar-header .un-logo-small img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: contain;
    background: white;
    padding: 5px;
    border: 2px solid #5b92e5;
}

.sidebar-header h3 {
    color: #2c6cc4;
    font-size: 18px;
    margin-top: 10px;
    margin-bottom: 5px;
}

/* Page header UN style */
.content-header h1 {
    color: #2c6cc4;
    position: relative;
    padding-left: 15px;
}

.content-header h1::before {
    content: "";
    position: absolute;
    left: 0;
    top: 5px;
    bottom: 5px;
    width: 4px;
    background: linear-gradient(to bottom, #2c6cc4, #5b92e5);
    border-radius: 2px;
}

/* Enhanced UN footer */
.login-footer {
    background: linear-gradient(135deg, #1a4a8c 0%, #2c6cc4 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    margin-top: 30px;
    text-align: center;
    font-size: 13px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.login-footer p {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

/* UN Blue theme enhancements */
.card {
    border-left: 4px solid #5b92e5;
}

.card:hover {
    border-left-color: #2c6cc4;
}

.table-container {
    border-top: 3px solid #5b92e5;
}

/* Role badges with UN colors */
.badge.admin {
    background: linear-gradient(135deg, #2c6cc4 0%, #1a4a8c 100%);
    color: white;
}

.badge.requestor {
    background: linear-gradient(135deg, #5b92e5 0%, #2c6cc4 100%);
    color: white;
}

.badge.mechanic {
    background: linear-gradient(135deg, #ff9500 0%, #e68500 100%);
    color: white;
}

/* Status badges */
.badge.submitted { background: #e8f0fe; color: #2c6cc4; border: 1px solid #2c6cc4; }
.badge.approved { background: #e6f4ea; color: #2aa44f; border: 1px solid #2aa44f; }
.badge.rejected { background: #ffeaea; color: #dc3545; border: 1px solid #dc3545; }
.badge.completed { background: #f0f4f9; color: #666; border: 1px solid #666; }
.badge.emergency { background: #fff3e0; color: #ff9500; border: 1px solid #ff9500; font-weight: bold; }
CSSEOF

echo "✅ UN logo image integration complete!"
echo "Your actual UN logo will now display in the system."
echo "Restart the frontend server to see changes."
