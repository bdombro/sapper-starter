import type { User } from "./types";

export const adminUserAuth: User = {
  id: "coolid1",
  email: "admin@example.com",
  username: "admin",
  password: "CoolPassword9",
  givenName: "Admin",
  surname: "Foo",
  terms: `${Date.now()}`,
  avatar: "https://www.gravatar.com/avatar/00000000000000000000000000000000", // Get sizes by adding ?s=200
  role: 0,
};
export const normalUserAuth: User = {
  id: "coolid2",
  email: "nancy@example.com",
  username: "nancyDrew",
  password: "CoolPassword9",
  givenName: "Nancy",
  surname: "Drew",
  terms: `${Date.now()}`,
  avatar: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50", // Get sizes by adding ?s=200
  role: 1,
};
export const users: Map<string, User> = new Map();
users.set(adminUserAuth.id, adminUserAuth);
users.set(normalUserAuth.id, normalUserAuth);

export function getByUsername(username): User | null {
  return Array.from(users)
    .map(([, u]) => u)
    .find((u) => u.username === username);
}
