const globalValues = {}

Object.defineProperties(globalValues, {
    jwtSecret: {
        value: 'MyDemoSecret',
        configurable: false
    },
    bcryptHashRounds: {
        value: 10,
        configurable: false
    },
    passwordRegex: {
        value: /^(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]{10,}$/,
        configurable: false
    },
    companyEmail: {
        value: {
            name: 'true-face@abv.bg',
            pass: 'true-face1'
        },
        configurable: false
    },
})

module.exports = globalValues