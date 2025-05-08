/*
  Warnings:

  - You are about to drop the column `authorId` on the `Like` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_authorId_fkey";

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "authorId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
