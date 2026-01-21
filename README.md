# NduthiGear - Motorcycle Consultation & Gear Platform

A modern full-stack web application for motorcycle consultation services and gear sales, built with React, Express.js, and PostgreSQL.

## Features

- 🏍️ Motorcycle consultation booking system
- 🛒 Gear product catalog with filtering
- 🐦 Twitter feed integration for tips and updates
- 🎨 Modern dark-themed UI with Tailwind CSS
- 📱 Responsive design for all devices
- ✅ Form validation with Zod
- 🔄 Real-time updates with React Query

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui components
- Wouter for routing
- TanStack Query for state management
- React Hook Form for forms

### Backend
- Node.js + Express.js
- TypeScript with ES modules
- Drizzle ORM
- PostgreSQL (Neon serverless)

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon account)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd bike_portfolio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and add your `DATABASE_URL` and optional Twitter API credentials.

4. Push database schema
```bash
npm run db:push
```

5. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## Project Structure

```
bike_portfolio/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities
│   │   └── hooks/       # Custom hooks
│   └── index.html
├── server/          # Express backend
│   ├── index.ts     # Server entry point
│   ├── routes.ts    # API routes
│   ├── db.ts        # Database connection
│   └── storage.ts   # Data access layer
├── shared/          # Shared code
│   └── schema.ts    # Database schema & types
└── scripts/         # Utility scripts
```

## Environment Variables

See `.env.example` for required environment variables:
- `DATABASE_URL` - PostgreSQL connection string (required)
- `TWITTER_API_KEY` - Twitter API key (optional)
- `TWITTER_BEARER_TOKEN` - Twitter bearer token (optional)
- `NODE_ENV` - Environment mode (development/production)

## License

MIT