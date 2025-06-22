// send-email.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// --- Configuration à remplir ---
// Remplacez par vos informations
const GMAIL_ADDRESS = 'VOTRE_ADRESSE@gmail.com'; 
const GMAIL_APP_PASSWORD = 'VOTRE_MOT_DE_PASSE_APPLICATION'; 

// Remplacez par votre liste d'invités
const recipientEmails = [
    'invite1@email.com', 
    'invite2@email.com',
    // Ajoutez autant d'adresses que nécessaire
]; 

const subject = 'Save the Date - Mariage Lorine & Corentin';
// --- Fin de la configuration ---

// Crée le "transporteur" qui enverra l'email.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_ADDRESS,
    pass: GMAIL_APP_PASSWORD, // IMPORTANT: Utilisez un mot de passe d'application généré depuis votre compte Google
  },
});

// Lit le contenu de votre fichier HTML
const htmlPath = path.join(__dirname, 'email', 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Configure les options de l'e-mail
const mailOptions = {
  from: `Lorine & Corentin <${GMAIL_ADDRESS}>`,
  to: GMAIL_ADDRESS, // Envoi à votre propre adresse
  bcc: recipientEmails.join(', '), // *** VOS INVITÉS SONT EN COPIE CACHÉE (Bcc) ***
  subject: subject,
  html: htmlContent,
};

// Envoie l'e-mail
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Erreur lors de l\'envoi de l\'e-mail:', error);
  }
  console.log('E-mail envoyé avec succès ! Réponse du serveur:', info.response);
  console.log('Un e-mail de test a été envoyé à votre adresse et les invités ont été placés en Bcc (copie cachée).');
}); 