# What I Did - Simple Explanation

## The Problem You Had
You wanted to host your React + Python job portal on your Ubuntu Server laptop and make it accessible publicly through Cloudflare Tunnel at `krishombasukala.com.np`.

## What I Changed

### 1. Fixed `compose.prod.yml` (Docker Configuration)

**Before:**
- Backend was on port 8000
- Frontend was on port 80/443
- MinIO storage was missing

**After:**
- Backend now runs on port **5000** (as you requested)
- Frontend now runs on port **3000** (as you requested)
- Added MinIO for storing resume uploads

**Why?** So your services run on the correct ports that Cloudflare Tunnel will connect to.

---

### 2. Created Template Files for Secrets

I created 3 example files that you need to copy and fill in with your actual passwords:

#### `backend/.env.production.example`
Contains settings for:
- Database password
- Secret key for JWT tokens
- MinIO storage credentials
- Your domain for CORS

#### `frontend/.env.production.example`
Contains:
- API URL: `https://api.krishombasukala.com.np`

#### `.env.minio.example`
Contains:
- MinIO admin username/password

**Why?** Your app needs these settings to work, but I can't include real passwords in git.

---

### 3. Created `cloudflared-config.yml` (Tunnel Configuration)

This tells Cloudflare Tunnel how to route internet traffic to your laptop:
- `krishombasukala.com.np` → goes to port 3000 (React app)
- `api.krishombasukala.com.np` → goes to port 5000 (Python API)

**Why?** Without this, Cloudflare doesn't know which ports to send traffic to.

---

### 4. Created `DEPLOYMENT.md` (Full Instructions)

A complete guide with all the commands you need to run. It's detailed but has everything in order.

**Why?** So you have a reference when setting things up.

---

## What You Need to Do Now

### Step 1: Create Your Real Environment Files

```bash
cd ~/job-portal

# Copy the examples
cp backend/.env.production.example backend/.env.production
cp frontend/.env.production.example frontend/.env.production
cp .env.minio.example .env.minio
```

### Step 2: Edit the Files with Real Passwords

```bash
# Edit each file and replace the placeholder values
nano backend/.env.production
# Change: POSTGRES_PASSWORD, SECRET_KEY, MINIO_SECRET_KEY

nano .env.minio
# Change: MINIO_ROOT_PASSWORD (use same as above)

# frontend/.env.production is already good - no changes needed
```

**Generate a secure SECRET_KEY:**
```bash
openssl rand -hex 32
```

### Step 3: Start Your Application

```bash
cd ~/job-portal
docker compose -f compose.prod.yml up -d
```

This will:
- Start PostgreSQL database
- Start your Python backend on port 5000
- Start your React frontend on port 3000
- Start MinIO for file storage

Check if it's running:
```bash
docker compose -f compose.prod.yml ps
```

### Step 4: Set Up Cloudflare Tunnel

```bash
# Login to Cloudflare (opens browser)
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create job-portal

# You'll get a TUNNEL_ID - copy it!

# Set up DNS
cloudflared tunnel route dns job-portal krishombasukala.com.np
cloudflared tunnel route dns job-portal api.krishombasukala.com.np
```

### Step 5: Configure the Tunnel

```bash
# Create config directory
mkdir -p ~/.cloudflared

# Copy my config template
cp ~/job-portal/cloudflared-config.yml ~/.cloudflared/config.yml

# Edit it with your tunnel ID
nano ~/.cloudflared/config.yml
# Replace: YOUR_TUNNEL_ID_HERE with the ID from step 4
# Replace: YOUR_USERNAME with your actual Ubuntu username
```

### Step 6: Start the Tunnel as a Service

```bash
# Install as system service
sudo cloudflared service install

# Start it
sudo systemctl start cloudflared

# Make it start on boot
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared
```

### Step 7: Test It

Open your browser and visit:
- **https://krishombasukala.com.np** - Should show your React app
- **https://api.krishombasukala.com.np** - Should show your API

---

## Simple Diagram

```
Internet
   ↓
Cloudflare Tunnel (cloudflared running on your laptop)
   ↓
┌─────────────────────────────────────────┐
│ Your Ubuntu Server Laptop               │
│                                          │
│  krishombasukala.com.np → Port 3000     │
│     (React Frontend in Docker)          │
│                                          │
│  api.krishombasukala.com.np → Port 5000 │
│     (Python Backend in Docker)          │
│                                          │
│  PostgreSQL (internal)                  │
│  MinIO Storage (internal)               │
└─────────────────────────────────────────┘
```

---

## Quick Reference Commands

### Check if your app is running
```bash
docker compose -f compose.prod.yml ps
```

### View logs
```bash
docker compose -f compose.prod.yml logs -f
```

### Stop everything
```bash
docker compose -f compose.prod.yml down
```

### Restart everything
```bash
docker compose -f compose.prod.yml restart
```

### Check tunnel status
```bash
sudo systemctl status cloudflared
```

---

## Common Issues

### "Can't connect to database"
- Check your `backend/.env.production` has correct `POSTGRES_PASSWORD`
- Make sure postgres container is running: `docker ps`

### "Frontend shows but can't login"
- Check `backend/.env.production` has `ALLOWED_ORIGINS` set to your domain
- Make sure backend is running on port 5000: `curl http://localhost:5000`

### "Cloudflare tunnel not working"
- Check tunnel is running: `sudo systemctl status cloudflared`
- Check logs: `sudo journalctl -u cloudflared -f`
- Make sure config file has correct tunnel ID

---

## Files I Modified/Created

✅ Modified: `compose.prod.yml`
✅ Created: `backend/.env.production.example`
✅ Created: `frontend/.env.production.example`
✅ Created: `.env.minio.example`
✅ Created: `cloudflared-config.yml`
✅ Created: `DEPLOYMENT.md` (detailed guide)
✅ Created: `SETUP_EXPLAINED.md` (this file)

---

## Next Steps After Setup

Once everything is working:

1. **Test your application** - Create a user, post a job, upload a resume
2. **Set up backups** - Your database has important data
3. **Monitor logs** - Check periodically for errors
4. **Update regularly** - Pull new code and rebuild

Need help? Check `DEPLOYMENT.md` for detailed troubleshooting.
