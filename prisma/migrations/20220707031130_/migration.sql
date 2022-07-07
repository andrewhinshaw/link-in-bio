/*
  Warnings:

  - You are about to drop the column `linkType` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `linkUrl` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "linkType",
DROP COLUMN "linkUrl",
ADD COLUMN     "displayText" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "url" TEXT NOT NULL DEFAULT E'';
