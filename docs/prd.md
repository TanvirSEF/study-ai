# 📚 StudyAI - Product Requirement Document (PRD)

## AI-Powered Personalized Learning Assistant

**Version:** 1.0
**Architecture:** Monolith-Ready Next.js 15 Full-Stack Application
**Target Audience:** Students, Researchers, and Lifelong Learners

---

# 1. Executive Summary

StudyAI is an all-in-one AI-powered educational platform designed to make learning faster, easier, and more productive.

The platform provides intelligent tools including:

* ✍️ English Grammar Correction
* ➗ Step-by-Step Math Explanation
* 📄 Smart Notes Summarization
* 💬 AI Tutor Chat Assistant

The application should provide an extremely modern, minimal, and responsive user experience while maintaining conversation history and usage tracking.

---

# 2. Core Product Goals

## Simplicity

* Clean and minimalist UI
* Easy navigation
* Beginner-friendly experience

---

## Speed

* Fast page transitions
* AI response time under 3 seconds whenever possible
* Optimized Server Actions

---

## Context Retention

Users should be able to:

* View previous AI outputs
* Search history
* Delete history
* Continue AI conversations

---

# 3. Technology Stack

## Frontend

* Next.js 15 (App Router)
* TypeScript
* Server Components
* Server Actions

---

## Styling

* Tailwind CSS
* Shadcn UI
* Framer Motion

---

## Database

* MongoDB Atlas
* Mongoose ORM

---

## Authentication

* Custom Email + Password Authentication
* JWT-Based Session
* Secure HTTP-Only Cookies

No OAuth or Google Login.

---

## AI Integration

OpenAI API

Recommended models:

* GPT-4o
* GPT-4o-mini (cost optimized)

---

## Deployment

Frontend:

* Vercel

Database:

* MongoDB Atlas

---

# 4. Functional Requirements

---

# Feature 1 — Authentication

## Description

Users can register and login using email and password.

## Requirements

* Email registration
* Password login
* Password hashed using bcryptjs
* JWT generation after login
* JWT stored inside Secure HTTP-Only Cookie
* Middleware protects `/dashboard/*`

---

# Feature 2 — Dashboard

After login, users arrive at a central dashboard.

## Components

### Sidebar

Navigation items:

* Dashboard
* Grammar
* Math
* Summary
* AI Chat
* History
* Settings

---

### Quick Action Cards

Beautiful cards with hover animations:

* Grammar Fixer
* Math Explain
* Notes Summary
* AI Tutor

---

### Usage Widget

Displays:

```
12 / 20 Requests Used Today
```

Progress bar updates automatically.

---

# Feature 3 — AI Grammar Fixer

## Description

Correct English grammar and explain mistakes.

## UI

* Large Textarea
* Fix Grammar Button

---

## AI System Prompt

```
You are an expert English Grammarian.

Fix the input text.

Provide the corrected version under:

[CORRECTED]

Then explain the changes under:

[EXPLANATION]

Use concise bullet points.
```

---

## Actions

* Copy
* Save History
* Regenerate

---

# Feature 4 — Math Explainer

## Description

Solve mathematical problems step-by-step.

Supports:

* Algebra
* Arithmetic
* Calculus
* General Mathematics

---

## UI

* Text Input
* LaTeX Input Support

---

## AI Response Format

```
Step 1

Explanation...

Step 2

Explanation...

Step 3

Explanation...

Concept Note

(Simple explanation)
```

---

## Rendering

Support:

* Markdown
* Math Formatting
* LaTeX Rendering

---

# Feature 5 — Notes Summarizer

## Description

Summarize long notes or articles.

Maximum Input:

* 2000 words

---

## Output Structure

### Short Summary

2–3 line overview.

---

### Key Bullet Points

* Important point
* Important point
* Important point

---

### Exam Tips

* Key takeaways
* Important facts
* Revision hints

---

# Feature 6 — AI Tutor Chat

## Description

Interactive AI conversation interface.

