# Architecture Document

# DID Profile Management System
## Production Architecture

Version: 2.0

Deployment Target: Vercel

Architecture Style: Serverless, Modular, Feature-Based

---

# Table of Contents

1. Architecture Goals
2. High-Level Architecture
3. Core Principles
4. Technology Stack
5. System Components
6. Application Layers
7. Request Flow
8. Authentication Flow
9. Profile Management Flow
10. AI Flow
11. Blockchain Flow
12. Storage Flow
13. Database Architecture
14. Caching Strategy
15. Security Architecture
16. Folder Structure
17. Deployment Architecture
18. Monitoring
19. Scalability
20. Future Expansion

---

# 1. Architecture Goals

The system should:

- Be production-ready.
- Be fully deployable on Vercel.
- Scale horizontally.
- Follow serverless architecture.
- Be highly modular.
- Use strong TypeScript typing.
- Minimize operational overhead.
- Separate business logic from infrastructure.
- Support future enterprise features.

---

# 2. High-Level Architecture

```
                    Browser

                       │

             Next.js 15 Application

      ┌──────────────┼──────────────┐

      │              │              │

 React UI      Server Actions   Route Handlers

      │              │              │

      └──────────────┼──────────────┘

                     │

             Business Services

                     │

      ┌──────────────┼──────────────┐

      │              │              │

 Authentication   AI Service   Blockchain Service

      │              │              │

      └──────────────┼──────────────┘

                     │

             Repository Layer

      ┌──────────────┼──────────────┐

      │              │              │

   PostgreSQL      Redis         Pinata

      │

    Prisma ORM

      │

 Neon PostgreSQL Database

```

---

# 3. Core Principles

## Serverless First

No dedicated Express server.

Every backend endpoint should be implemented using:

- Route Handlers
- Server Actions

---

## Modular Design

Every feature owns its:

- components
- hooks
- services
- validation
- API
- types

---

## Separation of Concerns

Presentation Layer

↓

Application Layer

↓

Business Layer

↓

Repository Layer

↓

Infrastructure Layer

---

## Type Safety

Every request

↓

Zod Validation

↓

TypeScript Types

↓

Prisma Types

---

# 4. Technology Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Framer Motion

---

## Backend

- Route Handlers
- Server Actions

---

## Authentication

- Auth.js
- SIWE
- Wagmi v2
- RainbowKit
- Viem

---

## Database

- PostgreSQL
- Neon

---

## ORM

Prisma

---

## Validation

Zod

---

## Blockchain

Ethereum Sepolia

Solidity

Foundry

OpenZeppelin

Viem

---

## Storage

Pinata IPFS

---

## Cache

Upstash Redis

---

## AI

OpenAI Responses API

(Optional)

Hugging Face

---

## Monitoring

Sentry

Axiom

Vercel Analytics

---

# 5. Application Layers

## Presentation Layer

Responsibilities

- UI
- Forms
- Navigation
- User interaction

Contains

- Components
- Pages
- Layouts

---

## Application Layer

Responsibilities

- API requests
- State management
- Form submission

Contains

- React Query
- Zustand
- Hooks

---

## Business Layer

Responsibilities

- Profile logic
- AI logic
- Wallet logic
- Blockchain logic

Contains

Services

---

## Repository Layer

Responsibilities

- Database access
- Prisma queries

Never expose Prisma directly to UI.

---

## Infrastructure Layer

Responsible for

- Database
- Blockchain
- AI
- IPFS
- Cache

---

# 6. System Components

## Authentication Service

Responsible for

- SIWE
- Session management
- Wallet verification

---

## Profile Service

Responsible for

- CRUD
- Search
- Validation

---

## Upload Service

Responsible for

- Images

- Resume

- Certificates

- Metadata

---

## AI Service

Responsible for

- Profile analysis

- Suggestions

- Profile score

- Grammar

- Resume review

---

## Blockchain Service

Responsible for

- Register CID

- Read smart contracts

- Verify ownership

---

## Search Service

Responsible for

- Public search

- Skill search

- Wallet search

---

# 7. Authentication Flow

```
User

↓

Connect Wallet

↓

Wallet Signature

↓

SIWE Message

↓

Auth.js

↓

Session Created

↓

Dashboard
```

