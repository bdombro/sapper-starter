export function get(req, res) {
  res.status(200).end(process.env.version)
}