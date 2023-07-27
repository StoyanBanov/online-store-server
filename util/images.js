const fs = require('fs').promises

function addImages(formImages) {
    Object.values(formImages).forEach(async i => {
        if (Array.isArray(i))
            await Promise.all(i.map(a => fs.writeFile(`./static/images/${a.filename}`, a.image)))
        else
            await fs.writeFile(`./static/images/${i.filename}`, i.image)
    })
}

function delImages(imgNames) {
    imgNames.forEach(async n => {
        await fs.unlink('./static/images/' + n)
    })
}

module.exports = {
    addImages,
    delImages
}