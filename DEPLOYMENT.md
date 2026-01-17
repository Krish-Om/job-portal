# Job Portal Deployment Guide - Ubuntu Server with Cloudflare Tunnel

This guide will help you deploy your Job Portal application on your Ubuntu Server laptop and make it publicly accessible via Cloudflare Tunnel.

## Prerequisites

- Ubuntu Server installed on your laptop
- Docker and Docker Compose installed
- Cloudflare account with a domain (krishombasukala.com.np)
- Internet connection

## Step 1: Install Docker and Docker Compose

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
# Or run: newgrp docker

# Install Docker Compose (if not included with Docker)
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

## Step 2: Install Cloudflare Tunnel (cloudflared)

```bash
# Download and install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Verify installation
cloudflared --version
```

## Step 3: Set Up Cloudflare Tunnel

### 3.1 Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This will open a browser window. Select your domain (krishombasukala.com.np) and authorize.

### 3.2 Create a Tunnel

```bash
# Create a new tunnel (replace 'job-portal' with your preferred name)
7aaeb305-a922-430f-bc18-8709d5a4e8b0

# This will output a tunnel ID - save it!
# Example: Tunnel credentials written to /home/username/.cloudflared/TUNNEL_ID.json
```

### 3.3 Configure DNS Records

```bash
# Route your domain to the tunnel
cloudflared tunnel route dns job-portal krishombasukala.com.np
cloudflared tunnel route dns job-portal api.krishombasukala.com.np
cloudflared tunnel route dns job-portal www.krishombasukala.com.np
```

### 3.4 Copy Configuration File

```bash
# Create cloudflared config directory
mkdir -p ~/.cloudflared

# Copy the configuration file from your project
cp ~/job-portal/cloudflared-config.yml ~/.cloudflared/config.yml

# Edit the config file with your tunnel ID
nano ~/.cloudflared/config.yml
# Replace YOUR_TUNNEL_ID_HERE with your actual tunnel ID
# Replace YOUR_USERNAME with your actual Ubuntu username
```

## Step 4: Prepare Application Environment

### 4.1 Clone/Navigate to Your Project

```bash
cd ~/job-portal
```

### 4.2 Create Environment Files

```bash
# Copy example files
cp backend/.env.production.example backend/.env.production
cp frontend/.env.production.example frontend/.env.production
cp .env.minio.example .env.minio

# Edit each file with your actual values
nano backend/.env.production
nano frontend/.env.production
nano .env.minio
```

**Important Environment Variables to Configure:**

**backend/.env.production:**
- `POSTGRES_PASSWORD` - Strong database password
- `SECRET_KEY` - Generate with: `openssl rand -hex 32`
- `ALLOWED_ORIGINS` - Set to your domain
- `MINIO_SECRET_KEY` - Strong MinIO password

**frontend/.env.production:**
- `VITE_API_URL` - Set to `https://api.krishombasukala.com.np`

**.env.minio:**
- `MINIO_ROOT_PASSWORD` - Strong MinIO password (same as in backend)

## Step 5: Deploy with Docker Compose

```bash
# Navigate to project directory
cd ~/job-portal

# Build and start all services in production mode
docker compose -f compose.prod.yml up -d --build

# Check service status
docker compose -f compose.prod.yml ps

# View logs
docker compose -f compose.prod.yml logs -f
```

## Step 6: Start Cloudflare Tunnel

### Option A: Run as a Service (Recommended)

```bash
# Install cloudflared as a system service
sudo cloudflared service install

# Start the service
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared
```

### Option B: Run Manually

```bash
# Run in foreground (for testing)
cloudflared tunnel run job-portal

# Or run in background
nohup cloudflared tunnel run job-portal > ~/cloudflared.log 2>&1 &
```

## Step 7: Verify Deployment

1. **Check Docker Services:**
   ```bash
   docker compose -f compose.prod.yml ps
   # All services should be "Up" and "healthy"
   ```

2. **Test Local Access:**
   ```bash
   # Test frontend
   curl http://localhost:3000
   
   # Test backend
   curl http://localhost:5000
   ```

3. **Test Public Access:**
   - Visit https://krishombasukala.com.np (frontend)
   - Visit https://api.krishombasukala.com.np (backend API)

4. **View Cloudflare Tunnel Logs:**
   ```bash
   # If running as service
   sudo journalctl -u cloudflared -f
   
   # If running manually
   tail -f ~/cloudflared.log
   ```

## Port Configuration Summary

