export const openApiDocument = {
    openapi: "3.0.3",

    info: {
        title: "Notes Memory Graph API",
        version: "1.0.0",
        description:
            "A multi-user notes backend with authentication, CRUD notes, note sharing, search, and memory graph support."
    },

    servers: [
        {
            url: "http://localhost:5000",
            description: "Local development server"
        }
    ],

    tags: [
        {
            name: "Meta",
            description: "Health, about, and API documentation"
        },
        {
            name: "Auth",
            description: "User registration and login"
        },
        {
            name: "Notes",
            description: "Create, read, update, delete, and share notes"
        },
        {
            name: "Search",
            description: "Search accessible notes"
        }
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },

        schemas: {
            ErrorResponse: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Something went wrong"
                    }
                }
            },

            ValidationErrorResponse: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Validation failed"
                    },
                    details: {
                        type: "object"
                    }
                }
            },

            RegisterRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: {
                        type: "string",
                        format: "email",
                        example: "user@example.com"
                    },
                    password: {
                        type: "string",
                        minLength: 8,
                        example: "password123"
                    }
                }
            },

            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: {
                        type: "string",
                        format: "email",
                        example: "user@example.com"
                    },
                    password: {
                        type: "string",
                        example: "password123"
                    }
                }
            },

            LoginResponse: {
                type: "object",
                properties: {
                    access_token: {
                        type: "string",
                        example: "jwt_token_here"
                    }
                }
            },

            UserResponse: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        format: "uuid"
                    },
                    email: {
                        type: "string",
                        format: "email"
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time"
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time"
                    }
                }
            },

            RegisterResponse: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "User registered successfully"
                    },
                    user: {
                        $ref: "#/components/schemas/UserResponse"
                    }
                }
            },

            NoteRequest: {
                type: "object",
                required: ["title", "content"],
                properties: {
                    title: {
                        type: "string",
                        example: "JWT auth"
                    },
                    content: {
                        type: "string",
                        example:
                            "JWT authentication uses signed access tokens and refresh tokens."
                    }
                }
            },

            NoteResponse: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        format: "uuid"
                    },
                    title: {
                        type: "string"
                    },
                    content: {
                        type: "string"
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time"
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time"
                    }
                }
            },

            AccessibleNoteResponse: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        format: "uuid"
                    },
                    title: {
                        type: "string"
                    },
                    content: {
                        type: "string"
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time"
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time"
                    },
                    access: {
                        type: "string",
                        enum: ["owner", "shared"]
                    }
                }
            },

            NoteListItem: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        format: "uuid"
                    },
                    title: {
                        type: "string"
                    },
                    content: {
                        type: "string"
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time"
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time"
                    },
                    access: {
                        type: "string",
                        enum: ["owner", "shared"]
                    },
                    owner: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                format: "uuid"
                            },
                            email: {
                                type: "string",
                                format: "email"
                            }
                        }
                    }
                }
            },

            PaginationMeta: {
                type: "object",
                properties: {
                    page: {
                        type: "integer",
                        example: 1
                    },
                    limit: {
                        type: "integer",
                        example: 10
                    },
                    total: {
                        type: "integer",
                        example: 42
                    },
                    totalPages: {
                        type: "integer",
                        example: 5
                    }
                }
            },

            PaginatedNotesResponse: {
                type: "object",
                properties: {
                    data: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/NoteListItem"
                        }
                    },
                    pagination: {
                        $ref: "#/components/schemas/PaginationMeta"
                    }
                }
            },

            ShareNoteRequest: {
                type: "object",
                required: ["share_with_email"],
                properties: {
                    share_with_email: {
                        type: "string",
                        format: "email",
                        example: "reader@example.com"
                    }
                }
            },

            ShareNoteResponse: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Note shared successfully"
                    },
                    note: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                format: "uuid"
                            },
                            title: {
                                type: "string"
                            }
                        }
                    },
                    shared_with: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                format: "uuid"
                            },
                            email: {
                                type: "string",
                                format: "email"
                            }
                        }
                    }
                }
            },

            AboutResponse: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        example: "Aditya Praveen"
                    },
                    email: {
                        type: "string",
                        example: "adityaapraveenn18@gmail.com"
                    },
                    "my features": {
                        type: "object",
                        additionalProperties: {
                            type: "string"
                        }
                    }
                }
            }
        }
    },

    paths: {
        "/health": {
            get: {
                tags: ["Meta"],
                summary: "Health check",
                responses: {
                    200: {
                        description: "Server is healthy"
                    }
                }
            }
        },

        "/about": {
            get: {
                tags: ["Meta"],
                summary: "About this project",
                responses: {
                    200: {
                        description: "Project and feature information",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AboutResponse"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/openapi.json": {
            get: {
                tags: ["Meta"],
                summary: "OpenAPI specification",
                responses: {
                    200: {
                        description: "OpenAPI 3.0 JSON document"
                    }
                }
            }
        },

        "/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/RegisterRequest"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "User registered successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/RegisterResponse"
                                }
                            }
                        }
                    },
                    400: {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ValidationErrorResponse"
                                }
                            }
                        }
                    },
                    409: {
                        description: "User already exists",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/login": {
            post: {
                tags: ["Auth"],
                summary: "Login user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/LoginRequest"
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Login successful",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/LoginResponse"
                                }
                            }
                        }
                    },
                    401: {
                        description: "Invalid email or password",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                },
                                example: {
                                    message: "Invalid email or password"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/notes": {
            get: {
                tags: ["Notes"],
                summary: "Get all accessible notes",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        schema: {
                            type: "integer",
                            default: 1
                        }
                    },
                    {
                        name: "limit",
                        in: "query",
                        required: false,
                        schema: {
                            type: "integer",
                            default: 10,
                            maximum: 50
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Paginated list of owned and shared notes",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PaginatedNotesResponse"
                                }
                            }
                        }
                    },
                    401: {
                        description: "Unauthorized"
                    }
                }
            },

            post: {
                tags: ["Notes"],
                summary: "Create a new note",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/NoteRequest"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Note created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/NoteResponse"
                                }
                            }
                        }
                    },
                    401: {
                        description: "Unauthorized"
                    }
                }
            }
        },

        "/notes/{id}": {
            get: {
                tags: ["Notes"],
                summary: "Get a specific accessible note by id",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Note found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AccessibleNoteResponse"
                                }
                            }
                        }
                    },
                    404: {
                        description: "Note not found"
                    }
                }
            },

            put: {
                tags: ["Notes"],
                summary: "Update an owned note",
                description:
                    "Only the owner can update a note. Shared users have read-only access.",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/NoteRequest"
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Note updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/NoteResponse"
                                }
                            }
                        }
                    },
                    404: {
                        description: "Note not found"
                    }
                }
            },

            delete: {
                tags: ["Notes"],
                summary: "Delete an owned note",
                description:
                    "Only the owner can delete a note. Delete is implemented as soft delete.",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                ],
                responses: {
                    204: {
                        description: "Note deleted successfully"
                    },
                    404: {
                        description: "Note not found"
                    }
                }
            }
        },

        "/notes/{id}/share": {
            post: {
                tags: ["Notes"],
                summary: "Share an owned note with another user",
                description:
                    "Only the owner can share a note. The shared user can read the note but cannot update or delete it.",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ShareNoteRequest"
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Note shared successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ShareNoteResponse"
                                }
                            }
                        }
                    },
                    400: {
                        description: "Cannot share note with yourself"
                    },
                    404: {
                        description: "Note or user not found"
                    },
                    409: {
                        description: "Note already shared with this user"
                    }
                }
            }
        },

        "/search": {
            get: {
                tags: ["Search"],
                summary: "Search accessible notes",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: "q",
                        in: "query",
                        required: true,
                        schema: {
                            type: "string",
                            example: "jwt"
                        }
                    },
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        schema: {
                            type: "integer",
                            default: 1
                        }
                    },
                    {
                        name: "limit",
                        in: "query",
                        required: false,
                        schema: {
                            type: "integer",
                            default: 10,
                            maximum: 50
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Paginated matching notes",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PaginatedNotesResponse"
                                }
                            }
                        }
                    },
                    400: {
                        description: "Validation error"
                    },
                    401: {
                        description: "Unauthorized"
                    }
                }
            }
        }
    }
};