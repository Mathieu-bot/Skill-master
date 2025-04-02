const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Fonction pour tester l'envoi d'email
const testEmail = async () => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // On envoie à nous-même pour tester
            subject: 'Test Email RealHack',
            html: `
                <h1>Test de configuration email</h1>
                <p>Si vous recevez cet email, la configuration est réussie !</p>
                <p>Configuration utilisée :</p>
                <ul>
                    <li>Email: ${process.env.EMAIL_USER}</li>
                    <li>Service: Gmail</li>
                </ul>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé avec succès:', info.messageId);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
};

// Fonction pour envoyer un email
const sendEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé avec succès:', info.messageId);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
};

module.exports = {
    testEmail,
    sendEmail,
    transporter
};