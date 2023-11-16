/*
  Warnings:

  - You are about to drop the column `closingTimes` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `idCard` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `idNumber` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `ownerFirstName` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `ownerLastName` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `shopLan` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `shopLat` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `shopName` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `shopPicture` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the `ShopsCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resevations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Shops` will be added. If there are existing duplicate values, this will fail.
  - Made the column `registerationNumber` on table `Shops` required. This step will fail if there are existing NULL values in that column.
  - Made the column `registertionPic` on table `Shops` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Shops` DROP FOREIGN KEY `Shops_shopAccountId_fkey`;

-- DropForeignKey
ALTER TABLE `ShopsCategories` DROP FOREIGN KEY `ShopsCategories_shopsId_fkey`;

-- DropForeignKey
ALTER TABLE `resevations` DROP FOREIGN KEY `Resevations_shopId_fkey`;

-- AlterTable
ALTER TABLE `ShopAccount` ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `idCard` VARCHAR(191) NULL,
    ADD COLUMN `idNumber` VARCHAR(191) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NULL,
    ADD COLUMN `mobile` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Shops` DROP COLUMN `closingTimes`,
    DROP COLUMN `idCard`,
    DROP COLUMN `idNumber`,
    DROP COLUMN `ownerFirstName`,
    DROP COLUMN `ownerLastName`,
    DROP COLUMN `shopLan`,
    DROP COLUMN `shopLat`,
    DROP COLUMN `shopName`,
    DROP COLUMN `shopPicture`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `closeingTimes` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `picture` VARCHAR(191) NULL,
    ADD COLUMN `priceRange` ENUM('cheap', 'middle', 'expensive') NULL,
    MODIFY `shopMobile` VARCHAR(191) NULL,
    MODIFY `openingTimes` VARCHAR(191) NULL,
    MODIFY `registerationNumber` VARCHAR(191) NOT NULL,
    MODIFY `registertionPic` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `ShopsCategories`;

-- DropTable
DROP TABLE `categories`;

-- DropTable
DROP TABLE `resevations`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `mobile` VARCHAR(191) NULL,
    `facebookId` VARCHAR(191) NULL,
    `googleId` VARCHAR(191) NULL,
    `lineId` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `banCount` INTEGER NOT NULL DEFAULT 0,
    `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',

    UNIQUE INDEX `Users_username_key`(`username`),
    UNIQUE INDEX `Users_email_key`(`email`),
    UNIQUE INDEX `Users_mobile_key`(`mobile`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resevations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `shopId` INTEGER NOT NULL,
    `branchId` INTEGER NOT NULL,
    `queueNumber` INTEGER NOT NULL,
    `status` ENUM('pending', 'accepted', 'cancelled') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Resevations_branchId_fkey`(`branchId`),
    INDEX `Resevations_shopId_fkey`(`shopId`),
    INDEX `Resevations_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `typeId` INTEGER NOT NULL,
    `shopId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    INDEX `Categories_shopId_fkey`(`shopId`),
    INDEX `Categories_typeId_fkey`(`typeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Branchs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shopId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    INDEX `Branchs_shopId_fkey`(`shopId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `branchId` INTEGER NOT NULL,
    `lat` VARCHAR(191) NOT NULL,
    `long` VARCHAR(191) NOT NULL,

    INDEX `Location_branchId_fkey`(`branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Shops_email_key` ON `Shops`(`email`);
