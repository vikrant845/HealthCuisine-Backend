const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
    constructor (user, url) {
        this.user = user;
        this.url = url;
        this.from = `HealthCuisine <${ process.env.EMAIL_FROM }>`;
    }

    newTransport() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send() {
        const html = pug.renderFile(`${ __dirname }/../template/passwordChange.pug`, { firstName: this.user.firstName, lastName: this.user.lastName, url: this.url });

        const mailOptions = {
            to: this.user.email,
            from: this.from,
            subject: 'Password Reset Token',
            html,
            text: htmlToText(html)
        };
        await this.newTransport().sendMail(mailOptions);
    }
}