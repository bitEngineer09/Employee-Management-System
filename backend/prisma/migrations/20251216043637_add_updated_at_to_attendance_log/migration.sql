/*
  Warnings:

  - Added the required column `updatedAt` to the `AttendanceLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendancelog` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
