# Projet TaskFlow - Système de Gestion des Tâches

## Groupe de travail
* **Chef de projet**: Yasmine Elhamoudani
* **Membres**:["Yasmine Messaoudi","Aya Marzouq","Ibtissam Ghaoual","Diallo Mata"]

## Fonctionnalités
* Authentification avec JWT et Bcrypt.
## Répartition des tâches (Tableau de bord de l'équipe)

| Membre | Rôle / Fonctionnalités | Détails Techniques |
| :--- | :--- | :--- |
| **Yasmine ElHamoudani** (Chef de project) | **F1** (Authentification) & **F8** (Membres) | JWT, Bcrypt, Middleware de protection, Invitations par email. |
| **Aya Marzouq** (Membre 2) | **F2** (Projets) & **F3** (Tâches) | CRUD Projets/Tâches, Schémas Mongoose, Suppression en cascade. |
| **Diallo Mata** (Membre 3) | **F4** (Assignation) & **F6** (Filtrage) | .populate(), Pagination, Recherche par mots-clés ($regex). |
| **Ibtissam Ghaoual** (Membre 4) | **F5** (Dashboard) & **F9** (Historique) | Pipeline d'agrégation MongoDB, Suivi chronologique des actions. |
| **Yasmine Messaoudi** (Membre 5) | **F7** (Brouillons) & **F10** (Notifications) | LocalStorage (auto-save), Polling JavaScript (setInterval). |