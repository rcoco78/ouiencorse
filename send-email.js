// send-email.js
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Nécessaire pour obtenir le chemin du répertoire avec les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration à remplir ---
const EMAIL_ADDRESS = 'corentinrobert648@gmail.com'; // Votre adresse e-mail (Gmail ou OVH)
const EMAIL_PASSWORD = 'dpwu hqvo tdpc gkyb'; // Le mot de passe de l'e-mail ou mot de passe d'application
const subject = 'Save the Date - Mariage Lorine & Corentin';
const baseUrl = 'https://www.ouiencorse.fr';
// --- Fin de la configuration ---

// --- Configuration du transporteur (décommentez celui que vous utilisez) ---

// Configuration pour GMAIL
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD, // Doit être un mot de passe d'application
  },
});

// Configuration pour OVH
// const transporter = nodemailer.createTransport({
//   host: "ssl0.ovh.net",
//   port: 465,
//   secure: true,
//   auth: {
//     user: EMAIL_ADDRESS,
//     pass: EMAIL_PASSWORD, // Le vrai mot de passe de l'e-mail
//   },
// });
// --- Fin de la configuration du transporteur ---


// --- Lecture et parsing de la liste d'invités ---
let guests = [];
try {
    const emailsFilePath = path.join(__dirname, 'emails.txt');
    const emailsFileContent = fs.readFileSync(emailsFilePath, 'utf8');
    
    guests = emailsFileContent
        .split('\n')
        .map(line => {
            const [email, withGuests] = line.trim().split(',');
            return { email, withGuests: withGuests === 'true' };
        })
        .filter(guest => guest.email && !guest.email.startsWith('#'));

} catch (error) {
    console.error("\nErreur : Impossible de lire le fichier 'emails.txt'.", error);
    process.exit(1);
}

if (guests.length === 0) {
    console.error("\nErreur : Le fichier 'emails.txt' est vide ou ne contient aucune adresse e-mail valide.\n");
    process.exit(1);
}
// --- Fin de la lecture ---


// --- Logique d'envoi ---
async function sendAllEmails() {
    console.log(`Début de l'envoi à ${guests.length} invité(s)...`);
    const htmlTemplate = fs.readFileSync(path.join(__dirname, 'public', 'email', 'index.html'), 'utf8');
    let emailsSent = 0;
    
    for (const guest of guests) {
        const confirmationUrl = guest.withGuests ? `${baseUrl}?withGuests=true` : baseUrl;
        const personalHtml = htmlTemplate.replace('%%CONFIRMATION_URL%%', confirmationUrl);
        
        const mailOptions = {
            from: `Lorine & Corentin <${EMAIL_ADDRESS}>`,
            to: guest.email,
            subject: subject,
            html: personalHtml,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`- E-mail envoyé avec succès à : ${guest.email}`);
            emailsSent++;
        } catch (error) {
            console.error(`! Erreur lors de l'envoi à ${guest.email}:`, error);
        }
    }
    
    console.log(`\nEnvoi terminé. ${emailsSent}/${guests.length} e-mails ont été envoyés avec succès.`);
}

sendAllEmails(); 