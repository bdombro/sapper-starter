import jwt from "jsonwebtoken";
import { getByUsername } from "../_users";
export function post(req, res) {
  const creds = req.body;
  const user = getByUsername(creds.username);
  if (user?.password === creds.password) {
    const auth = {
      i: user.id,
      r: user.role,
    };
    res.cookie("auth", jwt.sign(auth, "shhhhhhared-secret"));
    res.status(200).json(auth);
  } else {
    res.clearCookie("auth");
    res.status(400).json({ message: `username and/or password are invalid` });
  }
}
