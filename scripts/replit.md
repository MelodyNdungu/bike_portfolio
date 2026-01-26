# NduthiGear - Motorcycle Consultation & Gear Platform

## Overview

NduthiGear is a modern full-stack web application that provides motorcycle consultation services and gear sales. The platform allows users to book consultations with motorcycle experts and browse premium motorcycle gear. Built with React, Express.js, and PostgreSQL, it features a dark-themed UI designed specifically for motorcycle enthusiasts.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom motorcycle-themed design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API architecture
- **Request Handling**: JSON-based API endpoints with validation
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot reload with Vite integration

### Database Architecture
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Neon serverless driver for optimal performance

## Key Components

### Data Models
- **Users**: Basic user authentication system
- **Consultations**: Consultation booking system with contact information
- **Gear Products**: Product catalog with categorization and pricing
- **Twitter Posts**: Social media integration for tips and updates

### API Endpoints
- `POST /api/consultations` - Book a new consultation
- `GET /api/consultations` - Retrieve all consultations
- `GET /api/gear` - Fetch gear products with optional category filtering
- `GET /api/gear?category={category}` - Filter products by category

### Frontend Components
- **Hero Section**: Landing page with call-to-action buttons
- **Services**: Consultation service offerings display
- **Gear HQ**: Product catalog with filtering capabilities
- **Twitter Feed**: Social media integration for tips
- **Contact Form**: Consultation booking interface
- **Navigation**: Responsive navigation with smooth scrolling

## Data Flow

1. **User Interaction**: Users navigate through the single-page application
2. **Form Submission**: Consultation forms are validated client-side with Zod
3. **API Requests**: React Query manages API calls with caching and error handling
4. **Database Operations**: Drizzle ORM handles type-safe database interactions
5. **Response Handling**: Success/error states are managed with toast notifications

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon database
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/\***: Accessible UI component primitives
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **drizzle-kit**: Database schema management
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development
- **Local Development**: `npm run dev` - Runs Express server with Vite HMR
- **Database Management**: `npm run db:push` - Push schema changes to database
- **Type Checking**: `npm run check` - TypeScript compilation check

### Production
- **Build Process**: `npm run build` - Creates optimized production build
- **Server Bundle**: Express server bundled with esbuild
- **Static Assets**: Vite builds optimized client-side assets
- **Deployment**: `npm start` - Runs production server

### Architecture Decisions

1. **Monorepo Structure**: Single repository with client/server/shared separation for easier development and deployment
2. **TypeScript Throughout**: End-to-end type safety from database to UI
3. **Drizzle ORM**: Chosen for type safety and performance over traditional ORMs
4. **Neon PostgreSQL**: Serverless database for scalability and cost efficiency
5. **Tailwind CSS**: Utility-first CSS for rapid UI development
6. **React Query**: Declarative data fetching with built-in caching and error handling

## Changelog

Changelog:
- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.