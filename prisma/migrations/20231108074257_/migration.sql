/*
  Warnings:

  - You are about to drop the column `shopAccountId` on the `categories` table. All the data in the column will be lost.
  - Added the required column `shopsId` to the `Categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `Categories_shopAccountId_fkey`;

-- AlterTable
ALTER TABLE `categories` DROP COLUMN `shopAccountId`,
    ADD COLUMN `shopsId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Categories` ADD CONSTRAINT `Categories_shopsId_fkey` FOREIGN KEY (`shopsId`) REFERENCES `Shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
