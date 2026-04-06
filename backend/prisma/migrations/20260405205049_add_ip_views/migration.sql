/*
  Warnings:

  - You are about to drop the `IpView` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IpView" DROP CONSTRAINT "IpView_songId_fkey";

-- DropTable
DROP TABLE "IpView";

-- CreateTable
CREATE TABLE "View" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "View_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "View_songId_idx" ON "View"("songId");

-- CreateIndex
CREATE INDEX "View_ip_idx" ON "View"("ip");

-- CreateIndex
CREATE INDEX "View_createdAt_idx" ON "View"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "View_songId_ip_key" ON "View"("songId", "ip");

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
