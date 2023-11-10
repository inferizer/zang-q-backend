/*
  Warnings:

  - You are about to drop the column `shopsId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the `branchs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `type` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `branchs` DROP FOREIGN KEY `Branchs_shopId_fkey`;

-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `Categories_shopsId_fkey`;

-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `Categories_typeId_fkey`;

-- DropForeignKey
ALTER TABLE `location` DROP FOREIGN KEY `Location_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `resevations` DROP FOREIGN KEY `Resevations_branchId_fkey`;

-- AlterTable
ALTER TABLE `categories` DROP COLUMN `shopsId`,
    DROP COLUMN `typeId`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `branchs`;

-- DropTable
DROP TABLE `location`;

-- DropTable
DROP TABLE `type`;

-- CreateTable
CREATE TABLE `ShopsCategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shopsId` INTEGER NOT NULL,
    `categoriesId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ShopsCategories` ADD CONSTRAINT `ShopsCategories_categoriesId_fkey` FOREIGN KEY (`categoriesId`) REFERENCES `Categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShopsCategories` ADD CONSTRAINT `ShopsCategories_shopsId_fkey` FOREIGN KEY (`shopsId`) REFERENCES `Shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
