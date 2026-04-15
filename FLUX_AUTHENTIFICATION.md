# Flux d'Authentification - Application Transport

## Vue d'ensemble
Le flux d'authentification a été configuré selon vos spécifications. Voici le parcours utilisateur :

## 🚀 Parcours Utilisateur

### 1. **Accès à l'Application**
- **Route racine (`/`)** : Affiche la page d'accueil (`Acceuil.jsx`)
- C'est la première page que l'utilisateur verra en ouvrant l'application

### 2. **Page d'Accueil** (`Acceuil.jsx`)
La page d'accueil contient :
- ✅ Bouton **"Se connecter"** → Redirection vers `/login`
- ✅ Bouton **"S'inscrire"** → Redirection vers `/inscription`
- Navigation principale de l'application

### 3. **Deux Parcours Possibles**

#### **Parcours A : Nouvel Utilisateur (S'inscrire)**
1. Utilisateur clique sur **"S'inscrire"** sur la page d'accueil
2. Remplit le formulaire d'inscription (`Inscription.jsx`)
3. Valide et envoie les données
4. ✅ **Auto-connexion automatique** après l'inscription
   - Les données sont sauvegardées dans `localStorage`
   - L'utilisateur est connecté automatiquement
   - Redirection vers `/dashboard`

#### **Parcours B : Utilisateur Existant (Se Connecter)**
1. Utilisateur clique sur **"Se connecter"** sur la page d'accueil
2. Saisit ses identifiants (`Login.jsx`)
3. Envoie les informations
4. ✅ Redirection automatique vers `/dashboard` après connexion réussie

## 📋 Routes Configurées

### Routes Publiques
```javascript
GET / → Acceuil.jsx (Page d'accueil)
GET /acceuil → Acceuil.jsx (Alternative)
GET /login → Login.jsx (Page de connexion)
GET /inscription → Inscription.jsx (Page d'inscription)
```

### Routes Protégées (Nécessitent une connexion)
```javascript
GET /dashboard → Dashboard.jsx (Accessible à tous les utilisateurs connectés)
GET /bus/* → Gestion des bus
GET /chauffeurs/* → Gestion des chauffeurs
GET /utilisateurs/* → Gestion des utilisateurs (Admin uniquement)
// ... et autres routes protégées selon les rôles
```

## 🔐 Mécanismes de Sécurité

### AuthContext
- Gère l'état d'authentification de l'application
- Stocke l'utilisateur et le token dans `localStorage`
- Vérifie automatiquement la session au démarrage

### PrivateRoutes
- Protège toutes les routes nécessitant une authentification
- Redirection vers `/login` si pas de token valide

### RoleProtectedRoute
- Contrôle d'accès basé sur les rôles (Admin, Secrétaire, Client)
- Permet un accès granulaire aux fonctionnalités

## 🔄 Flux Complet d'Inscription et Connexion Automatique

```
1. Utilisateur remplit le formulaire d'inscription
   ↓
2. POST /utilisateurs (créer le compte)
   ↓
3. ✅ Compte créé avec succès
   ↓
4. POST /auth/login (auto-connexion avec les identifiants)
   ↓
5. ✅ Récupération du token et user
   ↓
6. Sauvegarde dans localStorage via AuthContext.login()
   ↓
7. Redirection automatique vers /dashboard
```

## 📱 Boutons de Navigation

### Sur la Page d'Accueil
- Bouton **"Se connecter"** → `/login`
- Bouton **"S'inscrire"** → `/inscription`

### Sur les Pages de Connexion et Inscription
- Bouton **"Retour à l'accueil"** (nouvelle fonctionnalité) → `/`
- Permet de revenir à la page d'accueil à tout moment

## 🛠️ Modifications Apportées

### 1. **App.jsx**
- Route `/` configurée pour afficher `Acceuil.jsx`
- Route `/inscription` ajoutée et connectée à `Inscription.jsx`
- Import du composant `Inscription` ajouté

### 2. **Inscription.jsx**
- Import de `useContext` et `AuthContext` pour auto-connexion
- Modification du `handleSubmit` pour :
  - Créer le compte via POST /utilisateurs
  - Auto-connecter l'utilisateur via POST /auth/login
  - Rediriger vers `/dashboard` en cas de succès
  - Rediriger vers `/login` en cas d'échec de la connexion automatique

### 3. **Login.jsx**
- Bouton **"Retour à l'accueil"** ajouté avec icône
- Import de `Link` et `FaArrowLeft` de react-router-dom et react-icons

## ✅ Points Clés

1. ✅ Page d'accueil comme point d'entrée principal
2. ✅ Deux options claires : S'inscrire ou Se Connecter
3. ✅ Auto-connexion après inscription (pas besoin de revalider)
4. ✅ Redirection automatique vers le dashboard
5. ✅ Bouton de retour à l'accueil sur les pages d'auth
6. ✅ Aucune route "orpheline" - toutes les pages sont accessibles

## 🧪 Test Manuel

1. Ouvrir `http://localhost:3000` → Vérifier que vous arrivez sur la page d'accueil
2. Cliquer sur **"S'inscrire"** → Remplir le formulaire et soumettre
3. Vérifier la redirection automatique vers le dashboard
4. Se déconnecter (bouton logout)
5. Cliquer sur **"Se connecter"** → Entrer les identifiants
6. Vérifier la redirection automatique vers le dashboard

## 📌 Notes

- L'endpoint `/auth/login` doit retourner `{ user, token }` pour que l'auto-connexion fonctionne
- Les données sont stockées dans `localStorage` et restent même après fermeture du navigateur
- La session est vérifiée au chargement de l'app via le `loading` state dans `AuthContext`