---

# 8. Profile Creation Flow

```
User

↓

Profile Form

↓

Zod Validation

↓

Server Action

↓

Prisma

↓

Database Updated

↓

Return Updated Profile
```

---

# 9. IPFS Upload Flow

```
User Upload

↓

Server Action

↓

Pinata SDK

↓

Upload File

↓

Receive CID

↓

Save CID in Database

↓

Return Success
```

---

# 10. Blockchain Flow

```
Profile Updated

↓

Generate Metadata

↓

IPFS Upload

↓

Receive CID

↓

Call Smart Contract

↓

Register CID

↓

Transaction Confirmed

↓

Store Transaction Hash
```

---

# 11. AI Flow

```
Profile

↓

OpenAI

↓

Analyze Profile

↓

Generate Suggestions

↓

Generate Score

↓

Save Analysis

↓

Display Dashboard
```

---

# 12. Database Architecture

Main Tables

Users

Profiles

Sessions

Organizations

Skills

Education

Experience

Certificates

Uploads

Notifications

ActivityLogs

AIAnalysis

---

Relationships

User

↓

One Profile

↓

Many Skills

↓

Many Education

↓

Many Experience

↓

Many Uploads

↓

Many Activity Logs

---

# 13. Caching Strategy

Use Upstash Redis

Cache

- Public profiles

- Search results

- AI responses

- Blockchain lookups

TTL

5–30 minutes

---

# 14. Security Architecture

Authentication

- SIWE

- Auth.js

Authorization

Role Based Access

Validation

Zod

Protection

- CSRF

- XSS

- SQL Injection

- Rate Limiting

- CSP

- Secure Cookies

Environment

Secrets stored only in Vercel Environment Variables.

---

# 15. Folder Structure

```
src/

app/

components/

features/

auth/

profile/

dashboard/

ai/

blockchain/

ipfs/

search/

settings/

lib/

db/

repositories/

services/

hooks/

providers/

types/

schemas/

utils/

config/

styles/

middleware.ts
```

---

# 16. Deployment Architecture

GitHub

↓

GitHub Actions

↓

Vercel Build

↓

Deploy

↓

Production

Database

↓

Neon PostgreSQL

Cache

↓

Upstash Redis

Storage

↓

Pinata

Monitoring

↓

Sentry

Analytics

↓

Vercel Analytics

---

# 17. Monitoring

Track

- API latency

- Database latency

- Blockchain failures

- AI failures

- Upload failures

- Login failures

- User activity

Errors

↓

Sentry

Logs

↓

Axiom

Performance

↓

Vercel Analytics

---

# 18. Scalability

Stateless APIs

↓

Horizontal Scaling

↓

Serverless Functions

↓

CDN

↓

Edge Network

Supports

- 100K+ users

- Millions of profiles

- High concurrency

---

# 19. Coding Principles

Business logic must never exist inside UI components.

Database queries must only exist inside repositories.

Validation must occur before every mutation.

Server Actions should be preferred over REST APIs where practical.

Every feature should be independently maintainable.

All code must be fully typed.

No duplicated business logic.

No direct database access from UI.

No hardcoded secrets.

No client-side private logic.

---

# 20. Future Expansion

Architecture should support

- Multi-chain wallets

- Polygon

- Base

- Arbitrum

- ENS

- DID Documents

- Verifiable Credentials

- Organization Workspaces

- Team Management

- Role Based Access Control

- Audit Logs

- AI Chat Assistant

- Mobile Applications

- Public APIs

- Webhooks

- Third-party integrations

without major architectural changes.

---

# Architecture Summary

The system follows a modern production architecture built around Next.js 15 App Router and serverless principles. Authentication is powered by Sign-In with Ethereum using Auth.js, Wagmi, and Viem. Profile data is stored in Neon PostgreSQL through Prisma, while decentralized assets are uploaded to Pinata IPFS and optionally registered on Ethereum Sepolia using Solidity smart contracts. AI capabilities are provided through the OpenAI Responses API, and Redis caching, structured monitoring, and automated deployment ensure the application is scalable, maintainable, and suitable for production deployment on Vercel.