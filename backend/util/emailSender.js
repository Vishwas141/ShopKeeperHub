const nodemailer = require("nodemailer");
require("dotenv").config();

const emailSender = async (email, subject, body) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: "teamsait2023@gmail.com",
            to: email,
            subject: subject,
            html: body,
        });

        console.log("Email sent:", info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = emailSender;
