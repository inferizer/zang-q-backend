/*
  Warnings:

  - You are about to drop the column `shopId` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `Resevations` table. All the data in the column will be lost.
  - You are about to drop the column `queueNumber` on the `Resevations` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `ShopAccount` table. All the data in the column will be lost.
  - You are about to drop the column `idCard` on the `ShopAccount` table. All the data in the column will be lost.
  - You are about to drop the column `idNumber` on the `ShopAccount` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `ShopAccount` table. All the data in the column will be lost.
  - You are about to drop the column `mobile` on the `ShopAccount` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `closeingTimes` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `priceRange` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the `Branchs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Type` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date` to the `Resevations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `queue_number` to the `Resevations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seat` to the `Resevations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Resevations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Resevations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closingTimes` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idCard` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idNumber` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerFirstName` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerLastName` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopLan` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopLat` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopName` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopPicture` to the `Shops` table without a default value. This is not possible if the table is not empty.
  - Made the column `shopMobile` on table `Shops` required. This step will fail if there are existing NULL values in that column.
  - Made the column `openingTimes` on table `Shops` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Categories_shopId_fkey` ON `Categories`;

-- DropIndex
DROP INDEX `Categories_typeId_fkey` ON `Categories`;

-- DropIndex
DROP INDEX `Resevations_branchId_fkey` ON `Resevations`;

-- DropIndex
DROP INDEX `Resevations_shopId_fkey` ON `Resevations`;

-- DropIndex
DROP INDEX `Resevations_userId_fkey` ON `Resevations`;

-- DropIndex
DROP INDEX `Shops_email_key` ON `Shops`;

-- DropIndex
DROP INDEX `Shops_shopAccountId_fkey` ON `Shops`;

-- DropIndex
DROP INDEX `Users_username_key` ON `Users`;

-- AlterTable
ALTER TABLE `Categories` DROP COLUMN `shopId`,
    DROP COLUMN `typeId`;

-- AlterTable
ALTER TABLE `Resevations` DROP COLUMN `branchId`,
    DROP COLUMN `queueNumber`,
    ADD COLUMN `date` VARCHAR(191) NOT NULL,
    ADD COLUMN `queue_number` INTEGER NOT NULL,
    ADD COLUMN `seat` INTEGER NOT NULL,
    ADD COLUMN `socket` VARCHAR(191) NULL,
    ADD COLUMN `time` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` ENUM('one', 'two', 'three', 'four') NOT NULL,
    MODIFY `userId` INTEGER NULL,
    MODIFY `status` ENUM('pending', 'accepted', 'cancelled') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `ShopAccount` DROP COLUMN `firstName`,
    DROP COLUMN `idCard`,
    DROP COLUMN `idNumber`,
    DROP COLUMN `lastName`,
    DROP COLUMN `mobile`;

-- AlterTable
ALTER TABLE `Shops` DROP COLUMN `address`,
    DROP COLUMN `closeingTimes`,
    DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `picture`,
    DROP COLUMN `priceRange`,
    ADD COLUMN `closingTimes` VARCHAR(191) NOT NULL,
    ADD COLUMN `idCard` VARCHAR(191) NOT NULL,
    ADD COLUMN `idNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `ownerFirstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `ownerLastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `shopLan` DOUBLE NOT NULL,
    ADD COLUMN `shopLat` DOUBLE NOT NULL,
    ADD COLUMN `shopName` VARCHAR(191) NOT NULL,
    ADD COLUMN `shopPicture` VARCHAR(191) NOT NULL,
    MODIFY `shopMobile` VARCHAR(191) NOT NULL,
    MODIFY `openingTimes` VARCHAR(191) NOT NULL,
    MODIFY `registerationNumber` VARCHAR(191) NULL,
    MODIFY `registertionPic` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Users` ADD COLUMN `profileImage` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Branchs`;

-- DropTable
DROP TABLE `Location`;

-- DropTable
DROP TABLE `Type`;

-- CreateTable
CREATE TABLE `ShopsCategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shopsId` INTEGER NOT NULL,
    `categoriesId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Resevations` ADD CONSTRAINT `Resevations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resevations` ADD CONSTRAINT `Resevations_shopId_fkey` FOREIGN KEY (`shopId`) REFERENCES `Shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shops` ADD CONSTRAINT `Shops_shopAccountId_fkey` FOREIGN KEY (`shopAccountId`) REFERENCES `ShopAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShopsCategories` ADD CONSTRAINT `ShopsCategories_categoriesId_fkey` FOREIGN KEY (`categoriesId`) REFERENCES `Categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShopsCategories` ADD CONSTRAINT `ShopsCategories_shopsId_fkey` FOREIGN KEY (`shopsId`) REFERENCES `Shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
