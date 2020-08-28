import { users } from "../_users"
import type { IndexData } from "./_types"

export function get(req, res) {
  if (req.auth?.i) {
    const user = users.get(req.auth.i)
    const { password, ...userNoPassword } = user
    const data: IndexData = { user: userNoPassword }
    res.status(200).json(data)
  } else {
    res.status(403).end()
  }
}

export function patch(req, res) {
  if (req.auth?.i) {
    const user = users.get(req.auth.i)
    const userNext = { ...user, ...req.body }
    users.set(req.auth.i, userNext)
    const { password, ...userNoPassword } = user
    res.status(200).json(userNoPassword)
  } else {
    res.status(403).end()
  }
}
