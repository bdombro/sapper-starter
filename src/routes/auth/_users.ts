import type { User } from "./_types"

export const testPassword = 'CoolPassword9';
const testHash = '9b39911c178b3f399b5a8b4b2a57aee3f7c92de94ebadee6413e79ff977684dacb2542c1ebd631f824987bf7ae0ccf1212e0aa013b60b0efdbf5fff9737ff89c' // CoolPassword9

export const adminUserAuth: User = {
  id: "coolid1",
  email: "admin@example.com",
  username: "admin",
  password: testHash,
  givenName: "Admin",
  surname: "Foo",
  terms: `${Date.now()}`,
  avatar: "https://www.gravatar.com/avatar/00000000000000000000000000000000", // Get sizes by adding ?s=200
  role: 0,
}
export const normalUserAuth: User = {
  id: "coolid2",
  email: "nancy@example.com",
  username: "nancyDrew",
  password: testHash,
  givenName: "Nancy",
  surname: "Drew",
  terms: `${Date.now()}`,
  avatar: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50", // Get sizes by adding ?s=200
  role: 1,
}
export const users: Map<string, User> = new Map()
users.set(adminUserAuth.id, adminUserAuth)
users.set(normalUserAuth.id, normalUserAuth)

export function getByUsername(username): User | null {
  return Array.from(users)
    .map(([, u]) => u)
    .find((u) => u.username === username)
}
