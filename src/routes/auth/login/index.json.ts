import jwt from "jsonwebtoken";
import { getByUsername } from "../_users";
import type { LoginCreds, Session } from "./_types";

export function post(req, res) {
  const creds: LoginCreds = req.body;
  const user = getByUsername(creds.username);
  if (user?.password === creds.password) {
    const auth: Session = { i: user.id, r: user.role };
    res.cookie("auth", jwt.sign(auth, "shhhhhhared-secret"));
    res.status(200).json(auth);
  } else {
    res.clearCookie("auth");
    res.status(400).json({ error: `username and/or password are invalid` });
  }
}
