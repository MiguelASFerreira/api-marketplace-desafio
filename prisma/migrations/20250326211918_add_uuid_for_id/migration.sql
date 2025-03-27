/*
  Warnings:

  - The primary key for the `_AttachmentToProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_AttachmentToProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_AttachmentToProduct" DROP CONSTRAINT "_AttachmentToProduct_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_AttachmentToProduct_AB_unique" ON "_AttachmentToProduct"("A", "B");
