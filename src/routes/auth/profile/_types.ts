import type { User } from "../_types"

export interface IndexData {
  user: Omit<User, "password">
}
