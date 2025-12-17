/*
  Warnings:

  - You are about to alter the column `monthlySalary` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Double`.
  - You are about to alter the column `basicSalary` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Double`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `monthlySalary` DOUBLE NULL,
    MODIFY `basicSalary` DOUBLE NULL;
