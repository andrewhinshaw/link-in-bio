-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_userId_fkey";

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "userLinkPageId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasUserLinkPage" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserLinkPage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLinkPage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserLinkPage" ADD CONSTRAINT "UserLinkPage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userLinkPageId_fkey" FOREIGN KEY ("userLinkPageId") REFERENCES "UserLinkPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
