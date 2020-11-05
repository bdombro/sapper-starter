import { tokenize, verify } from "../../../lib/crypto"
import { getByUsername } from "../_users"
import type { LoginCreds, Session } from "./_types"

export async function post(req, res) {
  const creds: LoginCreds = req.body
  const user = getByUsername(creds.username)
  if (user && await verify(creds.password, user?.password)) {
    const auth: Session = { i: user.id, r: user.role }
    res.cookie("auth", tokenize(auth))
    res.status(200).json(auth)
  } else {
    res.clearCookie("auth")
    res.status(400).json({ error: `username and/or password are invalid` })
  }
}
