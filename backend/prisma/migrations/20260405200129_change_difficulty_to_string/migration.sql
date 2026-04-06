-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_authorId_fkey";

-- CreateTable
CREATE TABLE "View" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "View_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "View_userId_idx" ON "View"("userId");

-- CreateIndex
CREATE INDEX "View_songId_idx" ON "View"("songId");

-- CreateIndex
CREATE INDEX "View_createdAt_idx" ON "View"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "View_userId_songId_key" ON "View"("userId", "songId");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
