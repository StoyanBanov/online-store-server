const formidable = require('formidable')
const fs = require('fs').promises

module.exports = () => (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        const body = Object.entries(fields).reduce((data, [key, value]) => {
            data[key] = value[0]
            return data
        }, {})

        const images = {}
        for (const [key, value] of Object.entries(files)) {
            if (value.length == 1) {
                images[key] = await makeImage(value[0])
            } else {
                images[key] = []
                for (const file of value)
                    images[key].push(await makeImage(file))
            }
        }
        req.formBody = body
        req.formImages = images

        next()
    })
}

async function makeImage(file) {
    return {
        image: await fs.readFile(file.filepath),
        filename: `${file.newFilename}.${file.mimetype.split('/')[1]}`
    }
}