-- CreateTable
CREATE TABLE "note_connections" (
    "id" TEXT NOT NULL,
    "sourceNoteId" TEXT NOT NULL,
    "targetNoteId" TEXT NOT NULL,
    "strength" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "note_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "note_connections_sourceNoteId_idx" ON "note_connections"("sourceNoteId");

-- CreateIndex
CREATE INDEX "note_connections_targetNoteId_idx" ON "note_connections"("targetNoteId");

-- CreateIndex
CREATE UNIQUE INDEX "note_connections_sourceNoteId_targetNoteId_key" ON "note_connections"("sourceNoteId", "targetNoteId");

-- AddForeignKey
ALTER TABLE "note_connections" ADD CONSTRAINT "note_connections_sourceNoteId_fkey" FOREIGN KEY ("sourceNoteId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_connections" ADD CONSTRAINT "note_connections_targetNoteId_fkey" FOREIGN KEY ("targetNoteId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
