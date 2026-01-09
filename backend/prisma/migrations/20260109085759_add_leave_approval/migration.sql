-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_departmentId_fkey`;

-- AlterTable
ALTER TABLE `leave` MODIFY `fromDate` DATETIME(3) NOT NULL,
    MODIFY `toDate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `leavebalance` ADD COLUMN `paidLeft` INTEGER NOT NULL DEFAULT 10,
    ADD COLUMN `sickLeft` INTEGER NOT NULL DEFAULT 8;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_approvedBy_fkey` FOREIGN KEY (`approvedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `user_employeeId_key` TO `User_employeeId_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `user_phoneNumber_key` TO `User_phoneNumber_key`;
