-- RenameIndex
ALTER TABLE `attendancelog` RENAME INDEX `AttendanceLog_changedBy_fkey` TO `AttendanceLog_changedBy_idx`;

-- RenameIndex
ALTER TABLE `leave` RENAME INDEX `Leave_approvedBy_fkey` TO `Leave_approvedBy_idx`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_departmentId_fkey` TO `User_departmentId_idx`;
