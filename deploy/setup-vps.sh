#!/bin/bash
# One-time VPS setup script for The Helper (thehelper.ca)
# Run as root on the Hostinger VPS.
# Usage: bash deploy/setup-vps.sh

set -euo pipefail

echo "=== TheHelper VPS Setup ==="

# 1. Install system dependencies
apt-get update
apt-get install -y nginx nodejs npm postgresql-client jq curl

# 2. Install PM2 globally
npm install -g pm2

# 3. Set up nginx: API proxy
cat > /etc/nginx/sites-enabled/thehelper-api << 'NGINX'
server {
    listen 127.0.0.1:8181;
    server_name api.thehelper.ca;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

nginx -t && systemctl reload nginx

# 4. Set up PM2 startup
pm2 startup systemd -u root --hp /root

# 5. Create log directory
mkdir -p /opt/worki-pro/logs

echo ""
echo "=== VPS Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Ensure .env.server exists at /opt/worki-pro/.env.server"
echo "  2. cd /opt/worki-pro && npm install"
echo "  3. cd .wasp/out/server && npm install && npm run bundle"
echo "  4. pm2 start ecosystem.config.cjs"
echo "  5. pm2 save"
echo ""
echo "Cloudflare DNS (orange cloud ON):"
echo "  A thehelper.ca     -> VPS_IP"
echo "  A api.thehelper.ca -> VPS_IP"
