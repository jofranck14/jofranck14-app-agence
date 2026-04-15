import React, { useEffect, useState } from 'react';
import { FaSave, FaArrowLeft, FaUserEdit, FaUser, FaEnvelope, FaPhone, FaLock, FaShieldAlt, FaIdBadge } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { normalizePhone, isValidPhone } from '../utils/errorHandler';

const ModifierUtilisateur = () => {
  const { id } = useParams(); // Récupère l'id_utilisateur depuis l'URL
  const navigate = useNavigate();

  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    login: '',
    mot_de_passe: '', // Laissé vide si on ne veut pas changer le mot de passe
    role: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 1. Charger les données actuelles de l'utilisateur
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`http://localhost:3000/utilisateurs/${id}`)
      .then(res => {
        const user = res.data;
        setFormData({
          nom: user.nom || '',
          prenom: user.prenom || '',
          email: user.email || '',
          telephone: user.telephone || '',
          login: user.login || '',
          mot_de_passe: '', // On ne pré-remplit pas le mot de passe pour des raisons de sécurité
          role: user.role || 'Secretaire'
        });
      })
      .catch(err => {
        console.error('Erreur fetch utilisateur:', err);
        const msg = err.response?.data?.error || (err.code ? 'Serveur injoignable' : 'Impossible de charger les données de l\'utilisateur');
        Swal.fire({ icon: 'error', title: 'Erreur', text: msg });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };


  // 2. Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
        newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Format d'email invalide";
    }

    const cleanedPhone = normalizePhone(formData.telephone);
    if (!cleanedPhone) newErrors.telephone = 'Le téléphone est requis';
    else if (!isValidPhone(cleanedPhone)) newErrors.telephone = 'Format de téléphone invalide (9 chiffres, commence par 6)';
    if (!formData.login.trim()) newErrors.login = 'Le login est requis';
    
    // Pour le mot de passe en mode modification, on ne valide que s'il est rempli
    if (formData.mot_de_passe && formData.mot_de_passe.length < 6) {
        newErrors.mot_de_passe = 'Le nouveau mot de passe doit faire au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 3. Soumission des modifications
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError('');

    // On prépare le payload (on n'envoie le mot de passe que s'il a été saisi)
    const payload = { ...formData, telephone: normalizePhone(formData.telephone) };
    console.debug('[DEBUG] ModifierUtilisateur payload:', payload);
    if (!payload.mot_de_passe) {
        delete payload.mot_de_passe;
    }

    axios.put(`http://localhost:3000/utilisateurs/${id}`, payload)
      .then(res => {
        Swal.fire({ 
          icon: 'success', 
          title: 'Mis à jour !', 
          text: 'Le profil utilisateur a été modifié avec succès', 
          timer: 1500, 
          showConfirmButton: false 
        }).then(() => navigate('/utilisateurs/ListeUtilisateurs'));
      })
      .catch(err => {
        console.error('Erreur mise à jour:', err);
        const msg = err.response?.data?.error || (err.code ? 'Serveur injoignable' : 'Erreur lors de la mise à jour');
        setSubmitError(msg);
        Swal.fire({ icon: 'error', title: 'Erreur', text: msg });
      })
      .finally(() => setIsSubmitting(false));
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          
          {/* En-tête */}
          <div className="mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shadow-inner">
                <FaUserEdit className="text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Modifier l'utilisateur</h1>
                <p className="text-sm text-gray-500">Modifier les accès de @{formData.login}</p>
              </div>
            </div>
          </div>

          {submitError && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">{submitError}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nom */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase">
                  <FaIdBadge className="text-indigo-500" /> Nom
                </label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.nom ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all`} />
                {errors.nom && <p className="mt-1 text-xs text-red-600">{errors.nom}</p>}
              </div>

              {/* Prénom */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase">
                  <FaUser className="text-indigo-500" /> Prénom
                </label>
                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.prenom ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all`} />
                {errors.prenom && <p className="mt-1 text-xs text-red-600">{errors.prenom}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase">
                  <FaEnvelope className="text-indigo-500" /> Email
                </label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all`} />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Téléphone */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase">
                  <FaPhone className="text-indigo-500" /> Téléphone
                </label>
                <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.telephone ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all`} />
                {errors.telephone && <p className="mt-1 text-xs text-red-600">{errors.telephone}</p>}
              </div>

              {/* Login */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase">
                  <FaUser className="text-purple-500" /> Identifiant (Login)
                </label>
                <input type="text" name="login" value={formData.login} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.login ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all`} />
                {errors.login && <p className="mt-1 text-xs text-red-600">{errors.login}</p>}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase">
                  <FaLock className="text-purple-500" /> Mot de passe (optionnel)
                </label>
                <input type="password" name="mot_de_passe" value={formData.mot_de_passe} onChange={handleChange} placeholder="Laisser vide pour ne pas changer" className={`w-full px-4 py-2 border ${errors.mot_de_passe ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all`} />
                {errors.mot_de_passe && <p className="mt-1 text-xs text-red-600">{errors.mot_de_passe}</p>}
              </div>

              {/* Rôle */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase">
                  <FaShieldAlt className="text-indigo-500" /> Rôle
                </label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                  <option value="Administrateur">Administrateur</option>
                  <option value="Secretaire">Secrétaire</option>
                  <option value="Client">Client</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
              <Link to="/utilisateurs/ListeUtilisateurs" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors">
                <FaArrowLeft className="w-3 h-3" /> Annuler
              </Link>
              <button type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all active:scale-95 disabled:opacity-50" disabled={isSubmitting}>
                <FaSave /> {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModifierUtilisateur;