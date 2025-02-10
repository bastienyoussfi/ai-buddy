# AI Agent System

[![CI/CD Pipeline](https://github.com/bastienyoussfi/ai-buddy/actions/workflows/main.yml/badge.svg)](https://github.com/bastienyoussfi/ai-buddy/actions/workflows/main.yml)

A modular personal AI agent system built with NestJS, React, and microservices architecture.

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v18 or later)
- npm (comes with Node.js)
- Docker and Docker Compose
- Git

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**

   ```bash
   npm ci
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with:

   ```env
   # Database
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aiagent
   POSTGRES_DB=aiagent
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres

   # Redis
   REDIS_URL=redis://localhost:6379

   # RabbitMQ
   RABBITMQ_USER=user
   RABBITMQ_PASS=password
   ```

4. **Start development services**

   ```bash
   npm run docker:dev
   ```

   This will start PostgreSQL, Redis, and RabbitMQ in Docker containers.

5. **Generate Prisma client and run migrations**

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

6. **Start the development server**
   ```bash
   npm run start:dev
   ```

## Available Scripts

- `npm run lint` - Run linting checks
- `npm run format` - Format code using Prettier
- `npm run test` - Run all tests
- `npm run build` - Build all applications
- `npm run type-check` - Run TypeScript type checking
- `npm run docker:dev` - Start development services
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

## Project Structure
