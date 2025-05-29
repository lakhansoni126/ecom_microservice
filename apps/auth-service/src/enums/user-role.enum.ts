export enum UserRole {
  CUSTOMER = 0,
  ADMIN = 1,
  SELLER = 2
}

export const mapProtoRoleToDbRole = (protoRole: UserRole): string => {
  switch (protoRole) {
    case UserRole.CUSTOMER:
      return 'Customer';
    case UserRole.ADMIN:
      return 'Admin';
    case UserRole.SELLER:
      return 'Seller';
    default:
      return 'Customer';
  }
};

export const mapDbRoleToProtoRole = (dbRole: string): UserRole => {
  switch (dbRole) {
    case 'Admin':
      return UserRole.ADMIN;
    case 'Seller':
      return UserRole.SELLER;
    case 'Customer':
    default:
      return UserRole.CUSTOMER;
  }
};