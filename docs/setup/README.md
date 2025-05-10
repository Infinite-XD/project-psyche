# Project Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager

## Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd project-psyche
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Client Configuration
CLIENT_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key
```

## Database Setup

1. Create a PostgreSQL database:
```bash
createdb database_name
```

2. Run database migrations:
```bash
npm run db:generate
npm run db:push
```

## Development

1. Start the development server:
```bash
npm run dev
```

This will start both the frontend and backend servers:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## Building for Production

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run check`: Type check the project
- `npm run db:push`: Push database schema changes
- `npm run db:generate`: Generate database migrations
- `npm run db:migrate`: Run database migrations

## Development Tools

### VS Code Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense

### Recommended Settings
Add the following to your VS Code settings:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Testing

1. Run type checking:
```bash
npm run check
```

2. Run linting:
```bash
npm run lint
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env
   - Ensure database exists

2. **Port Conflicts**
   - Check if ports 5001 and 5173 are available
   - Modify PORT in .env if needed

3. **Build Errors**
   - Clear node_modules and reinstall:
     ```bash
     rm -rf node_modules
     npm install
     ```

4. **TypeScript Errors**
   - Run `npm run check` to see detailed errors
   - Ensure all dependencies are properly installed

## Contributing

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Run tests and checks:
```bash
npm run check
npm run lint
```

4. Commit your changes:
```bash
git commit -m "feat: your feature description"
```

5. Push to your branch:
```bash
git push origin feature/your-feature-name
```

6. Create a Pull Request

## Security Considerations

1. Never commit sensitive information:
   - API keys
   - Database credentials
   - JWT secrets

2. Keep dependencies updated:
```bash
npm audit
npm audit fix
```

3. Use environment variables for all sensitive configuration 