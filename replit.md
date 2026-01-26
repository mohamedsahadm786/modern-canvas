# Overview

This is a modern, Apple-inspired portfolio website for SAHAD, a Data Scientist, AI/ML Engineer, and Statistician. The application showcases professional experience, education, projects, skills, and certifications through a sleek, responsive interface built with React, TypeScript, and modern web technologies.

The portfolio emphasizes clean design with generous whitespace, crisp typography, and subtle micro-interactions following Apple's design language. It features a full-bleed hero section, interactive timeline for education, project showcase with modal functionality, and comprehensive contact capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system based on shadcn/ui components
- **State Management**: TanStack Query for server state, React hooks for local state
- **Component Library**: Radix UI primitives with custom styling through shadcn/ui

**Design System**: 
- Apple-inspired aesthetic with neutral color palette
- Custom CSS variables for theming and consistent spacing
- Responsive design with mobile-first approach
- Glass morphism effects with backdrop blur for premium feel

**Key Components**:
- Navigation with sticky header and mobile hamburger menu
- Hero carousel with auto-rotation and manual controls
- Interactive education timeline with scroll animations
- Project cards with modal previews and GitHub integration
- Skills section with progress indicators and categorization
- Contact form with toast notifications

## Backend Architecture

**Server Framework**: Express.js with TypeScript
- **Development**: Hot module replacement via Vite integration
- **Production**: Compiled to ESM modules for Node.js execution
- **Middleware**: JSON parsing, URL encoding, request logging with timing
- **Error Handling**: Centralized error middleware with status code mapping

**Storage Layer**: 
- **Development**: In-memory storage implementation for rapid prototyping
- **Schema**: Defined with Drizzle ORM for type-safe database operations
- **Migration**: Configured for PostgreSQL with schema versioning

**API Design**:
- RESTful endpoints with `/api` prefix
- Request/response logging with JSON capture
- CORS handling and security middleware ready

## Database Architecture

**ORM**: Drizzle with TypeScript integration
- **Schema Definition**: Centralized in shared directory for client/server access
- **Type Generation**: Automatic TypeScript types from schema
- **Validation**: Zod schemas for runtime type checking
- **Connection**: Configured for Neon PostgreSQL with connection pooling

**Schema Structure**:
- User authentication foundation with UUID primary keys
- Extensible design for portfolio content management
- Migration system for schema evolution

## Build System

**Development**:
- Vite dev server with HMR and error overlay
- TypeScript checking with strict configuration
- Path aliases for clean imports (@/, @shared/, @assets/)
- Asset optimization and hot reloading

**Production**:
- Client bundle optimized and minimized
- Server compiled to single ESM file
- Static asset serving with proper caching headers
- Environment-specific configuration

# External Dependencies

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Radix UI**: Unstyled, accessible component primitives
- **shadcn/ui**: Pre-styled component library built on Radix
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe variant API for components

## Development Tools
- **Vite**: Fast build tool with HMR and optimization
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer

## Data Management
- **TanStack Query**: Async state management and caching
- **Drizzle ORM**: Type-safe database toolkit
- **Neon Database**: Serverless PostgreSQL for production
- **Zod**: Schema validation and type inference

## Libraries and Utilities
- **React Hook Form**: Form handling with validation
- **date-fns**: Date manipulation and formatting
- **wouter**: Lightweight routing solution
- **nanoid**: Unique ID generation

## Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Enhanced debugging tools

The application is designed for deployment on Replit with automatic environment detection and seamless development-to-production workflow.