const nodemailer = require('nodemailer');
const { companyEmail } = require('../globals');

async function sendConfirmationEmail({ email, username }) {
    console.log(email);
    console.log(companyEmail.name);
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

    await transporter.sendMail({
        from: companyEmail.name,
        to: email,
        subject: 'E-mail verification',
        text: `Hello, ${username}!\nTo verify your email please copy and paste the following code: ${Math.trunc(Math.random() * 10)}${Math.trunc(Math.random() * 10)}${Math.trunc(Math.random() * 10)}${Math.trunc(Math.random() * 10)}`,
    });
}

module.exports = {
    sendConfirmationEmail
}