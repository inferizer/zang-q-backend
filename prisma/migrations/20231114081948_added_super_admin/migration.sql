-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('user', 'admin', 'super_admin') NOT NULL DEFAULT 'user';
