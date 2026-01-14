/*
  Warnings:

  - A unique constraint covering the columns `[email,otp]` on the table `PasswordResetOtp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `PasswordResetOtp_email_otp_key` ON `PasswordResetOtp`(`email`, `otp`);
