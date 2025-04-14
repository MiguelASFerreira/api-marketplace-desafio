/*
  Warnings:

  - You are about to drop the `_AttachmentToProduct` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `attachments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_AttachmentToProduct" DROP CONSTRAINT "_AttachmentToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_AttachmentToProduct" DROP CONSTRAINT "_AttachmentToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_avatar_id_fkey";

-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "product_id" TEXT,
ADD COLUMN     "user_id" TEXT;

-- DropTable
DROP TABLE "_AttachmentToProduct";

-- CreateIndex
CREATE UNIQUE INDEX "attachments_user_id_key" ON "attachments"("user_id");

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
