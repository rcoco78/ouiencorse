📝 Brief complet — Page Mariage Corse (Anna & Léo)
🌿 Contexte & Style attendu
Lieu & ambiance : Mariage en Corse, à Ajaccio, esprit nature, mer, authenticité insulaire.
Design : Très épuré, fond beige texturé, palette douce (sable, bleu lavande, vert olive, terracotta).
Décor : Illustrations décoratives en line art (feuilles d’olivier, carte stylisée de la Corse, figuier de Barbarie, clocher corse…).
Typographie : Titres en serif élégante (ex : Playfair Display), texte en sans-serif moderne (ex : Lato, Poppins).
Responsive : Mobile-first, expérience fluide sur desktop et mobile.
Légèreté : Site rapide, pas de médias lourds, typographie très lisible.
📐 Structure de la page
1. Hero section (Accueil)
Fond beige (#f7f2ec)
Grand titre : “Anna & Léo se marient en Corse”
Sous-titre : “Ajaccio – Samedi 7 septembre 2025”
Illustration fine en fond (carte de la Corse en line art ou côte/montagne)
Bouton “📅 Save the Date” (scroll vers section suivante)
2. Save the Date
Titre : “📌 Réservez la date”
Bloc :
Date : 7 septembre 2025
Lieu : Ajaccio, Corse-du-Sud
Texte : “Nous avons hâte de vous accueillir sur l’île de Beauté !”
Formulaire RSVP simple :
Champs : prénom, nom, email (optionnel), nombre de personnes, message (optionnel)
Bouton “Je réserve ma place”
À la soumission : envoi des données vers Google Sheets via un webhook (Google Apps Script)
Message de confirmation après envoi
3. Programme / Les étapes du week-end
Titre : “🎉 Le programme”
Présentation sous forme de timeline horizontale ou 3 encarts :
Vendredi soir : Apéritif de bienvenue (lieu + heure)
Samedi : Cérémonie + réception (lieu + heure)
Dimanche : Brunch (lieu + heure)
4. Informations pratiques
Titre : “🧳 Préparer votre venue”
Accès à Ajaccio (vols, ferries, voiture)
Hébergements conseillés (liens éventuels)
Dress code : chic décontracté (“tenue légère, pensez à la chaleur”)
Carte interactive (si possible) ou image avec pins
5. RSVP (si séparé de Save the Date)
Titre : “💌 Confirmez votre présence”
Formulaire (nom, +1, présence vendredi/samedi/dimanche)
Bouton “Je réponds”
6. Cadeaux / Liste de mariage (facultatif)
Titre : “🎁 Un petit mot ou un petit geste”
Message court
Bouton vers cagnotte ou liste de mariage
7. Galerie ou notre histoire (facultatif)
Titre : “📸 Souvenirs & histoire”
Quelques photos (noir et blanc ou filtre chaud)
Texte très court (“On s’est rencontrés à…” / “Voici quelques souvenirs avant le grand jour”)
✅ Contraintes techniques
Design mobile-first
Scroll fluide
Légèreté du site (pas de gros médias lourds)
Typographie bien lisible
Utilisation de Google Fonts (Playfair Display, Lato/Poppins)
Illustrations SVG pour le line art
Intégration d’un formulaire RSVP relié à Google Sheets via webhook (Google Apps Script)
Palette : beige #f7f2ec, bleu lavande, vert olive, terracotta
💡 Conseils & options complémentaires
Utiliser des composants réutilisables (React, Next.js, ou HTML/CSS pur selon le choix du projet)
Prévoir une structure de fichiers claire (components, images, styles…)
Possibilité d’ajouter une carte interactive (Google Maps ou image)
Prévoir un message de confirmation après RSVP
Prévoir une gestion simple des erreurs pour le formulaire