# Project Psyche

A full-stack TypeScript application built with React, Express, and PostgreSQL.

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Radix UI Components
- Zustand (State Management)
- React Router DOM
- React Hook Form with Zod validation
- Three.js & React Three Fiber
- Framer Motion & GSAP

### Backend
- Express.js
- PostgreSQL with Drizzle ORM
- Passport.js with JWT
- Express Session

## Prerequisites

- Node.js (LTS version recommended)
- PostgreSQL 14 or higher
- npm or yarn package manager

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-psyche
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Start PostgreSQL service
   brew services start postgresql@14

   # Create database
   psql postgres
   CREATE DATABASE project_psyche;
   \q

   # Create user (if needed)
   createuser -s your_username
   psql postgres
   ALTER USER your_username WITH PASSWORD 'your_password';
   \q
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=project_psyche

   # Client URL (for CORS)
   CLIENT_URL=http://localhost:5173

   # JWT Secret (generate a secure random string)
   JWT_SECRET=your_jwt_secret

   # Session Secret (generate a secure random string)
   SESSION_SECRET=your_session_secret
   ```

5. **Database Migrations**
   ```bash
   npm run db:push
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## Production Deployment

### Server Requirements
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Nginx (recommended for reverse proxy)

### Deployment Steps

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Environment Configuration**
   Create a `.env` file with production values:
   ```
   # Database Configuration
   DB_HOST=your_production_db_host
   DB_PORT=5432
   DB_USER=your_production_db_user
   DB_PASSWORD=your_production_db_password
   DB_NAME=your_production_db_name

   # Client URL (your domain)
   CLIENT_URL=https://your-domain.com

   # JWT Secret
   JWT_SECRET=your_production_jwt_secret

   # Session Secret
   SESSION_SECRET=your_production_session_secret

   # SSL Configuration (if using SSL)
   SSL_KEY_PATH=/path/to/your/ssl/key
   SSL_CERT_PATH=/path/to/your/ssl/cert
   ```

3. **Nginx Configuration**
   Create a new Nginx configuration file:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Redirect HTTP to HTTPS
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl;
       server_name your-domain.com;

       ssl_certificate /path/to/your/ssl/cert;
       ssl_certificate_key /path/to/your/ssl/key;

       # Frontend
       location / {
           root /path/to/your/dist;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Start Production Server**
   ```bash
   npm run start
   ```

### Process Management
For production, it's recommended to use a process manager like PM2:
```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start dist/index.js --name project-psyche

# Other useful PM2 commands
pm2 list            # List all processes
pm2 logs            # View logs
pm2 restart all     # Restart all processes
pm2 stop all        # Stop all processes
```

## Database Management

### Migrations
```bash
# Generate new migration
npm run db:generate

# Push changes to database
npm run db:push

# Run migrations
npm run db:migrate
```

### Backup
```bash
# Backup database
pg_dump -U your_username project_psyche > backup.sql

# Restore database
psql -U your_username project_psyche < backup.sql
```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique secrets for JWT and sessions
   - Rotate secrets periodically

2. **Database Security**
   - Use strong passwords
   - Limit database user permissions
   - Enable SSL in production
   - Regular backups

3. **API Security**
   - Enable CORS properly
   - Use rate limiting
   - Implement proper authentication
   - Validate all inputs

## Monitoring and Maintenance

1. **Logs**
   - Application logs are available in PM2
   - Database logs in PostgreSQL
   - Nginx access and error logs

2. **Performance Monitoring**
   - Use PM2 monitoring
   - Database query optimization
   - Regular maintenance tasks

## Troubleshooting

1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check credentials in `.env`
   - Ensure database exists
   - Check SSL configuration

2. **Application Issues**
   - Check PM2 logs
   - Verify environment variables
   - Check file permissions
   - Verify port availability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License Here]
