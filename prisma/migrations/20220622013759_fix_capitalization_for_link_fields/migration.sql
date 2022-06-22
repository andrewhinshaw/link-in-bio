/*
  Warnings:

  - You are about to drop the column `link_type` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `link_url` on the `Link` table. All the data in the column will be lost.
  - Added the required column `linkType` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkUrl` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "link_type",
DROP COLUMN "link_url",
ADD COLUMN     "linkType" TEXT NOT NULL,
ADD COLUMN     "linkUrl" TEXT NOT NULL;
