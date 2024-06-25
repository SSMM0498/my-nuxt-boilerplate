export interface User {
  id: string;
  isLoggedIn: boolean;
  profil: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  access: string;
  refresh: string;
  agence_id: string;
  type_agence: string;
  name_agence: string;
  uuid: string;
}

export type UserWithoutPassword = Omit<User, "password">;