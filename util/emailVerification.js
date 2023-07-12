const nodemailer = require('nodemailer');
const { companyEmail } = require('../globals');

async function sendConfirmationEmail({ email, username }) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.abv.bg',
        port: 465,
        secure: true,
        auth: {
            user: companyEmail.name,
            pass: companyEmail.pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let verificationCode = `${Math.trunc(Math.random() * 10)}${Math.trunc(Math.random() * 10)}${Math.trunc(Math.random() * 10)}${Math.trunc(Math.random() * 10)}`

    await transporter.sendMail({
        from: companyEmail.name,
        to: email,
        subject: 'E-mail verification',
        text: `Hello, ${username}!\nTo verify your email please copy and paste the following code: ${verificationCode}`,
    });

    return verificationCode
}

module.exports = {
    sendConfirmationEmail
}