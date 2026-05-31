-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `checkInImage` VARCHAR(191) NULL,
    ADD COLUMN `checkInLat` DOUBLE NULL,
    ADD COLUMN `checkInLng` DOUBLE NULL,
    ADD COLUMN `checkOutImage` VARCHAR(191) NULL,
    ADD COLUMN `checkOutLat` DOUBLE NULL,
    ADD COLUMN `checkOutLng` DOUBLE NULL;

-- AlterTable
ALTER TABLE `attendancelog` ADD COLUMN `deviceInfo` VARCHAR(191) NULL,
    ADD COLUMN `locationLat` DOUBLE NULL,
    ADD COLUMN `locationLng` DOUBLE NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `faceDescriptor` JSON NULL;
