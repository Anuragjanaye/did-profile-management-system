# Design System

# DID Profile Management System

Version: 2.0

Design Philosophy: Modern SaaS • Web3 Native • Minimal • Professional • Accessible

Target Platform:
- Desktop First
- Mobile Responsive
- Vercel Optimized
- Dark Mode First
- Light Mode Supported

---

# Table of Contents

1. Design Principles
2. Brand Identity
3. Color System
4. Typography
5. Spacing System
6. Grid System
7. Border Radius
8. Elevation & Shadows
9. Icons
10. Motion & Animation
11. Theme
12. Layout System
13. Components
14. Dashboard Design
15. Wallet Experience
16. AI Experience
17. Blockchain Experience
18. Forms
19. Data Tables
20. Empty States
21. Loading States
22. Error States
23. Responsive Design
24. Accessibility
25. Design Tokens
26. Future Improvements

---

# 1. Design Principles

The interface should feel:

- Professional
- Clean
- Trustworthy
- Developer-focused
- Enterprise-ready

Avoid unnecessary visual clutter.

Every screen should have one clear primary action.

Whitespace is preferred over decorative elements.

Animations should enhance usability rather than distract.

---

# 2. Brand Identity

Keywords

- Identity
- Trust
- Security
- Ownership
- Intelligence
- Simplicity

Visual Language

- Rounded interfaces
- Soft shadows
- Subtle gradients
- Clean cards
- Minimal borders
- Consistent spacing

---

# 3. Color System

## Dark Theme (Default)

Primary

#2563EB

Secondary

#7C3AED

Accent

#06B6D4

Success

#22C55E

Warning

#F59E0B

Danger

#EF4444

Background

#09090B

Surface

#18181B

Surface Elevated

#27272A

Border

#3F3F46

Text Primary

#FAFAFA

Text Secondary

#A1A1AA

Muted

#71717A

Divider

#27272A

---

## Light Theme

Background

#FFFFFF

Surface

#F8FAFC

Border

#E4E4E7

Text

#18181B

Secondary Text

#52525B

---

## Status Colors

Verified

Green

Pending

Amber

Rejected

Red

Draft

Gray

AI Improved

Blue

---

# 4. Typography

Primary Font

Geist

Fallback

Inter

Monospace

Geist Mono

Code

JetBrains Mono

Hierarchy

Display

48px

H1

36px

H2

30px

H3

24px

H4

20px

Body

16px

Small

14px

Caption

12px

Button

15px Medium

---

# 5. Spacing System

Base Unit

4px

Spacing Scale

4

8

12

16

20

24

32

40

48

64

96

128

Use consistent spacing throughout.

---

# 6. Grid System

Desktop

12 Columns

Tablet

8 Columns

Mobile

4 Columns

Maximum Width

1440px

Content Width

1280px

---

# 7. Border Radius

Small

8px

Medium

12px

Large

16px

Extra Large

24px

Pill

9999px

Cards should use 16px radius.

Buttons use 12px.

Badges use pill.

---

# 8. Elevation

Card

Soft shadow

Dropdown

Medium shadow

Modal

Large shadow

No heavy shadows.

Use subtle depth.

---

# 9. Icons

Use

Lucide React

Icon Size

16

20

24

32

Icons should always accompany important actions.

Never rely only on color.

---

# 10. Motion

Library

Framer Motion

Use

Fade

Slide

Scale

Layout animations

Page transitions

Hover

100ms

Click

80ms

Page Transition

250ms

Avoid excessive animation.

Respect reduced-motion preferences.

---

# 11. Theme

Dark Mode

Default

Light Mode

Supported

User preference stored.

Follow system preference on first visit.

---

# 12. Layout System

Application Layout

Sidebar

↓

Top Navigation

↓

Content

↓

Footer

---

Sidebar

Contains

Dashboard

Profile

Organizations

AI

Search

Notifications

Settings

---

Top Navigation

Contains

Search

Wallet

Notifications

Theme Switch

Profile Menu

---

# 13. Components

## Buttons

Primary

Secondary

Outline

Ghost

Danger

Loading

Icon

Floating

---

## Cards

Profile Card

Wallet Card

AI Card

Statistics Card

Activity Card

Notification Card

Verification Card

Organization Card

Upload Card

Analytics Card

---

## Badges

Verified

Pending

Rejected

Premium

AI

Organization

Admin

---

## Inputs

Text

Textarea

Select

Combobox

Checkbox

Radio

