# Site Web du Mariage de L & C

Ce projet est le site web "Save the Date" pour le mariage de L & C.

## Aperçu

Le site présente les informations de base sur l'événement et permet aux invités de confirmer leur présence via un formulaire. Il a été développé en utilisant React, TypeScript, Vite, et stylisé avec Tailwind CSS et shadcn/ui.

## Fonctionnalités

- **Page d'accueil** : Présente la date (11.07.2026) et le lieu du mariage (Corse, près d'Ajaccio) avec un design personnalisé.
- **Formulaire "Save the Date"** :
    - Les invités peuvent soumettre leur nom, prénom et email.
    - Un champ conditionnel permet d'ajouter des accompagnants. Ce champ n'est visible que si l'URL contient le paramètre `?withGuests=true`.
    - Les réponses sont envoyées à une feuille Google Sheets via un webhook créé avec Google Apps Script.
- **Design Responsive** : Le site est entièrement responsive et s'adapte aux appareils mobiles et de bureau.

## Technologies utilisées

- **Framework** : React avec Vite
- **Langage** : TypeScript
- **Style** : Tailwind CSS
- **Composants UI** : shadcn/ui
- **Déploiement** : Vercel

## Développement local

Pour lancer le projet localement, suivez ces étapes :

1.  **Cloner le dépôt et s'y déplacer**
    ```sh
    git clone <URL_DU_REPO>
    cd ui-replica-canvas-pro
    ```

2.  **Installer les dépendances**
    ```sh
    npm install
    ```
    ou
    ```sh
    bun install
    ```

3.  **Lancer le serveur de développement**
    ```sh
    npm run dev
    ```
    Le site sera accessible à l'adresse `http://localhost:5173`.

## Scripts Google Apps

Un script a été mis en place sur une feuille Google Sheets pour agir comme un webhook et collecter les réponses du formulaire. Le script est configuré pour créer des colonnes dynamiques pour les informations des accompagnants si elles sont fournies.
