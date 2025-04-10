-- AlterTable
ALTER TABLE "_AttachmentToProduct" ADD CONSTRAINT "_AttachmentToProduct_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AttachmentToProduct_AB_unique";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "status_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
