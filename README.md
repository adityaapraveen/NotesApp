# Notes Memory Graph Backend

A production-style backend for a multi-user notes application built with Node.js, Express, PostgreSQL, Prisma ORM, JWT authentication, note sharing, search, OpenAPI documentation, Docker support, and an embeddings-powered Memory Graph feature.

This project was built for the Notes App backend assignment. The backend exposes REST APIs for user registration, authentication, CRUD operations on notes, note sharing, API documentation, and a custom meaningful feature.

---

## Live API

Base URL:

```txt
https://notes-memory-graph-backend.onrender.com
```

The assignment evaluator can call the API by appending paths to the base URL:

```txt
/about
/login
/register
/notes
/openapi.json
```

Example:

```txt
https://notes-memory-graph-backend.onrender.com/about
```

---

## Important Note About Rate Limiting

Rate limiters have been disabled for the deployed assignment version so that automated testing does not fail due to repeated API calls.

In a real production environment, rate limiting should be enabled again, especially for sensitive routes such as:

```txt
POST /login
POST /register
```

The project was originally designed with separate rate limiters for general routes and authentication routes, but they are disabled for assignment compatibility and smoother automated evaluation.

---

## Project Overview

This backend powers a multi-user notes service similar to a lightweight version of Google Keep or Apple Notes.

Users can:

- Register a new account
- Login and receive a JWT access token
- Create personal notes
- View their notes
- View a specific note
- Update their own notes
- Delete their own notes
- Share notes with another user by email
- Search notes
- Explore semantically related notes through a Memory Graph

---

## Tech Stack

```txt
Runtime: Node.js
Framework: Express.js
Language: JavaScript with ES Modules
Database: PostgreSQL
ORM: Prisma ORM
Authentication: JWT Bearer Token
Password Hashing: bcryptjs
Validation: Zod
AI Embeddings: Hugging Face Inference API
Embedding Model: sentence-transformers/all-MiniLM-L6-v2
Containerization: Docker
Deployment Target: Render
API Documentation: OpenAPI 3.0 JSON
```

---

## API Documentation

```http
GET /openapi.json
```

Returns the OpenAPI 3.0 JSON specification for the exposed API endpoints.

This makes the backend easier to test, inspect, and integrate with frontend clients or API testing tools.

---

## About Endpoint

```http
GET /about
```

Returns project and feature information.

Example response:

```json
{
  "name": "Aditya Praveen",
  "email": "adityaapraveenn18@gmail.com",
  "my features": {
    "Memory Graph": "Automatically connects related notes using embeddings and vector similarity. I chose this because it turns a normal notes app into a second-brain style knowledge system where users can discover relationships between their ideas. It also creates a foundation for future features like semantic search, RAG, personalized knowledge retrieval, and intelligent note recommendations.",
    "Pagination": "Keeps the notes API efficient by loading notes in smaller chunks instead of returning everything at once. I chose this to make the backend more scalable as user data grows.",
    "Full-text Search": "Helps users quickly find notes by searching across titles and content. I chose this because search becomes essential once users have many notes.",
    "Docker": "Makes the backend easier to run and deploy consistently. I chose this to reduce environment issues and make the project more production-ready."
  }
}
```

---

## Stretch Goals Implemented

### Pagination

```http
GET /notes?page=1&limit=10
```

Pagination prevents the API from returning too much data at once and makes the backend more scalable as the number of notes grows.

---

### Full-text Search

```http
GET /search?q=jwt
```

Searches across accessible notes by title and content.

Requires:

