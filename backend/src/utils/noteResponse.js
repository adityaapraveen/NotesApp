export const mapNoteResponse = (note) => ({
    id: note.id,
    title: note.title,
    content: note.content,
    created_at: note.createdAt,
    updated_at: note.updatedAt
});

export const mapAccessibleNoteResponse = (note, userId) => ({
    ...mapNoteResponse(note),
    access: note.ownerId === userId ? "owner" : "shared"
});

export const mapNoteListItemResponse = (note, userId) => ({
    ...mapAccessibleNoteResponse(note, userId),
    owner: {
        id: note.owner.id,
        email: note.owner.email
    }
});
