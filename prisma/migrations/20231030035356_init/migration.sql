/*
  Warnings:

  - You are about to drop the column `branchId` on the `location` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `resevations` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `resevations` table. All the data in the column will be lost.
  - The values [waiting,arrival] on the enum `Resevations_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [shop_admin,shop_super_admin,super_admin] on the enum `Users_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `branchs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `branchs` DROP FOREIGN KEY `Branchs_shopId_fkey`;

-- DropForeignKey
ALTER TABLE `location` DROP FOREIGN KEY `Location_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `resevations` DROP FOREIGN KEY `Resevations_branchId_fkey`;

-- AlterTable
ALTER TABLE `location` DROP COLUMN `branchId`;

-- AlterTable
ALTER TABLE `resevations` DROP COLUMN `branchId`,
    DROP COLUMN `createdAt`,
    ADD COLUMN `bookingDate` DATE NOT NULL,
    ADD COLUMN `bookingTime` TIME NOT NULL ,
    MODIFY `status` ENUM('pending', 'accepted', 'cancelled') NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user';

-- DropTable
DROP TABLE `branchs`;

-- CreateTable
CREATE TABLE `ShopAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isShop` BOOLEAN NOT NULL DEFAULT true,
    `shopsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ShopAccount` ADD CONSTRAINT `ShopAccount_shopsId_fkey` FOREIGN KEY (`shopsId`) REFERENCES `Shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
