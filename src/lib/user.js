/**
 * Created by lunik on 04/06/2017.
 */
import * as Vibrant from 'node-vibrant'

function generateID (user) {
  let id = user.displayName.toLowerCase()
        .replace(/[^0-9a-z-]+/g, '_')           // non conform char
        .replace(/_$/g, '')                      // Remove last dot
  return `${id}_${user.uid.slice(0, 5).toLowerCase()}`
}

function getColors (img, cb) {
  try {
    Vibrant.from(img).getPalette((err, palette) => {
      if (err) {
        cb(['#ed588d'])
        return
      }
      const colors = Object.keys(palette)
      var hexColors = []
      for (let c in colors) {
        if (palette[colors[c]]) {
          hexColors.push(palette[colors[c]].getHex())
        }
      }
      cb(hexColors)
      var canvas = document.querySelector('.vibrant-canvas')
      if (canvas) {
        canvas.remove()
      }
    })
  } catch (e) {
    cb(['#ed588d'])
  }
}

export { generateID, getColors }
