-- CreateTable
CREATE TABLE `LeaveBalance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `casualLeft` INTEGER NOT NULL DEFAULT 12,

    UNIQUE INDEX `LeaveBalance_employeeId_year_key`(`employeeId`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LeaveBalance` ADD CONSTRAINT `LeaveBalance_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
