/*
  Warnings:

  - You are about to drop the column `bookingDate` on the `resevations` table. All the data in the column will be lost.
  - You are about to drop the column `bookingTime` on the `resevations` table. All the data in the column will be lost.
  - You are about to drop the column `isShop` on the `shopaccount` table. All the data in the column will be lost.
  - You are about to drop the column `shopsId` on the `shopaccount` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `shops` table. All the data in the column will be lost.
  - You are about to drop the column `closeingTimes` on the `shops` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `shops` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `shops` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `shops` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `shops` table. All the data in the column will be lost.
  - You are about to drop the column `priceRange` on the `shops` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `ShopAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branchId` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `Resevations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Resevations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closingTimes` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idCard` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idNumber` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerFirstName` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerLastName` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopAccountId` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopLan` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopLat` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopName` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopPicture` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Made the column `shopMobile` on table `shops` required. This step will fail if there are existing NULL values in that column.
  - Made the column `openingTimes` on table `shops` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `shopaccount` DROP FOREIGN KEY `ShopAccount_shopsId_fkey`;

-- DropIndex
DROP INDEX `Shops_email_key` ON `shops`;

-- AlterTable
ALTER TABLE `location` ADD COLUMN `branchId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `resevations` DROP COLUMN `bookingDate`,
    DROP COLUMN `bookingTime`,
    ADD COLUMN `branchId` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `type` ENUM('one', 'two', 'three', 'four') NOT NULL;

-- AlterTable
ALTER TABLE `shopaccount` DROP COLUMN `isShop`,
    DROP COLUMN `shopsId`,
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'vendor';

-- AlterTable
ALTER TABLE `shops` DROP COLUMN `address`,
    DROP COLUMN `closeingTimes`,
    DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `password`,
    DROP COLUMN `picture`,
    DROP COLUMN `priceRange`,
    ADD COLUMN `closingTimes` VARCHAR(191) NOT NULL,
    ADD COLUMN `idCard` VARCHAR(191) NOT NULL,
    ADD COLUMN `idNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `ownerFirstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `ownerLastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `registerationNumber` VARCHAR(191) NULL,
    ADD COLUMN `registertionPic` VARCHAR(191) NULL,
    ADD COLUMN `shopAccountId` INTEGER NOT NULL,
    ADD COLUMN `shopLan` DOUBLE NOT NULL,
    ADD COLUMN `shopLat` DOUBLE NOT NULL,
    ADD COLUMN `shopName` VARCHAR(191) NOT NULL,
    ADD COLUMN `shopPicture` VARCHAR(191) NOT NULL,
    MODIFY `shopMobile` VARCHAR(191) NOT NULL,
    MODIFY `openingTimes` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `profileImage` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Branchs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shopId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ShopAccount_email_key` ON `ShopAccount`(`email`);

-- AddForeignKey
ALTER TABLE `Resevations` ADD CONSTRAINT `Resevations_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branchs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shops` ADD CONSTRAINT `Shops_shopAccountId_fkey` FOREIGN KEY (`shopAccountId`) REFERENCES `ShopAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Branchs` ADD CONSTRAINT `Branchs_shopId_fkey` FOREIGN KEY (`shopId`) REFERENCES `Shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branchs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
