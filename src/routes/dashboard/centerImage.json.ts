import Sharp from "sharp"

function makeSvgRectangle(width, height) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 51 34" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h51v34h-51z" fill="#f0f0f0" fill-rule="evenodd"/></svg>`
}

export async function get(req, res) {
  const width = 400
  let sharp = Sharp("./static/successkid.jpg")

  let quality: number
  switch (req.query.size) {
    case "blank":
      // Return a blank box for loading
      const meta = await sharp.metadata()
      const height = Math.round((width / meta.width) * meta.height)
      res.type("image/svg+xml")
      res.end(makeSvgRectangle(width, height))
      return
    case "sm":
      quality = 50
      break
    default:
      quality = 80
      break
  }

  res.type("image/jpeg")
  sharp
    .resize(width, width, { fit: "inside" })
    .jpeg({ quality, progressive: true })
    .pipe(res)
}
