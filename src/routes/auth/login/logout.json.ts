export function post(req, res) {
  res.clearCookie("auth");
  res.status(204).end();
}
