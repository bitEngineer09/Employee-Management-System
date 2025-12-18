/*
  Warnings:

  - The values [HOLIDAY] on the enum `AttendanceLog_newStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [HOLIDAY] on the enum `AttendanceLog_newStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [HOLIDAY] on the enum `AttendanceLog_newStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `attendance` MODIFY `status` ENUM('PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE_PAID', 'LEAVE_UNPAID') NOT NULL;

-- AlterTable
ALTER TABLE `attendancelog` MODIFY `oldStatus` ENUM('PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE_PAID', 'LEAVE_UNPAID') NULL,
    MODIFY `newStatus` ENUM('PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE_PAID', 'LEAVE_UNPAID') NULL;

-- CreateTable
CREATE TABLE `Payroll` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `month` VARCHAR(191) NOT NULL,
    `grossSalary` DOUBLE NOT NULL,
    `pf` DOUBLE NOT NULL,
    `tax` DOUBLE NOT NULL,
    `netSalary` DOUBLE NOT NULL,
    `totalWorkingDays` INTEGER NOT NULL,
    `payableDays` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payroll_employeeId_month_key`(`employeeId`, `month`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payroll` ADD CONSTRAINT `Payroll_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
