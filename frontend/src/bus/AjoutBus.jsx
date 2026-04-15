import React, { useState } from 'react';
import { FaBus, FaSave, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AjoutBus = () => {
  const navigate = useNavigate();
  
  // État initial du formulaire
  const [formData, setFormData] = useState({
    immatriculation: '',
    modele: '',
    capacite: '',
    statut: 'disponible'
  });

  // État pour les erreurs de validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Validation de l'immatriculation
    if (!formData.immatriculation.trim()) {
      newErrors.immatriculation = 'L\'immatriculation est requise';
    } else if (formData.immatriculation.trim().length < 5) {
      newErrors.immatriculation = 'L\'immatriculation doit contenir au moins 5 caractères';
    } else if (!/^[A-Z0-9\-\s]{5,20}$/.test(formData.immatriculation.trim())) {
      newErrors.immatriculation = 'Format invalide (lettres, chiffres et tirets uniquement)';
    }
    
    // Validation du modèle
    if (!formData.modele.trim()) {
      newErrors.modele = 'Le modèle est requis';
    } else if (formData.modele.trim().length < 2) {
      newErrors.modele = 'Le modèle doit contenir au moins 2 caractères';
    }
    
    // Validation de la capacité
    if (!formData.capacite) {
      newErrors.capacite = 'La capacité est requise';
    } else if (isNaN(formData.capacite) || parseInt(formData.capacite) < 10 || parseInt(formData.capacite) > 80) {
      newErrors.capacite = 'La capacité doit être entre 10 et 80 places';
    }

    // Validation du statut
    if (!['disponible', 'en_maintenance', 'indisponible'].includes(formData.statut)) {
      newErrors.statut = 'Statut invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate first
    if (!validateForm()) return;

    // Prepare payload
    const payload = {
      immatriculation: formData.immatriculation.trim().toUpperCase(),
      modele: formData.modele.trim(),
      capacite: Number(formData.capacite),
      statut: formData.statut
    };

    setIsSubmitting(true);
    setSubmitError('');

    axios.post('http://localhost:3000/bus', payload)
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Bus ajouté',
          text: res.data?.message || 'Le bus a été créé avec succès !',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/bus/ListeBus');
        });
      })
      .catch((err) => {
        console.error('Erreur lors de la création du bus:', err?.response || err);
        const errorMsg = err.response?.data?.error || err.message || 'Erreur lors de l\'ajout du bus.';
        setSubmitError(errorMsg);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMsg,
          confirmButtonText: 'Réessayer'
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="p-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          
          {/* En-tête */}
          <div className="mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FaBus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Ajouter un bus</h1>
                <p className="text-sm text-gray-500">Remplissez les informations</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && <div className="text-red-600 mb-2">{submitError}</div>}
            
            {/* Grille sur 2 colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Immatriculation */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Immatriculation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="immatriculation"
                  value={formData.immatriculation}
                  onChange={handleChange}
                  placeholder="AB-123-CD"
                  className={`w-full px-3 py-2 border ${errors.immatriculation ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                />
                {errors.immatriculation && (
                  <p className="mt-1 text-xs text-red-600">{errors.immatriculation}</p>
                )}
              </div>

              {/* Modèle */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Modèle <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="modele"
                  value={formData.modele}
                  onChange={handleChange}
                  placeholder="Mercedes Tourismo"
                  className={`w-full px-3 py-2 border ${errors.modele ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                />
                {errors.modele && (
                  <p className="mt-1 text-xs text-red-600">{errors.modele}</p>
                )}
              </div>

              {/* Capacité */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Capacité (places) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="capacite"
                  value={formData.capacite}
                  onChange={handleChange}
                  placeholder="50"
                  min="10"
                  max="80"
                  className={`w-full px-3 py-2 border ${errors.capacite ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                />
                {errors.capacite && (
                  <p className="mt-1 text-xs text-red-600">{errors.capacite}</p>
                )}
              </div>

              {/* Statut */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <div className="relative">
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none text-sm"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="en voyage">En voyage</option>
                    <option value="en maintenance">En maintenance</option>
                    <option value="hors service">Hors service</option>
                  </select>
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4">
              <Link
                to="/bus/ListeBus"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-3 py-2 text-sm"
              >
                <FaArrowLeft className="w-3 h-3" />
                <span>Retour</span>
              </Link>
              
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-60"
                disabled={isSubmitting}
              >
                <FaSave className="w-3 h-3" />
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <span>Enregistrer</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AjoutBus;