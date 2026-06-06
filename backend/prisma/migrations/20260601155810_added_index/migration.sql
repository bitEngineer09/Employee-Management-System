-- CreateIndex
CREATE INDEX `Attendance_employeeId_idx` ON `Attendance`(`employeeId`);

-- CreateIndex
CREATE INDEX `LeaveBalance_employeeId_idx` ON `LeaveBalance`(`employeeId`);

-- CreateIndex
CREATE INDEX `Payroll_employeeId_idx` ON `Payroll`(`employeeId`);

-- RenameIndex
ALTER TABLE `leave` RENAME INDEX `Leave_employeeId_fkey` TO `Leave_employeeId_idx`;
