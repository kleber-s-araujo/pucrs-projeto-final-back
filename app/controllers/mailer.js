require('dotenv').config();
const nodemailer = require('nodemailer');
const dbConfig = require('../config/db.config.js');

console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
console.log('EMAIL_USER:',    process.env.EMAIL_USER);
console.log('EMAIL_PASS:',    process.env.EMAIL_PASS);

/* Configura o Transporter */
const transporter = nodemailer.createTransport({
    service: dbConfig.EMAIL_SERVICE,
    auth: {
        user: dbConfig.EMAIL_USER,
        pass: dbConfig.EMAIL_PASS
    },
    debug: true // Ativa logs detalhados
});

transporter.set('connection_timeout', 10000);
transporter.set('socket_timeout', 15000);

/* Método para Enviar Email */
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: dbConfig.EMAIL_USER,
        to: to,
        subject: subject,
        html: text
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email Enviado: ' + info.response);
    } catch (error) {
        console.error('Erro ao enviar Email:', error);
    }
};

module.exports = { sendEmail };