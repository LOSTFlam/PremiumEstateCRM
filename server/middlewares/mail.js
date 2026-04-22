const nodemailer = require('nodemailer');

// Function to send an email
const sendEmail = async (to, subject, text, html) => {
    try {
        if (to && process.env.user && process.env.pass) {
            const transporter = nodemailer.createTransport({
                host: 'smtp.office365.com',
                port: 587,
                auth: {
                    user: process.env.user,
                    pass: process.env.pass
                }
            });

            const mailOptions = {
                from: process.env.user,
                to: to,
                subject: subject,
                text: text,
                html: html
            };

            const info = await transporter.sendMail(mailOptions);
            // Console statement removed
            return info.response;
        }
    } catch (error) {
        // Console statement removed
        throw error;
    }
};


module.exports = { sendEmail }