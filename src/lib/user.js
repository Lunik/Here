/**
 * Created by lunik on 04/06/2017.
 */
import * as Vibrant from 'node-vibrant'

function generateID(user){
    var id = user.displayName.toLowerCase()
        .replace(/[^0-9a-z-]+/g, '_')           // non conform char
        .replace(/_$/g, '')                      // Remove last dot
    return `${id}_${user.uid.slice(0, 5).toLowerCase()}`
}

function getColors(img, cb){
    Vibrant.from(img).getPalette((err, palette) => {
        var colors = Object.keys(palette)
        var hexColors = []
        for(let c in colors){
            if(palette[colors[c]]) {
                hexColors.push(palette[colors[c]].getHex())
            }
        }
        cb(hexColors)
    })
}
export { generateID, getColors }