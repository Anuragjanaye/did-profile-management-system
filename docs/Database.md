# Database Design Document

# DID Profile Management System

Version: 2.0

Database: PostgreSQL (Neon)

ORM: Prisma

Architecture: Relational

Deployment: Vercel

---

# Table of Contents

1. Database Goals
2. Database Principles
3. Database Stack
4. Entity Relationship Overview
5. Tables
6. Relationships
7. Index Strategy
8. Constraints
9. Soft Delete Strategy
10. Audit Logs
11. File Storage
12. AI Data
13. Blockchain Data
14. Security
15. Performance
16. Migration Strategy
17. Backup Strategy
18. Future Expansion

---

# 1. Database Goals

The database must be

- Scalable
- Highly normalized
- Type-safe
- Secure
- Easy to query
- Optimized for Prisma
- Production ready

---

# 2. Database Principles

Use PostgreSQL.

Use Prisma ORM.

Avoid duplicated data.

Prefer relations over JSON.

Use UUID everywhere.

Use soft deletes where appropriate.

Every table must contain

- id
- createdAt
- updatedAt

---

# 3. Database Stack

Database

Neon PostgreSQL

ORM

Prisma

Validation

Zod

Caching

Upstash Redis

---

# 4. Entity Relationship Overview

```
User
 │
 ├── Profile
 │      ├── Education[]
 │      ├── Experience[]
 │      ├── Skill[]
 │      ├── SocialLink[]
 │      ├── Certificate[]
 │      ├── Upload[]
 │      ├── AIAnalysis[]
 │      ├── BlockchainRecord[]
 │
 ├── Session[]
 │
 ├── Notification[]
 │
 ├── ActivityLog[]
 │
 └── OrganizationMember[]
```

---

# 5. Core Tables

## User

Purpose

Authenticated wallet owner.

Fields

- id
- walletAddress
- username
- email (optional)
- ensName
- avatar
- role
- status
- createdAt
- updatedAt

---

## Profile

Stores user profile.

Fields

- id
- userId
- displayName
- headline
- bio
- location
- website
- avatarCID
- bannerCID
- profileScore
- verificationStatus
- visibility
- isComplete
- createdAt
- updatedAt

---

## Skill

Fields

- id
- profileId
- name
- level

---

## Education

Fields

- id
- profileId
- institution
- degree
- fieldOfStudy
- startYear
- endYear

---

## Experience

Fields

- id
- profileId
- company
- role
- description
- startDate
- endDate

---

## Certificate

Fields

- id
- profileId
- title
- issuer
- issueDate
- credentialURL
- cid

---

## SocialLink

Fields

- id
- profileId
- platform
- url

Platforms

- GitHub
- LinkedIn
- Twitter
- Portfolio
- Website

---

## Upload

Stores uploaded files.

Fields

- id
- profileId
- fileName
- mimeType
- size
- cid
- url
- uploadedAt

---

## Notification

Fields

- id
- userId
- title
- message
- type
- read
- createdAt

---

## ActivityLog

Tracks user activity.

Fields

- id
- userId
- action
- metadata
- ipAddress
- userAgent
- createdAt

---

## Session

Managed by Auth.js.

Fields

- id
- userId
- expiresAt
- sessionToken

---

## Organization

Future feature.

Fields

- id
- name
- slug
- logo
- ownerId

---

## OrganizationMember

Fields

- id
- organizationId
- userId
- role

---

# 6. AI Tables

## AIAnalysis

Stores AI-generated results.

Fields

- id
- profileId
- score
- summary
- strengths
- weaknesses
- recommendations
- createdAt

---

## AIRequest

Stores AI usage.

Fields

- id
- userId
- model
- tokens
- responseTime
- success
- createdAt

---

# 7. Blockchain Tables

## BlockchainRecord

Fields

- id
- profileId
- walletAddress
- contractAddress
- chainId
- transactionHash
- blockNumber
- cid
- verifiedAt

---

## SmartContractEvent

Fields

- id
- transactionHash
- eventName
- payload
- blockNumber
- timestamp

---

# 8. Relationships

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

Many Certificates

↓

Many Uploads

↓

Many AI Analyses

↓

Many Blockchain Records

User

↓

Many Sessions

↓

Many Notifications

↓

Many Activity Logs

Organizations

↓

Many Members

↓

Many Users

---

# 9. Enumerations

UserRole

```
USER

ADMIN

SUPER_ADMIN
```

Visibility

```
PUBLIC

PRIVATE

ORGANIZATION
```

VerificationStatus

```
PENDING

VERIFIED

FAILED
```

UploadType

```
AVATAR

BANNER

RESUME

CERTIFICATE

DOCUMENT
```

NotificationType

```
INFO

SUCCESS

WARNING

ERROR
```

AIStatus

```
PENDING

RUNNING

COMPLETED

FAILED
```

---

# 10. Index Strategy

Create indexes on

walletAddress

username

profileScore

visibility

verificationStatus

createdAt

updatedAt

transactionHash

contractAddress

cid

Search fields

displayName

skills

location

ENS

Composite indexes

(walletAddress, verificationStatus)

(profileId, createdAt)

(userId, createdAt)

---

# 11. Constraints

Wallet address

Unique

Username

Unique

Organization slug

Unique

ENS

Unique when present

Transaction hash

Unique

CID

Indexed

Every foreign key

Cascade delete where appropriate

---

# 12. Soft Delete

Use

deletedAt

instead of permanent deletion.

Applies to

Profile

Education

Experience

Certificates

Uploads

Notifications

---

# 13. Audit Logs

Log

Authentication

Wallet connection

Profile updates

Uploads

AI requests

Blockchain transactions

Organization changes

Never delete logs.

---

# 14. File Storage

Files live on

Pinata IPFS

Database stores

CID

File name

Type

Hash

Size

Uploader

Timestamp

---

# 15. AI Storage

Store

Profile score

Suggestions

Summary

Prompt metadata

Model version

Generation timestamp

Never store API keys.

---

# 16. Blockchain Storage

Store

Wallet

Transaction hash

Contract

Chain

CID

Verification time

Explorer URL

---

# 17. Security

Never store

Private keys

Wallet seed phrases

Secrets

API keys

Encrypt sensitive information.

Validate every query.

Use Prisma parameterization.

---

# 18. Performance

Enable

Connection pooling

Indexes

Pagination

Cursor pagination

Caching

Avoid

N+1 queries

Large joins

Repeated queries

---

# 19. Migration Strategy

Use

Prisma Migrate

Every schema change requires

Migration

Review

Testing

Deployment

Never edit production schema manually.

---

# 20. Backup Strategy

Automatic Neon backups.

Weekly export.

Point-in-time recovery.

Migration rollback plan.

---

# 21. Future Expansion

Future tables

VerifiableCredential

CredentialIssuer

DIDDocument

NFTProfile

WalletHistory

APIKey

Webhook

Team

Workspace

Permission

FeatureFlag

Billing

AuditTrail

IdentityProof

CrossChainIdentity

ENSRecord

ProfileVersion

VerificationRequest

Message

Chat

AIConversation

SearchAnalytics

---

# Database Summary

The database is designed around a normalized relational model using PostgreSQL and Prisma. Authentication is wallet-based through Auth.js and SIWE, profile assets are stored in IPFS with CIDs referenced in the database, blockchain verification metadata is persisted for auditability, and AI-generated analyses are stored separately for traceability and future improvements. The schema is optimized for scalability, type safety, efficient querying, and production deployment on Vercel.