Switch

File Upload

Date Picker

Tags Input

---

## Dialogs

Confirmation

Delete

Upload

Wallet

Settings

AI Suggestions

---

## Navigation

Breadcrumb

Tabs

Sidebar

Dropdown

Pagination

---

# 14. Dashboard Design

Dashboard should display

Profile Completion

AI Score

Verification Status

Wallet Information

Recent Activity

Storage Usage

Notifications

Quick Actions

Analytics

Profile Views

Recent Uploads

Use cards with consistent spacing.

---

# 15. Wallet Experience

Wallet Card

Displays

Address

ENS

Network

Balance

Verification

Buttons

Connect

Disconnect

Copy

Explorer

Switch Network

Transaction History

---

# 16. AI Experience

Dedicated AI Panel

Displays

Profile Score

Suggestions

Grammar

Missing Skills

Recommendations

Resume Review

Professional Summary

Every suggestion

Accept

Reject

Copy

Regenerate

---

# 17. Blockchain Experience

Verification Card

Displays

Wallet

Chain

Transaction

Block

CID

Verification Timestamp

Explorer Link

Smart Contract Status

Transaction states

Pending

Confirmed

Failed

---

# 18. Forms

Use React Hook Form.

Validation

Real-time

Inline errors

Helpful messages

Auto focus invalid field.

Never clear form after validation failure.

---

# 19. Tables

Use TanStack Table.

Features

Sorting

Filtering

Pagination

Column Visibility

Responsive

Sticky Header

Search

---

# 20. Empty States

Every empty screen should include

Illustration

Description

Primary Action

Examples

No Profiles

No Notifications

No Uploads

No Organizations

No Search Results

---

# 21. Loading States

Use Skeletons.

Avoid spinners where possible.

Loading

Cards

Profile

Dashboard

Tables

Forms

Images

---

# 22. Error States

Show

Title

Description

Retry Button

Support Link

Never expose internal errors.

---

# 23. Responsive Design

Desktop

1440+

Laptop

1280

Tablet

768

Mobile

480

Sidebar

Desktop

Expanded

Tablet

Collapsed

Mobile

Drawer

Cards

Desktop

Multiple columns

Mobile

Single column

---

# 24. Accessibility

Follow WCAG 2.2 AA

Keyboard Navigation

Required

ARIA Labels

Required

Focus Indicators

Visible

Contrast Ratio

AA compliant

Screen Reader Support

Required

Reduced Motion

Supported

---

# 25. Design Tokens

Colors

Primary

Secondary

Accent

Background

Surface

Border

Typography

Display

Heading

Body

Caption

Spacing

4

8

12

16

20

24

32

48

64

Radius

8

12

16

24

9999

Animation

Fast

100ms

Medium

200ms

Slow

300ms

Shadow

Small

Medium

Large

---

# 26. Page Designs

Landing Page

- Hero Section
- Features
- AI Showcase
- Blockchain Showcase
- Pricing (Future)
- FAQ
- Footer

Authentication

- Wallet Connect
- SIWE
- Terms
- Privacy

Dashboard

- Analytics
- Profile
- AI
- Wallet
- Activity

Profile

- Overview
- Education
- Experience
- Skills
- Portfolio
- Certificates
- Social Links

Organizations

- Members
- Roles
- Credentials

Search

- Filters
- Results
- Public Profiles

Settings

- Account
- Wallet
- Privacy
- Appearance
- Notifications

---

# 27. Illustrations

Use minimal SVG illustrations.

Prefer Lucide icons.

Avoid stock photography.

Avoid decorative 3D assets.

Use subtle blockchain-inspired patterns where appropriate.

---

# 28. Future Design Improvements

- Glassmorphism for selected dashboard cards
- Command Palette (⌘K / Ctrl+K)
- AI Chat Assistant Sidebar
- Multi-workspace support
- Organization branding
- Custom themes
- Profile sharing pages
- Public developer profiles
- Interactive blockchain activity timeline

---

# Final Design Principles

The application should resemble a modern developer platform rather than a traditional Web3 dApp.

Prioritize clarity over visual complexity.

Every interaction should communicate trust, ownership, and professionalism.

Maintain consistency across all screens using shared components, design tokens, and spacing.

The interface should feel native on desktop while remaining fully responsive on tablets and mobile devices.

All UI components must be built using shadcn/ui, styled with Tailwind CSS v4, animated with Framer Motion, and follow the architecture and engineering rules defined in the accompanying project documents.