```txt
Authorization: Bearer <access_token>
```

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "JWT auth",
      "content": "JWT authentication uses access tokens and refresh tokens.",
      "created_at": "datetime",
      "updated_at": "datetime",
      "access": "owner",
      "owner": {
        "id": "uuid",
        "email": "user@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

Search respects authorization. Users can only search notes they own or notes shared with them.

---

### Docker Support

The backend includes Docker support for local development and consistent deployment.

Docker files are inside the backend folder:

```txt
backend/
  Dockerfile
  docker-compose.yml
  .dockerignore
```

Run with Docker:

```bash
docker compose up --build
```

The backend runs on:

```txt
http://localhost:5000
```

The Docker PostgreSQL instance is exposed on host port:

```txt
5433
```

The backend container connects to PostgreSQL internally using:

```txt
postgres:5432
```

---

## Special Feature: Memory Graph

The main custom feature in this project is the **Memory Graph**.

A normal notes app stores isolated notes. The Memory Graph makes the notes connected.

When a user creates or updates a note:

1. The backend sends the note title and content to the Hugging Face embedding model.
2. The model converts the note into a vector embedding.
3. The backend compares this embedding with other note embeddings using cosine similarity.
4. If two notes are semantically similar, a connection is created.
5. The user can fetch these connections as a graph.

This turns the notes app into a second-brain style knowledge system.

---

### Memory Graph Endpoint

```http
GET /notes/graph
```

Requires:

```txt
Authorization: Bearer <access_token>
```

Response:

```json
{
  "nodes": [
    {
      "id": "uuid",
      "title": "JWT auth",
      "preview": "JWT authentication uses signed access tokens...",
      "access": "owner",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ],
  "edges": [
    {
      "id": "uuid",
      "source": "uuid",
      "target": "uuid",
      "strength": 0.8123,
      "reason": "These notes are semantically related based on their embeddings."
    }
  ]
}
```

---

### Rebuild Graph for a Note

```http
POST /notes/:id/graph/rebuild
```

Manually rebuilds semantic connections for a specific note.

Requires:

```txt
Authorization: Bearer <access_token>
```

Response:

```json
{
  "message": "Memory graph rebuilt successfully",
  "note_id": "uuid",
  "connections_created": 2,
  "connections": [
    {
      "note_id": "uuid",
      "title": "Refresh tokens",
      "strength": 0.8123,
      "reason": "These notes are semantically related based on their embeddings."
    }
  ]
}
```

---

## Why Memory Graph Is Useful

The Memory Graph is useful because it helps users discover relationships between their own ideas.

For example, a user may have separate notes called:

```txt
JWT auth
Refresh tokens
Session management
Cookie security
```

Even if these notes were written at different times, the Memory Graph can detect that they are related and connect them.

This helps with:

- Revisiting related ideas
- Discovering forgotten context
- Building a personal knowledge base
- Understanding how concepts connect
- Reducing duplicated notes
- Turning scattered information into structured knowledge

---

## Future Features Enabled by Memory Graph

The Memory Graph is not only a visual feature. It creates a strong foundation for several advanced features.

### Semantic Search

Instead of searching exact keywords, users could search by meaning.

Example:

```txt
How do I keep users logged in securely?
```

This could return notes about:

```txt
Refresh tokens
JWT expiry
Session cookies
Authentication lifecycle
```

even if the exact words are not present.

---

### RAG-Based Question Answering

The stored embeddings can be used to build a RAG system.

A user could ask:

```txt
What have I written about authentication security?
```

The backend could:

1. Embed the user question
2. Find the most relevant notes
3. Send the relevant notes to an LLM
4. Return a grounded answer based on the user's own notes

---

### Intelligent Note Recommendations

When the user writes a new note, the system could recommend related notes.

Example:

```txt
You may also want to revisit:
- Refresh token rotation
- Cookie based auth
- JWT expiration strategy
```

---

### Duplicate Note Detection

The same vector similarity system can detect when two notes are nearly identical.

This can help users merge repeated notes or clean up their workspace.

---

### Personalized Knowledge Retrieval

The system can learn the user's knowledge patterns from their notes without exposing private notes to other users.

For example, it can understand that a user often writes about:

```txt
Backend architecture
Authentication
System design
AI workflows
Database modeling
```

This can later support more personalized search, recommendations, and note organization.

---

### Topic Clustering

The backend can group notes into clusters such as:

```txt
Authentication
Databases
AI
Deployment
System Design
```

This could power automatic folders or smart collections.

---

## System Design Principles Used

### Layered Architecture

The backend is organized into clear layers:

```txt
routes -> controllers -> services -> database
```

This keeps the code easier to maintain and test.

Routes define API paths.

Controllers handle request and response logic.

Services contain business logic.

Prisma handles database access.

---

### Separation of Concerns

Authentication, validation, database logic, error handling, embeddings, and graph building are separated into different files.

This avoids large, hard-to-maintain files and keeps each module focused.

---

### Centralized Validation

Zod is used to validate request bodies, params, and query strings.

This protects the API from invalid input such as:

- Invalid email
- Empty title
- Invalid UUID
- Invalid pagination values

---

### Centralized Error Handling

The app uses a global error middleware.

This keeps error responses consistent across the API.

Example:

```json
{
  "message": "Note not found"
}
```

In production, stack traces are hidden to avoid exposing internal implementation details.

---

### Authentication and Authorization

Authentication verifies who the user is.

Authorization verifies what the user is allowed to do.

Rules:

- Owner can create, read, update, delete, and share a note.
- Shared user can only read the note.
- Shared user cannot update, delete, or share the note.
- Users cannot access notes they do not own or that were not shared with them.

---

### Soft Delete

Notes are not permanently deleted from the database.

Instead, the backend sets:

```txt
deletedAt = current date
```

This allows future features like:

- Trash
- Restore note
- Audit history
- Recovery from accidental delete

---

### Database Constraints

The database enforces important rules.

For example, `NoteShare` has a unique constraint on:

```txt
noteId + sharedWithUserId
```

This prevents the same note from being shared with the same user multiple times.

---

### Graceful AI Failure

Embedding generation is useful, but it should not break core note creation.

If Hugging Face fails, the backend still creates or updates the note.

This makes the system more reliable.

---

## Database Models

### User

Stores registered users.

```txt
id
email
passwordHash
createdAt
updatedAt
```

---

### Note

Stores user notes.

```txt
id
title
content
ownerId
deletedAt
createdAt
updatedAt
```

---

### NoteShare

Stores note sharing permissions.

```txt
id
noteId
sharedWithUserId
createdAt
```

---

### NoteEmbedding

Stores note embeddings generated from title and content.

```txt
id
noteId
model
dimension
vector
createdAt
updatedAt
```

The vector is stored as JSON for portability across free PostgreSQL providers.

---

### NoteConnection

Stores semantic connections between related notes.

```txt
id
sourceNoteId
targetNoteId
strength
reason
createdAt
updatedAt
```

---





## Required Assignment Endpoints

```txt
POST /register
POST /login
GET /notes
GET /notes/:id
POST /notes
PUT /notes/:id
DELETE /notes/:id
POST /notes/:id/share
GET /openapi.json
GET /about
```

---

## Additional Endpoints

```txt
GET /health
GET /search?q=keyword
GET /notes/graph
POST /notes/:id/graph/rebuild
```

---

## Security Notes

This project includes:

- Password hashing with bcryptjs
- JWT Bearer token authentication
- Authorization checks for owned and shared notes
- Input validation using Zod
- Soft delete for notes
- Production-safe error responses
- Environment variable based secrets

For assignment compatibility, rate limiters have been disabled in the deployed version. In a real production setup, they should be enabled again.

---

## Author

```txt
Name: Aditya Praveen
Email: adityaapraveen18@gmail.com
```