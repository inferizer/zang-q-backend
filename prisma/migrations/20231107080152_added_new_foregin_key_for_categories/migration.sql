/*
  Warnings:

  - You are about to drop the column `shopId` on the `categories` table. All the data in the column will be lost.
  - Added the required column `shopAccountId` to the `Categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `Categories_shopId_fkey`;

-- AlterTable
ALTER TABLE `categories` DROP COLUMN `shopId`,
    ADD COLUMN `shopAccountId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Categories` ADD CONSTRAINT `Categories_shopAccountId_fkey` FOREIGN KEY (`shopAccountId`) REFERENCES `ShopAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
