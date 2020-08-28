export enum UserFields {
  id = "id",
  email = "email",
  password = "password",
  username = "username",
  givenName = "givenName",
  surname = "surname",
  avatar = "avatar",
  terms = "terms",
  role = "role",
}

export interface User {
  id: string
  email: string
  password: string
  username: string
  givenName: string
  surname: string
  avatar: string
  terms: string
  role: 0 | 1
}
