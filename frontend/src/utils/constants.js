/**
 * Constantes API pour les endpoints
 */

export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Authentification
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  
  // Bus
  BUS_LIST: '/bus',
  BUS_CREATE: '/bus',
  BUS_UPDATE: '/bus/:id',
  BUS_DELETE: '/bus/:id',
  
  // Clients
  CLIENTS_LIST: '/clients',
  CLIENTS_CREATE: '/clients',
  CLIENTS_UPDATE: '/clients/:id',
  CLIENTS_DELETE: '/clients/:id',
  
  // Réservations
  RESERVATIONS_LIST: '/reservations',
  RESERVATIONS_CREATE: '/reservations',
  RESERVATIONS_UPDATE: '/reservations/:id',
  RESERVATIONS_DELETE: '/reservations/:id',
  
  // Trajets
  TRAJETS_LIST: '/trajets',
  TRAJETS_CREATE: '/trajets',
  TRAJETS_UPDATE: '/trajets/:id',
  TRAJETS_DELETE: '/trajets/:id',
  
  // Utilisateurs
  UTILISATEURS_LIST: '/utilisateurs',
  UTILISATEURS_CREATE: '/utilisateurs',
  UTILISATEURS_UPDATE: '/utilisateurs/:id',
  UTILISATEURS_DELETE: '/utilisateurs/:id',
  
  // Chauffeurs
  CHAUFFEURS_LIST: '/chauffeur',
  CHAUFFEURS_CREATE: '/chauffeurs',
  CHAUFFEURS_UPDATE: '/chauffeurs/:id',
  CHAUFFEURS_DELETE: '/chauffeurs/:id',
  
  // Voyages
  VOYAGES_LIST: '/voyages',
  VOYAGES_CREATE: '/voyages',
  VOYAGES_UPDATE: '/voyages/:id',
  VOYAGES_DELETE: '/voyages/:id',
  
  // Secrétaires
  SECRETAIRES_LIST: '/secretaires',
  SECRETAIRES_CREATE: '/secretaires',
  SECRETAIRES_UPDATE: '/secretaires/:id',
  SECRETAIRES_DELETE: '/secretaires/:id',
  
  // Paiements
  CREATE_PAYMENT_INTENT: '/create-payment-intent'
};

/**
 * Messages de validation
 */
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'Ce champ est requis',
  INVALID_EMAIL: 'Format d\'email invalide',
  INVALID_PHONE: 'Format de téléphone invalide',
  INVALID_PASSWORD: 'Le mot de passe doit contenir au moins 6 caractères',
  INVALID_NAME: 'Le nom contient des caractères invalides',
  INVALID_LOGIN: 'Le login contient des caractères invalides',
  MIN_LENGTH: (field, length) => `${field} doit contenir au moins ${length} caractères`,
  MAX_LENGTH: (field, length) => `${field} ne doit pas dépasser ${length} caractères`,
  RANGE: (field, min, max) => `${field} doit être entre ${min} et ${max}`
};

/**
 * Rôles utilisateur
 */
export const USER_ROLES = {
  ADMIN: 'Administrateur',
  SECRETARY: 'Secretaire',
  CLIENT: 'Client',
  DRIVER: 'Chauffeur'
};

/**
 * Statuts d'entités
 */
export const STATUSES = {
  BUS: {
    AVAILABLE: 'disponible',
    MAINTENANCE: 'en_maintenance',
    UNAVAILABLE: 'indisponible'
  },
  RESERVATION: {
    CONFIRMED: 'Confirmée',
    PENDING: 'En attente',
    CANCELLED: 'Annulée',
    COMPLETED: 'Complétée'
  },
  VOYAGE: {
    CLASSIC: 'Classique',
    EXPRESS: 'Express',
    VIP: 'VIP'
  }
};

/**
 * Jours de la semaine
 */
export const DAYS_OF_WEEK = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche'
];

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  VALIDATION_MESSAGES,
  USER_ROLES,
  STATUSES,
  DAYS_OF_WEEK
};
