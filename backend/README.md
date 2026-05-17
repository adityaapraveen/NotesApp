# Notes Memory Graph Backend

A multi-user notes backend built with Express, PostgreSQL, Prisma, JWT auth, note sharing, search, OpenAPI docs, and an embeddings-powered memory graph.

## Features

- User registration
- User login with JWT
- Create, read, update, delete notes
- Share notes with another user
- Search accessible notes
- Pagination support
- OpenAPI JSON at `/openapi.json`
- About endpoint at `/about`
- Hugging Face embeddings
- Memory Graph for related notes
- Docker support

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Zod
- Docker
- Hugging Face Inference API

## Local Setup

```bash
npm install