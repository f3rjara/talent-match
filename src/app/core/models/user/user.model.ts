export enum UserRole {
  RECRUITER = 'recruiter',
  ADMIN = 'admin',
  APPLICANT = 'applicant',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
}
