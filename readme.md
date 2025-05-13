# Project Psyche

A modern full-stack TypeScript application featuring an immersive 3D experience built with React Three Fiber, Express, and PostgreSQL.

## 🌟 Features

- Immersive 3D graphics and animations using Three.js and React Three Fiber
- Real-time physics simulations with Matter.js
- Interactive UI components with Radix UI
- Advanced animations with Framer Motion and GSAP
- Secure authentication with Passport.js and JWT
- Real-time capabilities with WebSocket
- Responsive design with Tailwind CSS
- Type-safe database operations with Drizzle ORM
- Form validation with React Hook Form and Zod
- State management with Zustand
- Data visualization with Recharts
- Interactive maps with React Leaflet
- Sound effects with Howler.js

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Three.js & React Three Fiber for 3D graphics
- Radix UI for accessible components
- Tailwind CSS for styling
- Framer Motion & GSAP for animations
- Zustand for state management
- React Router DOM for routing
- React Hook Form with Zod validation
- WebSocket for real-time features
- Various specialized libraries for enhanced functionality

### Backend
- Express.js with TypeScript
- PostgreSQL with Drizzle ORM
- Passport.js with JWT authentication
- Express Session for session management
- WebSocket server for real-time features
- Google AI integration
- OpenAI integration

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- PostgreSQL 14 or higher
- npm or yarn package manager

### Installation

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

   # JWT Secret
   JWT_SECRET=your_jwt_secret

   # Session Secret
   SESSION_SECRET=your_session_secret

   # AI API Keys (if using AI features)
   GOOGLE_AI_API_KEY=your_google_ai_key
   OPENAI_API_KEY=your_openai_key
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

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check
- `npm run db:push` - Push database changes
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations

## 🏗 Project Structure

```
project-psyche/
├── client/                 # Frontend application
│   ├── src/               # Source files
│   └── public/            # Static assets
├── server/                # Backend application
│   ├── config/           # Configuration files
│   ├── db/               # Database related files
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── shared/               # Shared types and utilities
└── docs/                # Documentation
```

## 🔒 Security

- JWT-based authentication
- Secure session management
- CORS protection
- Input validation with Zod
- Environment variable protection
- Database security best practices

## 🚢 Deployment

### Production Requirements
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Nginx (recommended for reverse proxy)

### Deployment Steps

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Configure Environment**
   Set up production environment variables in `.env`

3. **Database Setup**
   - Create production database
   - Run migrations
   - Set up proper user permissions

4. **Process Management**
   ```bash
   # Install PM2
   npm install -g pm2

   # Start the application
   pm2 start dist/index.js --name project-psyche
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

[Your License Here]

## 🙏 Acknowledgments

- Three.js community for 3D graphics support
- Radix UI for accessible components
- All other open-source contributors
