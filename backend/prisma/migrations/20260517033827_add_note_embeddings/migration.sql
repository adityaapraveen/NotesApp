-- CreateTable
CREATE TABLE "note_embeddings" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "dimension" INTEGER NOT NULL,
    "vector" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "note_embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "note_embeddings_noteId_key" ON "note_embeddings"("noteId");

-- CreateIndex
CREATE INDEX "note_embeddings_noteId_idx" ON "note_embeddings"("noteId");

-- AddForeignKey
ALTER TABLE "note_embeddings" ADD CONSTRAINT "note_embeddings_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