| Service    | Internal Port | Host Port | Public Access                        |
|------------|--------------|-----------|--------------------------------------|
| Frontend   | 5173         | 3000      | https://krishombasukala.com.np       |
| Backend    | 8000         | 5000      | https://api.krishombasukala.com.np   |
| PostgreSQL | 5432         | (internal)| Not exposed publicly                 |
| MinIO S3   | 9000         | 9000      | Not exposed publicly (internal use)  |
| MinIO UI   | 9001         | 9001      | http://localhost:9001 (local only)   |

## Common Commands

### Docker Management

```bash
# Stop all services
docker compose -f compose.prod.yml down

# Restart services
docker compose -f compose.prod.yml restart

# View logs for specific service
docker compose -f compose.prod.yml logs -f backend
docker compose -f compose.prod.yml logs -f frontend

# Rebuild specific service
docker compose -f compose.prod.yml up -d --build backend

# Execute command in container
docker compose -f compose.prod.yml exec backend bash
docker compose -f compose.prod.yml exec postgres psql -U postgres -d jobportal
```

### Database Management

```bash
# Backup database
docker compose -f compose.prod.yml exec postgres pg_dump -U postgres jobportal > backup_$(date +%Y%m%d).sql

# Restore database
docker compose -f compose.prod.yml exec -T postgres psql -U postgres jobportal < backup_20260117.sql

# Access database shell
docker compose -f compose.prod.yml exec postgres psql -U postgres -d jobportal
```

### System Monitoring

```bash
# Check disk usage
df -h
docker system df

# Monitor resource usage
docker stats

# Check running containers
docker ps

# View system logs
sudo journalctl -f
```

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker compose -f compose.prod.yml logs

# Check specific service
docker compose -f compose.prod.yml logs backend

# Remove containers and rebuild
docker compose -f compose.prod.yml down -v
docker compose -f compose.prod.yml up -d --build
```

### Cloudflare Tunnel Issues

```bash
# Check tunnel status
cloudflared tunnel info job-portal

# Check cloudflared service
sudo systemctl status cloudflared
sudo journalctl -u cloudflared -n 50

# Test tunnel connectivity
cloudflared tunnel run --loglevel debug job-portal
```

### Database Connection Issues

```bash
# Verify PostgreSQL is running
docker compose -f compose.prod.yml exec postgres pg_isready -U postgres

# Check database logs
docker compose -f compose.prod.yml logs postgres

# Test connection from backend container
docker compose -f compose.prod.yml exec backend python -c "from src.database.session import engine; print(engine.connect())"
```

### Frontend Can't Connect to Backend

1. Check `VITE_API_URL` in `frontend/.env.production`
2. Verify CORS settings in `backend/.env.production` (`ALLOWED_ORIGINS`)
3. Test API directly: `curl https://api.krishombasukala.com.np`
4. Check Cloudflare Tunnel routing configuration

## Security Recommendations

1. **Change Default Passwords:**
   - PostgreSQL password
   - MinIO root password
   - Application secret key

2. **Enable Firewall:**
   ```bash
   sudo ufw allow ssh
   sudo ufw enable
   ```
   Note: Docker manages its own firewall rules, services are accessible via Cloudflare Tunnel

3. **Regular Updates:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Update Docker images
   docker compose -f compose.prod.yml pull
   docker compose -f compose.prod.yml up -d
   ```

4. **Backup Strategy:**
   - Set up automated database backups
   - Back up MinIO data (resumes)
   - Keep configuration files secure

## Updating the Application

```bash
# Pull latest code
cd ~/job-portal
git pull

# Rebuild and restart
docker compose -f compose.prod.yml up -d --build

# Run database migrations if needed
docker compose -f compose.prod.yml exec backend alembic upgrade head
```

## Monitoring and Maintenance

### Set Up Log Rotation

Create `/etc/docker/daemon.json`:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Then restart Docker:
```bash
sudo systemctl restart docker
```

### Monitor Application

```bash
# Create a monitoring script
cat > ~/monitor.sh << 'EOF'
#!/bin/bash
echo "=== Docker Services ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "=== Disk Usage ==="
df -h | grep -E "/$|/var/lib/docker"
echo ""
echo "=== Memory Usage ==="
free -h
EOF

chmod +x ~/monitor.sh
./monitor.sh
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vite Documentation](https://vitejs.dev/)

## Support

If you encounter issues:
1. Check service logs: `docker compose -f compose.prod.yml logs -f`
2. Verify tunnel status: `sudo systemctl status cloudflared`
3. Test local connectivity before troubleshooting tunnel
4. Check Cloudflare dashboard for tunnel status