---

## Requirements

* Session-based chat
* Context memory
* Scrollable conversation
* Chat bubbles
* Auto scroll
* Streaming response effect

---

# Feature 7 — History & Usage Tracking

Every AI output should be stored.

Users can:

* Search history
* View history
* Delete history

---

## Rate Limiting

Free Plan:

```
20 Requests Per Day
```

Every AI request updates Usage collection.

---

# 5. UI/UX Design System

## Color Palette

Primary

```
#1E40AF
```

Deep Scholar Blue

---

Accent

```
#7C3AED
```

Vibrant Purple

---

Light Background

```
#F8FAFC
```

Soft Gray

---

Dark Background

```
#0F172A
```

Midnight Slate

---

## Card Style

* Rounded XL
* Glassmorphism
* Thin Border
* Soft Shadow

---

## Typography

Main Font:

* Inter
* Geist Sans

Math / Code:

* Monospace

---

# 6. Animation Guidelines

Using Framer Motion.

---

## Page Transition

```
initial={{
 opacity:0,
 y:10
}}
```

Fade + Slide animation.

---

## Hover

```
whileHover={{
 scale:1.02
}}
```

3D lift effect.

---

## Loading State

Use:

* Skeleton Loader
* Shimmer Animation

Avoid plain text loaders.

---

# 7. Database Design

## User Schema

```ts
{
 name: String,
 email: String,
 password: String,
 createdAt: Date
}
```

---

## History Schema

```ts
{
 userId:ObjectId,
 toolType:String,
 title:String,
 prompt:String,
 response:String,
 createdAt:Date
}
```

Tool Types:

* grammar
* math
* summary
* chat

---

## Usage Schema

```ts
{
 userId:ObjectId,
 totalRequests:Number,
 todayRequests:Number,
 lastRequestDate:String
}
```

Date format:

```
YYYY-MM-DD
```

---

# 8. Project Structure

```text
src/

app/
│
├── page.tsx
├── layout.tsx
│
├── (auth)
│ ├── login/page.tsx
│ └── signup/page.tsx
│
└── dashboard
├── layout.tsx
├── page.tsx
├── grammar/page.tsx
├── math/page.tsx
├── summary/page.tsx
├── chat/page.tsx
├── history/page.tsx
└── settings/page.tsx

components/
├── ui/
├── shared/
│ ├── Sidebar.tsx
│ └── Topbar.tsx
└── dashboard/

lib/
├── db.ts
├── jwt.ts
└── openai.ts

middleware.ts

models/

types/
```

---

# 9. Security Requirements

* Never store plain passwords
* Hash passwords with bcryptjs
* Store JWT secret in `.env.local`
* Secure HTTP-Only Cookie
* Protected dashboard routes
* Server Actions for AI calls
* Prevent API key exposure

---

# 10. Performance Requirements

* Fast page load
* Optimized bundle size
* Cached Mongo connection
* Streaming AI response
* Responsive UI
* Mobile friendly

---

# 11. Future Roadmap

* PDF Upload & Summarization
* OCR Image to Notes
* Flashcard Generator
* Quiz Generator
* Voice AI Tutor
* Multi-language Support
* Premium Subscription
* Team Workspace
* Study Planner
* AI Exam Generator

---

# 12. AI Coding Instructions

When implementing this project:

1. Build utility files first (`lib/db.ts`, `middleware.ts`, `jwt.ts`).
2. Complete backend authentication.
3. Implement secure JWT cookie sessions.
4. Build layouts and shared components.
5. Develop dashboard.
6. Build AI tools one-by-one.
7. Implement history tracking.
8. Add daily usage limiter.
9. Optimize streaming AI responses.
10. Ensure all UI follows the minimalist educational design system.

---

# Final Vision

StudyAI should feel like a modern AI-powered study companion that combines Grammarly, ChatGPT, Notion AI, and Photomath into one clean, fast, and beautiful learning platform built with Next.js 15.
