export type UserProfileToken = {
  user: UserProfile;
  token: string;
};

export type UserProfile = {
  id: number;
  fullname: string;
  email: string;
  password: string;
  type: string;
};
