/*
  Warnings:

  - You are about to drop the column `userLinkPageId` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `hasUserLinkPage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserLinkPage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_userLinkPageId_fkey";

-- DropForeignKey
ALTER TABLE "UserLinkPage" DROP CONSTRAINT "UserLinkPage_userId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "userLinkPageId",
ADD COLUMN     "pageId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hasUserLinkPage",
ADD COLUMN     "hasPage" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "UserLinkPage";

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;
