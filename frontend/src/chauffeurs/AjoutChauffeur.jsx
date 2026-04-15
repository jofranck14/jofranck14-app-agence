import React, { useState, useContext, useEffect } from 'react'; // Ajout de useContext et useEffect
import { FaUserTie, FaSave, FaArrowLeft, FaPhone } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios'; // CHANGEMENT : Utilisation de l'instance sécurisée
import { AuthContext } from '../context/AuthContext'; // IMPORT : Pour vérifier les droits
import Swal from 'sweetalert2';
import { normalizePhone, isValidPhone } from '../utils/errorHandler';

const AjoutChauffeur = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Récupération de l'utilisateur
  
  const [formData, setFormData] = useState({
    nom_chauffeur: '',
    telephone_chauffeur: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // SÉCURITÉ : Rediriger si l'utilisateur n'est pas Administrateur
  useEffect(() => {
    if (user && user.role !== 'Administrateur') {
      Swal.fire({
        icon: 'error',
        title: 'Accès interdit',
        text: 'Seul un Administrateur peut ajouter un chauffeur.',
      });
      navigate('/chauffeurs/ListeChauffeurs');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom_chauffeur.trim()) {
      newErrors.nom_chauffeur = 'Le nom est requis';
    } else if (formData.nom_chauffeur.trim().length < 2) {
      newErrors.nom_chauffeur = 'Le nom doit contenir au moins 2 caractères';
    } else if (formData.nom_chauffeur.trim().length > 50) {
      newErrors.nom_chauffeur = 'Le nom est trop long (max 50 caractères)';
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]{2,50}$/.test(formData.nom_chauffeur)) {
      newErrors.nom_chauffeur = 'Le nom contient des caractères invalides';
    }
    
    // Validation téléphone camerounais : doit être 9 chiffres commençant par 6 si fourni
    if (formData.telephone_chauffeur && formData.telephone_chauffeur.trim()) {
      const cleaned = normalizePhone(formData.telephone_chauffeur);
      if (!cleaned || !isValidPhone(cleaned)) {
        newErrors.telephone_chauffeur = 'Format invalide (9 chiffres, commence par 6)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    const payload = {
      nom_chauffeur: formData.nom_chauffeur.trim(),
      telephone_chauffeur: normalizePhone(formData.telephone_chauffeur) || null
    };

    // UTILISATION DE API.POST (plus d'URL en dur, le token est géré)
    api.post('/chauffeurs', payload)
      .then(res => {
        Swal.fire({ 
            icon: 'success', 
            title: 'Chauffeur ajouté', 
            text: res.data?.message || 'Chauffeur ajouté avec succès !', 
            timer: 2000, 
            showConfirmButton: false 
        }).then(() => navigate('/chauffeurs/ListeChauffeurs'));
      })
      .catch(err => {
        console.error('Erreur création chauffeur:', err);
        const errorMsg = err.response?.data?.error || 'Impossible de créer le chauffeur.';
        setSubmitError(errorMsg);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMsg,
          confirmButtonText: 'Réessayer'
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow p-6">
          
          <div className="mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FaUserTie className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Ajouter un chauffeur</h1>
                <p className="text-gray-600 text-sm mt-0.5">Remplissez les informations du nouveau personnel</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {submitError}
                </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom_chauffeur"
                value={formData.nom_chauffeur}
                onChange={handleChange}
                placeholder="Ex: Jean Dupont"
                className={`w-full px-4 py-3 border ${errors.nom_chauffeur ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
              />
              {errors.nom_chauffeur && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.nom_chauffeur}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FaPhone className="w-3 h-3 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="telephone_chauffeur"
                  value={formData.telephone_chauffeur}
                  onChange={handleChange}
                  placeholder="6XXXXXXXX"
                  className={`w-full pl-10 pr-4 py-3 border ${errors.telephone_chauffeur ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                />
              </div>
              {errors.telephone_chauffeur ? (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.telephone_chauffeur}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-500 italic font-medium">Format: 6XXXXXXXX</p>
              )}
            </div>

            <div className="pt-4">
              <div className="h-px bg-gray-100"></div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Link
                to="/chauffeurs/ListeChauffeurs"
                className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </Link>
              
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md shadow-blue-100 transition-all disabled:opacity-60 active:scale-95"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Enregistrement...</span>
                    </>
                ) : (
                    <>
                        <FaSave className="w-4 h-4" />
                        <span>Enregistrer</span>
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

export default AjoutChauffeur;