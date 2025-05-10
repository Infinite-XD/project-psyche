# Deployment Guide

## Production Environment Requirements

- Node.js v18 or higher
- PostgreSQL v14 or higher
- SSL certificate for HTTPS
- Domain name (optional)
- Environment variables configured

## Deployment Options

### 1. Traditional VPS Deployment

#### Prerequisites
- VPS with Ubuntu 20.04 or higher
- Domain name (optional)
- SSL certificate

#### Setup Steps

1. Update system:
```bash
sudo apt update && sudo apt upgrade -y
```

2. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

3. Install PostgreSQL:
```bash
sudo apt install postgresql postgresql-contrib
```

4. Create database and user:
```bash
sudo -u postgres psql
CREATE DATABASE your_database;
CREATE USER your_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE your_database TO your_user;
```

5. Clone repository:
```bash
git clone <repository-url>
cd project-psyche
```

6. Install dependencies:
```bash
npm install
```

7. Create production .env file:
```env
NODE_ENV=production
PORT=5001
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/your_database
CLIENT_URL=https://your-domain.com
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

8. Build the application:
```bash
npm run build
```

9. Set up PM2 for process management:
```bash
npm install -g pm2
pm2 start dist/index.js --name project-psyche
pm2 save
```

10. Configure Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

11. Set up SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 2. Docker Deployment

#### Prerequisites
- Docker
- Docker Compose
- Domain name (optional)
- SSL certificate

#### Setup Steps

1. Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/database
      - CLIENT_URL=https://your-domain.com
      - JWT_SECRET=your_secure_jwt_secret
      - GEMINI_API_KEY=your_gemini_api_key
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=database
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

2. Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5001

CMD ["npm", "start"]
```

3. Build and run:
```bash
docker-compose up -d
```

### 3. Cloud Platform Deployment

#### Heroku

1. Install Heroku CLI:
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

2. Login to Heroku:
```bash
heroku login
```

3. Create Heroku app:
```bash
heroku create your-app-name
```

4. Add PostgreSQL:
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

5. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secure_jwt_secret
heroku config:set GEMINI_API_KEY=your_gemini_api_key
```

6. Deploy:
```bash
git push heroku main
```

## Monitoring and Maintenance

### Health Checks

1. Set up health check endpoint:
```typescript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});
```

2. Configure monitoring:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Backup Strategy

1. Database backups:
```bash
pg_dump -U your_user your_database > backup.sql
```

2. Automated backups with cron:
```bash
0 0 * * * pg_dump -U your_user your_database > /backups/backup-$(date +\%Y\%m\%d).sql
```

### Scaling Considerations

1. Load balancing with Nginx
2. Database replication
3. Caching with Redis
4. CDN for static assets

## Security Checklist

1. SSL/TLS enabled
2. Security headers configured
3. Rate limiting implemented
4. CORS properly configured
5. Environment variables secured
6. Regular security updates
7. Database backups encrypted
8. Access logs monitored

## Performance Optimization

1. Enable compression:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

2. Configure caching:
```nginx
location /static/ {
    expires 1y;
    add_header Cache-Control "public, no-transform";
}
```

3. Enable HTTP/2:
```nginx
listen 443 ssl http2;
```

## Troubleshooting

### Common Issues

1. **Application Crashes**
   - Check PM2 logs: `pm2 logs`
   - Verify environment variables
   - Check database connection

2. **Performance Issues**
   - Monitor server resources
   - Check database query performance
   - Review application logs

3. **SSL Issues**
   - Verify certificate validity
   - Check SSL configuration
   - Ensure proper redirects

4. **Database Issues**
   - Check connection pool
   - Monitor query performance
   - Verify backup integrity 