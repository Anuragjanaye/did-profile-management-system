# Engineering Rules

# DID Profile Management System

Version: 2.0

This document defines the mandatory engineering standards for the project.

These rules override personal preferences.

Every generated file must follow these rules.

---

# 1. General Principles

Always prioritize:

- Readability
- Maintainability
- Scalability
- Performance
- Security
- Type Safety

Every implementation must be production-ready.

Never generate prototype or demo code.

---

# 2. Tech Stack

Use ONLY the following stack.

Frontend

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Framer Motion

Authentication

- Auth.js
- SIWE
- RainbowKit
- Wagmi v2
- Viem

Backend

- Next.js Route Handlers
- Server Actions

Database

- PostgreSQL
- Neon
- Prisma ORM

Validation

- Zod

Cache

- Upstash Redis

Storage

- Pinata IPFS

Blockchain

- Solidity
- OpenZeppelin
- Foundry
- Ethereum Sepolia
- Viem

Monitoring

- Sentry
- Axiom
- Vercel Analytics

Testing

- Vitest
- Playwright
- Foundry

Deployment

- Vercel

---

# 3. TypeScript Rules

Always use TypeScript.

Never use JavaScript.

Never disable TypeScript checks.

Never use

```
any
```

Never ignore errors using

```
@ts-ignore
```

Prefer

- interfaces
- enums
- utility types
- generics

Enable strict mode.

---

# 4. File Organization

Every feature owns its code.

Example

```
features/

profile/

components/

hooks/

services/

schemas/

types/

actions/

constants/

utils/

```

Do not mix unrelated features.

---

# 5. Folder Rules

Never place business logic inside

- components
- pages

Business logic belongs inside

services/

Database queries belong inside

repositories/

Validation belongs inside

schemas/

Utility functions belong inside

utils/

---

# 6. Naming Rules

Components

PascalCase

Example

```
ProfileCard.tsx
```

Hooks

camelCase

```
useProfile.ts
```

Utilities

camelCase

```
formatDate.ts
```

Types

PascalCase

```
Profile.ts
```

Constants

UPPER_SNAKE_CASE

```
MAX_UPLOAD_SIZE
```

---

# 7. Component Rules

Components should

- be reusable
- receive typed props
- remain small
- avoid unnecessary state

Prefer composition over inheritance.

Avoid prop drilling.

---

# 8. React Rules

Use

Server Components

by default.

Use Client Components

only when necessary.

Use

Server Actions

for mutations whenever possible.

Avoid unnecessary useEffect.

Prefer async server rendering.

---

# 9. State Management

Use

React Query

for server state.

Use

Zustand

for client state.

Never duplicate state.

Never fetch the same data twice.

---

# 10. API Rules

Every endpoint must

Validate input

Authenticate user

Authorize request

Handle errors

Return consistent responses

Log important events

Never expose stack traces.

---

Response format

Success

```
{
 success: true,
 data: {}
}
```

Failure

```
{
 success: false,
 error: {}
}
```

---

# 11. Validation Rules

Use

Zod

for every request.

Never trust client input.

Validate

- params
- query
- body
- headers

Return descriptive validation errors.

---

# 12. Database Rules

All database access goes through Prisma.

Never write raw SQL unless absolutely necessary.

Use transactions where appropriate.

Always define relations.

Create indexes for searchable fields.

Never expose internal IDs unnecessarily.

---

# 13. Authentication Rules

Use

Sign-In With Ethereum

Never store passwords.

Never store private keys.

Use Auth.js sessions.

Validate wallet signatures.

Support wallet reconnect.

---

# 14. Authorization Rules

Every protected route must verify

Authentication

Authorization

Ownership

Never trust client permissions.

---

# 15. Blockchain Rules

Never hardcode addresses.

Store contract addresses in environment variables.

Always verify chain ID.

Use Viem.

Never use deprecated libraries.

Handle transaction failures gracefully.

Wait for confirmations.

Store transaction hashes.

---

# 16. Smart Contract Rules

Use

OpenZeppelin

contracts.

Follow Checks-Effects-Interactions.

Avoid unnecessary storage writes.

Emit events for every state change.

Write Foundry tests.

Document every public function.

---

# 17. IPFS Rules

Store

images

metadata

resume

certificates

Never expose Pinata secret keys.

Use signed uploads when possible.

Store returned CID.

---

# 18. AI Rules

AI responses must never be trusted blindly.

Validate outputs.

Limit response size.

Handle failures.

Cache expensive responses.

Log AI failures.

Support retry.

---

# 19. Security Rules

Implement

CSRF protection

Rate limiting

Secure cookies

Content Security Policy

XSS prevention

SQL injection prevention

Environment validation

HTTPS only

Secrets never reach client.

---

# 20. Environment Variables

Validate all variables during startup.

Required

```
DATABASE_URL

NEXTAUTH_SECRET

NEXTAUTH_URL

OPENAI_API_KEY

PINATA_JWT

UPSTASH_REDIS_URL

UPSTASH_REDIS_TOKEN

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

CONTRACT_ADDRESS

```

Fail immediately if missing.

---

# 21. Error Handling

Never throw generic errors.

Create custom error classes.

Log server errors.

Show friendly user messages.

Never expose sensitive details.

---

# 22. Logging Rules

Use structured logging.

Never log

passwords

private keys

JWTs

wallet signatures

API keys

Personally identifiable information

---

# 23. Performance Rules

Lazy load heavy components.

Optimize images.

Use pagination.

Cache repeated queries.

Avoid unnecessary re-renders.

Use dynamic imports.

---

# 24. Accessibility

Follow WCAG 2.2 AA.

Keyboard navigation required.

Accessible labels required.

Visible focus indicators.

Proper heading hierarchy.

Color contrast compliance.

---

# 25. Styling Rules

Use

Tailwind CSS

Use

shadcn/ui

Do not write large custom CSS files.

Prefer utility classes.

Support dark mode.

Maintain consistent spacing.

---

# 26. Git Rules

Branch names

feature/

fix/

refactor/

docs/

test/

Commit format

```
feat:

fix:

refactor:

docs:

test:

style:

```

---

# 27. Documentation Rules

Every exported function must have documentation.

Complex business logic must include comments explaining why, not what.

Keep README updated.

Document environment variables.

---

# 28. Testing Rules

Write

Unit Tests

Integration Tests

End-to-End Tests

Smart Contract Tests

Minimum expectations

Business logic

API routes

Critical UI flows

Authentication

Blockchain

---

# 29. Deployment Rules

Deploy only through GitHub.

Automatic deployment through Vercel.

Never commit secrets.

Run tests before deployment.

Block deployment if tests fail.

---

# 30. Monitoring

Track

API latency

Errors

AI failures

Blockchain failures

Authentication failures

Uploads

Database performance

---

# 31. Code Quality Rules

Maximum file size

300 lines

Maximum function size

40 lines

Maximum component size

200 lines

Extract reusable logic.

Avoid duplicated code.

Prefer reusable abstractions.

---

# 32. Feature Development Checklist

Before completing any feature verify

- Type safe
- Validated
- Tested
- Responsive
- Accessible
- Secure
- Logged
- Documented
- Error handled
- Performance optimized

---

# 33. Things Never Allowed

Never use

Express

JavaScript

any

@ts-ignore

Hardcoded secrets

Inline SQL

Client-side private keys

Disabled validation

Duplicate business logic

Global mutable state

Large monolithic components

Prototype code

Temporary hacks

Console logs in production

Unused dependencies

Unused imports

Dead code

---

# 34. Definition of Done

A feature is complete only if

✓ Fully typed

✓ Tested

✓ Documented

✓ Responsive

✓ Accessible

✓ Secure

✓ Error handled

✓ Production ready

✓ Optimized

✓ Deployable on Vercel

✓ Reviewed against this document

---

# Final Rule

Whenever there is uncertainty between writing code quickly or writing maintainable production-quality code, always choose the maintainable, secure, scalable, and production-ready solution.