function parseError(error) {
    let messages

    if (Array.isArray(error)) {
        messages = error.map(e => e.msg)
    } else if (error.name == 'ValidationError') {
        messages = Object.values(error.errors).map(e => e.properties.message)
    } else {
        messages = [error.message]
    }

    return {
        message: messages.join(';\n')
    }
}

module.exports = {
    parseError
}