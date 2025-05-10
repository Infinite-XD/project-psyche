# Project Architecture

## Overview
This project is a full-stack web application built with a modern tech stack, featuring a React frontend and Express.js backend. The application is designed to provide academic stress management through an AI-powered chatbot interface.

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Google's Gemini AI
- **Authentication**: JWT-based with HTTP-only cookies
- **Styling**: TailwindCSS with Radix UI components

## System Architecture

### Frontend Architecture
- Component-based architecture using React
- State management using React Context and Zustand
- Routing using React Router
- UI components from Radix UI
- Styling with TailwindCSS

### Backend Architecture
- Express.js server with TypeScript
- RESTful API design
- Middleware-based authentication
- Session management with cookies
- AI integration with Gemini

### Database Architecture
- PostgreSQL database
- Drizzle ORM for type-safe database operations
- Schema migrations support

## Key Features
1. User Authentication
   - Registration
   - Login/Logout
   - Password management
   - Account deletion

2. AI Chat Interface
   - Real-time chat with Gemini AI
   - Chat history persistence
   - Context-aware responses

3. Security Features
   - HTTP-only cookies
   - JWT authentication
   - CORS protection
   - Input validation

## Directory Structure
```
project-psyche/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   ├── styles/       # Styling files
│   │   ├── types/        # TypeScript types
│   │   ├── assets/       # Static assets
│   │   └── contexts/     # React contexts
│   └── public/           # Public assets
├── server/                # Backend application
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── services/         # Business logic
│   ├── db/              # Database related code
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
├── shared/               # Shared code between frontend and backend
└── docs/                # Project documentation
```

## Security Considerations
1. Authentication
   - JWT tokens stored in HTTP-only cookies
   - Secure password hashing with bcrypt
   - Session management

2. API Security
   - CORS configuration
   - Input validation
   - Rate limiting
   - Error handling

3. Data Protection
   - Secure storage of user data
   - AI response filtering
   - Environment variable management 