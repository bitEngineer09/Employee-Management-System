/*
  Warnings:

  - The values [LEAVE] on the enum `AttendanceLog_newStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [LEAVE] on the enum `AttendanceLog_newStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [LEAVE] on the enum `AttendanceLog_newStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[employeeId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `attendance` MODIFY `status` ENUM('PRESENT', 'ABSENT', 'HALF_DAY', 'HOLIDAY', 'LEAVE_PAID', 'LEAVE_UNPAID') NOT NULL;

-- AlterTable
ALTER TABLE `attendancelog` MODIFY `oldStatus` ENUM('PRESENT', 'ABSENT', 'HALF_DAY', 'HOLIDAY', 'LEAVE_PAID', 'LEAVE_UNPAID') NULL,
    MODIFY `newStatus` ENUM('PRESENT', 'ABSENT', 'HALF_DAY', 'HOLIDAY', 'LEAVE_PAID', 'LEAVE_UNPAID') NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `basicSalary` DECIMAL(10, 2) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_employeeId_key` ON `user`(`employeeId`);
