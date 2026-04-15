/**
 * Gestion centralisée des erreurs d'API et de formulaires
 */

/**
 * Extrait le message d'erreur d'une réponse d'erreur axios
 * @param {Error} error - L'erreur axios
 * @returns {string} - Le message d'erreur approprié
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message === 'Network Error') {
    return 'Erreur de connexion. Veuillez vérifier votre connexion Internet.';
  }
  
  if (error.code === 'ECONNABORTED') {
    return 'La demande a expiré. Veuillez réessayer.';
  }
  
  if (error.response?.status === 401) {
    return 'Vous n\'êtes pas autorisé. Veuillez vous reconnecter.';
  }
  
  if (error.response?.status === 403) {
    return 'Accès refusé. Vous n\'avez pas la permission d\'effectuer cette action.';
  }
  
  if (error.response?.status === 404) {
    return 'La ressource demandée n\'existe pas.';
  }
  
  if (error.response?.status === 500) {
    return 'Erreur serveur. Veuillez réessayer plus tard.';
  }
  
  return error.message || 'Une erreur s\'est produite. Veuillez réessayer.';
};

/**
 * Affiche une notification d'erreur SweetAlert2
 * @param {Error} error - L'erreur
 * @param {string} title - Titre de la notification (optionnel)
 * @param {Function} callback - Fonction de callback après fermeture
 */
export const showErrorAlert = (error, title = 'Erreur', callback) => {
  const Swal = require('sweetalert2').default;
  
  const message = getErrorMessage(error);
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonText: 'OK'
  }).then(callback);
};

/**
 * Affiche une notification de succès
 * @param {string} message - Message de succès
 * @param {string} title - Titre (optionnel)
 * @param {Function} callback - Fonction de callback
 */
export const showSuccessAlert = (message, title = 'Succès', callback) => {
  const Swal = require('sweetalert2').default;
  
  Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    timer: 2000,
    showConfirmButton: false
  }).then(callback);
};

/**
 * Valide une adresse email
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valide un numéro de téléphone (5-15 chiffres, + optionnel)
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  // Valide exactement 9 chiffres et commençant par 6 (ex: 6XXXXXXXX)
  if (!phone) return false;
  const s = String(phone).replace(/\D/g, '');
  return /^6\d{8}$/.test(s);
};

/**
 * Normalise un numéro de téléphone
 * @param {string} value 
 * @returns {string}
 */
export const normalizePhone = (value) => {
  if (!value) return '';
  // Supprime tout caractère non numérique
  let s = String(value).trim().replace(/\D/g, '');
  // Si l'utilisateur a préfixé par l'indicatif 237, on le retire
  if (s.startsWith('237') && s.length > 9) {
    s = s.slice(3);
  }
  // Garder uniquement les 9 premiers chiffres si possible
  if (s.length >= 9) s = s.slice(0, 9);
  // Retourner la chaîne seulement si elle correspond au format attendu
  return /^6\d{8}$/.test(s) ? s : '';
};

/**
 * Formate un numéro de téléphone 9-chiffres en affichage lisible
 * Exemple: 650123456 -> 650 123 456
 */
export const formatPhone = (value) => {
  if (!value) return '';
  const s = String(value).replace(/\D/g, '');
  let cleaned = s;
  if (cleaned.startsWith('237') && cleaned.length > 9) cleaned = cleaned.slice(3);
  if (!/^6\d{8}$/.test(cleaned)) return value;
  return `${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6)}`;
};

/**
 * Valide une URL simple
 * @param {string} url 
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Valide un nom ou prénom
 * @param {string} name 
 * @returns {boolean}
 */
export const isValidName = (name) => {
  const regex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
  return regex.test(name);
};

/**
 * Valide un login (alphanumérique, ._- )
 * @param {string} login 
 * @returns {boolean}
 */
export const isValidLogin = (login) => {
  const regex = /^[a-zA-Z0-9._-]{3,30}$/;
  return regex.test(login);
};

/**
 * Valide un mot de passe
 * @param {string} password 
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6 && password.length <= 50;
};

export default {
  getErrorMessage,
  showErrorAlert,
  showSuccessAlert,
  isValidEmail,
  isValidPhone,
  normalizePhone,
  formatPhone,
  isValidUrl,
  isValidName,
  isValidLogin,
  isValidPassword
};
