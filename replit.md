# Pitch or Pass

## Overview

Pitch or Pass is a browser-based startup investment simulation game where players act as angel investors evaluating 10 startup pitches. Players start with $100,000 in virtual capital and must decide whether to invest in or pass on each startup, with outcomes revealed after a simulated 3-year period. The game features AI-generated startup pitches, realistic valuation mechanics, and an immersive physical "desk/whiteboard" visual theme.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state, local React state for game logic
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for card transitions and reveals
- **Charts**: Recharts for valuation projections
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: REST endpoints under `/api/game/*` for pitch generation, saving results, and AI interactions
- **Build**: esbuild for production bundling with selective dependency bundling

### Database Layer
- **ORM**: Drizzle ORM with Zod schema validation
- **Database**: PostgreSQL via Neon Serverless
- **Schema Location**: `shared/schema.ts` for type-safe shared models
- **Migrations**: Drizzle Kit with `db:push` command

### AI Integration
- **Provider**: OpenAI API (supports both direct API key and Replit AI Integrations)
- **Use Cases**: 
  - Generating unique startup pitches with realistic metrics
  - Creating outcome narratives for the reveal sequence
  - Answering founder questions during pitch evaluation
  - Generating simulated press coverage snippets

### Game Mechanics
- Player starts with $100,000 capital
- 10 startup pitches presented sequentially
- Valuations range from $60k-$400k (most clustered around $100k-$200k)
- Equity calculations capped at 49% maximum
- Risk profiles vary from low to high with corresponding outcome volatility
- 3-year time skip reveals portfolio performance

### Visual Theme
The UI follows a physical "wood desk/whiteboard" aesthetic with:
- Warm paper tones and charcoal text
- Sticky note-styled information cards
- Handwritten fonts (Caveat) for headers
- Muted color palette avoiding typical SaaS greens/blues
- Stamp-style action buttons

## External Dependencies

### Database
- **Neon Serverless PostgreSQL**: Cloud-hosted PostgreSQL with WebSocket connections for serverless environments

### AI Services
- **OpenAI API**: GPT models for content generation (pitches, narratives, Q&A responses)
- **Replit AI Integrations**: Alternative OpenAI endpoint when `AI_INTEGRATIONS_OPENAI_API_KEY` is set

### Frontend Libraries
- **shadcn/ui**: Pre-built accessible React components based on Radix UI primitives
- **Framer Motion**: Animation library for smooth transitions
- **canvas-confetti**: Celebration effects for successful outcomes
- **Recharts**: Data visualization for valuation graphs

### Authentication
- **express-session**: Session management with `connect-pg-simple` for PostgreSQL session storage (infrastructure present but not actively used in current game flow)

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY` or `AI_INTEGRATIONS_OPENAI_API_KEY`: OpenAI API authentication
- `OPENAI_API_BASE` or `AI_INTEGRATIONS_OPENAI_BASE_URL`: Optional custom API endpoint