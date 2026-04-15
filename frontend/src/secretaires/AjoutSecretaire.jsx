import React, { useState } from 'react';
import { FaUsers, FaSave, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const AjoutSecretaire = () => {
  const navigate = useNavigate();
  
  // État initial du formulaire secretaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    mot_passe: ''
  });

  // État pour les erreurs de validation
  const [errors, setErrors] = useState({});

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
    
    // Validation du nom
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    // Validation du prénom
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Validation du téléphone
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    } else if (!/^[0-9+\s-]{10,15}$/.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide';
    }
    
    // Validation de l'adresse
    if (!formData.adresse.trim()) {
      newErrors.adresse = 'L\'adresse est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Ici, vous enverriez normalement les données à votre API
      console.log('secretaire ajouté:', formData);
      
      // Message de succès
      alert('secretaire ajouté avec succès !');
      
      // Redirection vers la liste des secretaires
      navigate('/secretaires/AjoutSecretaire');
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          
          {/* En-tête */}
          <div className="mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <FaUsers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Ajouter une secretaire</h1>
                <p className="text-sm text-gray-500">Remplissez les informations</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Grille sur 2 colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nom */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Dupont"
                  className={`w-full px-3 py-2 border ${errors.nom ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm`}
                />
                {errors.nom && (
                  <p className="mt-1 text-xs text-red-600">{errors.nom}</p>
                )}
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Jean"
                  className={`w-full px-3 py-2 border ${errors.prenom ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm`}
                />
                {errors.prenom && (
                  <p className="mt-1 text-xs text-red-600">{errors.prenom}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jean.dupont@email.com"
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="612 345 678"
                  className={`w-full px-3 py-2 border ${errors.telephone ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm`}
                />
                {errors.telephone && (
                  <p className="mt-1 text-xs text-red-600">{errors.telephone}</p>
                )}
              </div>

              {/* Type de secretaire */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  mot de passe 
                </label>
                <input
                  type="password"
                  name="mot_passe"
                  value={formData.mot_passe}
                  onChange={handleChange}
                  placeholder=""
                  className={`w-full px-3 py-2 border ${errors.prenom ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm`}
                />
              </div>

            </div>

            {/* Adresse (pleine largeur) */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  adresse <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  placeholder="Jean"
                  className={`w-full px-3 py-2 border ${errors.adresse ? 'border-red-300' : 'border-gray-300'} rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm`}
                />
                {errors.prenom && (
                  <p className="mt-1 text-xs text-red-600">{errors.adresse}</p>
                )}
              </div>

            {/* Actions */}
            <div className="flex justify-between pt-4">
              <Link
                to="/secretaires/ListeSecretaires"
                className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 px-3 py-2 text-sm"
              >
                <FaArrowLeft className="w-3 h-3" />
                <span>Retour</span>
              </Link>
              
              <button
                type="submit"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
              >
                <FaSave className="w-3 h-3" />
                <span>Enregistrer</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AjoutSecretaire;