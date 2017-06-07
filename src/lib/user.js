/**
 * Created by lunik on 04/06/2017.
 */

function generateID(user){
    var id = user.displayName.toLowerCase()
        .replace(/[^0-9a-z-]+/g, '_')           // non conform char
        .replace(/_$/g, '')                      // Remove last dot
    return `${id}_${user.uid.slice(0, 5).toLowerCase()}`
}

export { generateID }