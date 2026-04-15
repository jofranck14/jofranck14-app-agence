import React, { useEffect, useState, useContext } from 'react'; // Ajout de useContext
import { FaSave, FaArrowLeft, FaUserTie, FaPhone } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios'; // CHANGEMENT : Utilisation de l'instance sécurisée
import { AuthContext } from '../context/AuthContext'; // IMPORT : Pour vérifier les droits
import Swal from 'sweetalert2';

const ModifierChauffeur = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Récupération de l'utilisateur

  const [formData, setFormData] = useState({ nom_chauffeur: '', telephone_chauffeur: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 1. SÉCURITÉ : Vérifier le rôle au montage du composant
  useEffect(() => {
    if (user && user.role !== 'Administrateur') {
      Swal.fire({
        icon: 'error',
        title: 'Accès interdit',
        text: 'Seul un Administrateur peut modifier un chauffeur.',
      });
      navigate('/chauffeurs/ListeChauffeurs');
    }
  }, [user, navigate]);

  // 2. CHARGEMENT : Récupérer les données initiales du chauffeur
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // Utilisation de api.get (le token est géré automatiquement)
    api.get(`/chauffeurs/${id}`)
      .then(res => {
        const c = res.data;
        setFormData({ 
          nom_chauffeur: c.nom_chauffeur || '', 
          telephone_chauffeur: String(c.telephone_chauffeur || '') 
        });
      })
      .catch(err => {
        console.error('Erreur chargement chauffeur:', err);
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de charger les données du chauffeur' });
        navigate('/chauffeurs/ListeChauffeurs');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom_chauffeur.trim()) {
        newErrors.nom_chauffeur = 'Le nom est requis';
    }
    // Validation souple pour les chiffres (9 à 12 chiffres selon pays)
    if (formData.telephone_chauffeur && !/^[0-9]{9,12}$/.test(String(formData.telephone_chauffeur))) {
        newErrors.telephone_chauffeur = 'Format de téléphone invalide';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError('');

    const telephone = String(formData.telephone_chauffeur || '').trim();
    const payload = { 
        nom_chauffeur: formData.nom_chauffeur.trim(), 
        telephone_chauffeur: telephone || null 
    };

    // 3. ENVOI : Mise à jour via api.put
    api.put(`/chauffeurs/${id}`, payload)
      .then(res => {
        Swal.fire({ 
            icon: 'success', 
            title: 'Succès', 
            text: res.data?.message || 'Chauffeur mis à jour avec succès', 
            timer: 1200, 
            showConfirmButton: false 
        }).then(() => navigate('/chauffeurs/ListeChauffeurs'));
      })
      .catch(err => {
        console.error('Erreur update chauffeur:', err);
        setSubmitError(err.response?.data?.error || 'Erreur lors de la mise à jour');
      })
      .finally(() => setIsSubmitting(false));
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow p-8">
          
          <div className="mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                 <FaUserTie className="text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Modifier un chauffeur</h1>
                <p className="text-gray-500 text-sm mt-0.5">Mettez à jour les informations de Reference : #{id}</p>
              </div>
            </div>
          </div>

          {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm mb-4">
                  {submitError}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="nom_chauffeur" 
                value={formData.nom_chauffeur} 
                onChange={handleChange} 
                className={`w-full px-4 py-3 border ${errors.nom_chauffeur ? 'border-red-400 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`} 
              />
              {errors.nom_chauffeur && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.nom_chauffeur}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Numéro de Téléphone
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
                  className={`w-full pl-10 pr-4 py-3 border ${errors.telephone_chauffeur ? 'border-red-400 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`} 
                />
              </div>
              {errors.telephone_chauffeur && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.telephone_chauffeur}</p>}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <Link 
                to="/chauffeurs/ListeChauffeurs" 
                className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors"
              > 
                <FaArrowLeft className="w-3 h-3" /> Retour
              </Link>
              
              <button 
                type="submit" 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md shadow-blue-100 transition-all active:scale-95 disabled:opacity-60" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Enregistrement...</span>
                    </>
                ) : (
                    <><FaSave className="w-4 h-4" /> Enregistrer</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModifierChauffeur;