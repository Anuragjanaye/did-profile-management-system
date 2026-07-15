# API Specification

# DID Profile Management System

Version: 2.0

Architecture

- Next.js 15 Route Handlers
- Server Actions
- Auth.js
- Zod Validation
- Prisma ORM
- REST APIs

---

# API Standards

Base URL

/api

Response Format

Success

{
  "success": true,
  "data": {}
}

Failure

{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description"
  }
}

---

# Authentication APIs

POST /api/auth/login

Purpose

Authenticate using SIWE.

Authentication

Public

Body

{
  message,
  signature
}

Response

{
  session,
  user
}

---

POST /api/auth/logout

Purpose

Destroy session.

Authentication

Required

---

GET /api/auth/session

Purpose

Return current authenticated user.

Authentication

Required

---

# User APIs

GET /api/user

Return current user.

---

PATCH /api/user

Update account.

---

DELETE /api/user

Delete account.

---

# Profile APIs

POST /api/profile

Create profile.

---

GET /api/profile

Get current profile.

---

GET /api/profile/:username

Public profile.

---

PATCH /api/profile

Update profile.

---

DELETE /api/profile

Delete profile.

---

# Education APIs

POST /api/profile/education

GET /api/profile/education

PATCH /api/profile/education/:id

DELETE /api/profile/education/:id

---

# Experience APIs

POST /api/profile/experience

GET /api/profile/experience

PATCH /api/profile/experience/:id

DELETE /api/profile/experience/:id

---

# Skills APIs

POST /api/profile/skills

PATCH /api/profile/skills/:id

DELETE /api/profile/skills/:id

---

# Social APIs

POST /api/profile/socials

PATCH /api/profile/socials/:id

DELETE /api/profile/socials/:id

---

# Upload APIs

POST /api/upload/avatar

POST /api/upload/banner

POST /api/upload/resume

POST /api/upload/certificate

Authentication Required

Returns

CID

URL

File metadata

---

# IPFS APIs

POST /api/ipfs/upload

GET /api/ipfs/:cid

DELETE /api/ipfs/:cid

---

# Blockchain APIs

POST /api/blockchain/register

Registers profile CID.

---

GET /api/blockchain/status

Returns verification.

---

GET /api/blockchain/history

Returns transaction history.

---

GET /api/blockchain/events

Returns smart contract events.

---

# AI APIs

POST /api/ai/analyze

Analyze profile.

---

POST /api/ai/improve

Improve bio.

---

POST /api/ai/summary

Generate summary.

---

POST /api/ai/resume

Analyze resume.

---

POST /api/ai/skills

Recommend skills.

---

GET /api/ai/history

Return previous analyses.

---

# Search APIs

GET /api/search

Supports

name

wallet

skills

organization

location

---

# Dashboard APIs

GET /api/dashboard

Returns

Profile

Analytics

Notifications

Wallet

AI

Storage

Verification

---

# Notification APIs

GET /api/notifications

PATCH /api/notifications/:id/read

DELETE /api/notifications/:id

---

# Organization APIs

POST /api/organizations

GET /api/organizations

PATCH /api/organizations/:id

DELETE /api/organizations/:id

---

POST /api/organizations/:id/invite

---

POST /api/organizations/:id/remove

---

# Settings APIs

GET /api/settings

PATCH /api/settings

---

# Analytics APIs

GET /api/analytics/profile

GET /api/analytics/usage

GET /api/analytics/storage

---

# Health APIs

GET /api/health

GET /api/version

---

# Validation

Every request

- Zod validation

Every endpoint

- Authentication
- Authorization
- Logging
- Error handling

---

# Rate Limits

Authentication

10/min

AI

20/hour

Uploads

30/hour

Search

100/min

Public Profiles

300/min

---

# Error Codes

UNAUTHORIZED

FORBIDDEN

VALIDATION_ERROR

NOT_FOUND

RATE_LIMIT

BLOCKCHAIN_ERROR

AI_ERROR

UPLOAD_ERROR

DATABASE_ERROR

SERVER_ERROR

---

# Security

Every endpoint

- HTTPS
- CSRF protection
- Secure cookies
- Input validation
- Rate limiting
- Audit logging

Never expose

- Secrets
- API keys
- Private keys
- Stack traces
