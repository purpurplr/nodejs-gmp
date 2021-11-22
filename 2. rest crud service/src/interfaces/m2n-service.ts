export interface M2NService {
  assignRoleToUsers: (mPk: string, nPk: string[]) => Promise<void>;
}
