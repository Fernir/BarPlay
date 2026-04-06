/*
  Warnings:

  - You are about to drop the `View` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "View" DROP CONSTRAINT "View_songId_fkey";

-- DropForeignKey
ALTER TABLE "View" DROP CONSTRAINT "View_userId_fkey";

-- DropTable
DROP TABLE "View";

-- CreateTable
CREATE TABLE "IpView" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IpView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IpView_songId_idx" ON "IpView"("songId");

-- CreateIndex
CREATE INDEX "IpView_ip_idx" ON "IpView"("ip");

-- CreateIndex
CREATE INDEX "IpView_createdAt_idx" ON "IpView"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "IpView_songId_ip_key" ON "IpView"("songId", "ip");

-- AddForeignKey
ALTER TABLE "IpView" ADD CONSTRAINT "IpView_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
