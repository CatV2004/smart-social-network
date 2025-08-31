export enum UserStatus {
    ACTIVE = 'ACTIVE',      // đang hoạt động bình thường
    BANNED = 'BANNED',      // bị ban vĩnh viễn
    SUSPENDED = 'SUSPENDED', // bị khóa tạm thời
    PENDING = 'PENDING',    // chờ xác thực / kích hoạt
}