import bcrypt from "bcryptjs";

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = (password: string, hashPassword: string) => {
  return bcrypt.compare(password, hashPassword);
};
