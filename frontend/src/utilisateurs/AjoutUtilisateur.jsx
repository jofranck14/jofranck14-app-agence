import React, { useState } from 'react';
import { FaUserPlus, FaSave, FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaLock, FaShieldAlt, FaIdBadge } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { normalizePhone, isValidPhone } from '../utils/errorHandler';

const AjoutUtilisateur = () => {
  const navigate = useNavigate();
  
  // État initial du formulaire basé sur vos attributs
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    login: '',
    mot_de_passe: '',
    role: 'Client' // Valeur par défaut
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };


  // Validation du formulaire utilisateur
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]{2,50}$/.test(formData.nom)) {
      newErrors.nom = 'Le nom contient des caractères invalides';
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    } else if (formData.prenom.trim().length < 2) {
      newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]{2,50}$/.test(formData.prenom)) {
      newErrors.prenom = 'Le prénom contient des caractères invalides';
    }
    
    // Validation Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    } else if (formData.email.length > 100) {
      newErrors.email = "L'email est trop long";
    }

    const cleanedPhone = normalizePhone(formData.telephone);
    if (!cleanedPhone) {
      newErrors.telephone = 'Le téléphone est requis et dois etre coherent ';
    } else if (!isValidPhone(cleanedPhone)) {
      newErrors.telephone = 'Format de téléphone invalide (9 chiffres, commence par 6)';
    }

    if (!formData.login.trim()) {
      newErrors.login = 'Le login est requis';
    } else if (formData.login.trim().length < 3) {
      newErrors.login = 'Le login doit contenir au moins 3 caractères';
    } else if (!/^[a-zA-Z0-9._-]{3,30}$/.test(formData.login)) {
      newErrors.login = 'Le login contient des caractères invalides (lettres, chiffres, ._- uniquement)';
    }
    
    // Validation Mot de passe
    if (!formData.mot_de_passe) {
      newErrors.mot_de_passe = 'Le mot de passe est requis';
    } else if (formData.mot_de_passe.length < 6) {
      newErrors.mot_de_passe = 'Le mot de passe doit faire au moins 6 caractères';
    } else if (formData.mot_de_passe.length > 50) {
      newErrors.mot_de_passe = 'Le mot de passe est trop long';
    }

    // Validation du rôle
    const validRoles = ['Administrateur', 'Secretaire', 'Client'];
    if (!validRoles.includes(formData.role)) {
      newErrors.role = 'Rôle invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    // Normalize telephone before sending
    const payload = { ...formData, telephone: normalizePhone(formData.telephone) };
    console.debug('[DEBUG] AjoutUtilisateur payload:', payload);

    axios.post('http://localhost:3000/utilisateurs', payload)
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Utilisateur créé',
          text: res.data?.message || 'Le compte a été créé avec succès !',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/utilisateurs/ListeUtilisateurs');
        });
      })
      .catch((err) => {
        const msg = err.response?.data?.error || 
                   (err.response?.status === 0 ? 'Serveur injoignable. Vérifiez votre connexion.' : 
                    'Erreur lors de la création de l\'utilisateur.');
        setSubmitError(msg);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: msg,
          confirmButtonText: 'Réessayer'
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          
          {/* En-tête */}
          <div className="mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <FaUserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Ajouter un utilisateur</h1>
                <p className="text-sm text-gray-500">Créez un nouveau profil d'accès au système</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">{submitError}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Nom */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1 uppercase">
                  <FaIdBadge className="text-indigo-500" /> Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Ex: Jofranck"
                  className={`w-full px-3 py-2 border ${errors.nom ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm`}
                />
                {errors.nom && <p className="mt-1 text-xs text-red-600">{errors.nom}</p>}
              </div>

              {/* Prénom */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1 uppercase">
                  <FaUser className="text-indigo-500" /> Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Ex: Jean"
                  className={`w-full px-3 py-2 border ${errors.prenom ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm`}
                />
                {errors.prenom && <p className="mt-1 text-xs text-red-600">{errors.prenom}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1 uppercase">
                  <FaEnvelope className="text-indigo-500" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jean.dupont@exemple.com"
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Téléphone */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1 uppercase">
                  <FaPhone className="text-indigo-500" /> Téléphone
                </label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+237 6xx xxx xxx"
                  className={`w-full px-3 py-2 border ${errors.telephone ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm`}
                />
                {errors.telephone && <p className="mt-1 text-xs text-red-600">{errors.telephone}</p>}
              </div>

              {/* Login */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1 uppercase">
                  <FaUser className="text-purple-500" /> Identifiant (Login)
                </label>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="jdupont237"
                  className={`w-full px-3 py-2 border ${errors.login ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-2 focus:ring-purple-500 outline-none text-sm`}
                />
                {errors.login && <p className="mt-1 text-xs text-red-600">{errors.login}</p>}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1 uppercase">
                  <FaLock className="text-purple-500" /> Mot de passe
                </label>
                <input
                  type="password"
                  name="mot_de_passe"
                  value={formData.mot_de_passe}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 border ${errors.mot_de_passe ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-2 focus:ring-purple-500 outline-none text-sm`}
                />
                {errors.mot_de_passe && <p className="mt-1 text-xs text-red-600">{errors.mot_de_passe}</p>}
              </div>

              {/* Rôle */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1 uppercase">
                  <FaShieldAlt className="text-indigo-500" /> Rôle de l'utilisateur
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                >
                  <option value="Administrateur">Administrateur</option>
                  <option value="Secretaire">Secrétaire</option>
                  <option value="Client">Client</option>
                </select>
              </div>

            </div>

            {/* Actions */}
            <div className="flex justify-between pt-6 border-t border-gray-100">
              <Link
                to="/utilisateurs/ListeUtilisateurs"
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm transition-colors"
              >
                <FaArrowLeft className="w-3 h-3" />
                <span>Retour à la liste</span>
              </Link>
              
              <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création...
                  </span>
                ) : (
                  <>
                    <FaSave className="w-3 h-3" />
                    <span>Créer le compte</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AjoutUtilisateur;