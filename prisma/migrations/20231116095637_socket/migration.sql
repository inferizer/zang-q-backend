/*
  Warnings:

  - You are about to drop the column `branchId` on the `resevations` table. All the data in the column will be lost.
  - You are about to drop the column `queueNumber` on the `resevations` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `date` to the `Resevations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `queue_number` to the `Resevations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seat` to the `Resevations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Resevations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `resevations` DROP FOREIGN KEY `Resevations_userId_fkey`;

-- DropIndex
DROP INDEX `Resevations_branchId_fkey` ON `resevations`;

-- DropIndex
DROP INDEX `Users_username_key` ON `users`;

-- AlterTable
ALTER TABLE `resevations` DROP COLUMN `branchId`,
    DROP COLUMN `queueNumber`,
    ADD COLUMN `date` VARCHAR(191) NOT NULL,
    ADD COLUMN `queue_number` INTEGER NOT NULL,
    ADD COLUMN `seat` INTEGER NOT NULL,
    ADD COLUMN `socket` VARCHAR(191) NULL,
    ADD COLUMN `time` VARCHAR(191) NOT NULL,
    MODIFY `userId` INTEGER NULL,
    MODIFY `status` ENUM('pending', 'accepted', 'cancelled') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `users` DROP COLUMN `name`;

-- AddForeignKey
ALTER TABLE `Resevations` ADD CONSTRAINT `Resevations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
