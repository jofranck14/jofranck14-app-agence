import React, { useState, useEffect } from 'react';
import { FaRoute, FaSave, FaArrowLeft, FaMapMarkerAlt, FaBus, FaUserTie, FaRoad } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
// CHANGEMENT ICI : Utilisation de l'instance api sécurisée
import api from '../api/axios'; 
import Swal from 'sweetalert2';

const AjoutTrajet = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    lieu_depart: '',
    lieu_arrive: '',
    distance: '',
    id_bus: '',
    id_chauffeur: ''
  });

  const [buses, setBuses] = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // CHANGEMENT ICI : Utilisation de api.get sans l'URL complète
        const [resBus, resChauffeur] = await Promise.all([
          api.get('/bus'),
          api.get('/chauffeur')
        ]);
        setBuses(Array.isArray(resBus.data) ? resBus.data : []);
        setChauffeurs(Array.isArray(resChauffeur.data) ? resChauffeur.data : []);
      } catch (err) {
        console.error("Erreur de chargement des données secondaires", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.lieu_depart.trim()) {
      newErrors.lieu_depart = 'Lieu de départ requis';
    } else if (formData.lieu_depart.trim().length < 2) {
      newErrors.lieu_depart = 'Le lieu doit contenir au moins 2 caractères';
    }
    
    if (!formData.lieu_arrive.trim()) {
      newErrors.lieu_arrive = "Lieu d'arrivée requis";
    } else if (formData.lieu_arrive.trim().length < 2) {
      newErrors.lieu_arrive = 'Le lieu doit contenir au moins 2 caractères';
    }

    if (!formData.distance || isNaN(formData.distance)) {
      newErrors.distance = 'Distance invalide';
    } else if (parseFloat(formData.distance) <= 0 || parseFloat(formData.distance) > 10000) {
      newErrors.distance = 'Distance doit être entre 1 et 10000 km';
    }
    
    if (!formData.id_bus) {
      newErrors.id_bus = 'Veuillez choisir un bus';
    }
    
    if (!formData.id_chauffeur) {
      newErrors.id_chauffeur = 'Veuillez choisir un chauffeur';
    }

    // Vérifier que départ et arrivée sont différents
    if (formData.lieu_depart.trim() === formData.lieu_arrive.trim()) {
      newErrors.lieu_arrive = 'Le lieu d\'arrivée doit être différent du départ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      ...formData,
      distance: Number(formData.distance),
      id_bus: Number(formData.id_bus),
      id_chauffeur: Number(formData.id_chauffeur)
    };

    // CHANGEMENT ICI : Utilisation de api.post
    api.post('/trajets', payload)
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Le trajet a été enregistré avec succès !',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/trajets/ListeTrajets');
      })
      .catch((err) => {
        console.error('Erreur:', err.response);
        Swal.fire({
          icon: 'error',
          title: 'Erreur ' + (err.response?.status || ''),
          text: err.response?.data?.message || "Impossible d'enregistrer le trajet."
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          
          <div className="mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FaRoute className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Ajouter un trajet</h1>
                <p className="text-sm text-gray-500">Définissez les informations de l'itinéraire</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                  <FaMapMarkerAlt className="text-green-500" /> Lieu de départ
                </label>
                <input
                  type="text"
                  name="lieu_depart"
                  value={formData.lieu_depart}
                  onChange={handleChange}
                  placeholder="Ex: Douala"
                  className={`w-full px-3 py-2 border ${errors.lieu_depart ? 'border-red-300' : 'border-gray-300'} rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none`}
                />
                {errors.lieu_depart && <p className="mt-1 text-xs text-red-600">{errors.lieu_depart}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                  <FaMapMarkerAlt className="text-red-500" /> Lieu d'arrivée
                </label>
                <input
                  type="text"
                  name="lieu_arrive"
                  value={formData.lieu_arrive}
                  onChange={handleChange}
                  placeholder="Ex: Yaoundé"
                  className={`w-full px-3 py-2 border ${errors.lieu_arrive ? 'border-red-300' : 'border-gray-300'} rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none`}
                />
                {errors.lieu_arrive && <p className="mt-1 text-xs text-red-600">{errors.lieu_arrive}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                  <FaRoad className="text-gray-500" /> Distance (km)
                </label>
                <input
                  type="number"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  placeholder="Ex: 250"
                  className={`w-full px-3 py-2 border ${errors.distance ? 'border-red-300' : 'border-gray-300'} rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none`}
                />
                {errors.distance && <p className="mt-1 text-xs text-red-600">{errors.distance}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                  <FaBus className="text-blue-500" /> Bus assigné
                </label>
                <select
                  name="id_bus"
                  value={formData.id_bus}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.id_bus ? 'border-red-300' : 'border-gray-300'} rounded text-sm bg-white focus:ring-1 focus:ring-blue-500 outline-none`}
                >
                  <option value="">Sélectionner un bus</option>
                  {buses.map(bus => (
                    <option key={bus.id_bus} value={bus.id_bus}>
                      {bus.immatriculation} - {bus.modele}
                    </option>
                  ))}
                </select>
                {errors.id_bus && <p className="mt-1 text-xs text-red-600">{errors.id_bus}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                  <FaUserTie className="text-purple-500" /> Chauffeur
                </label>
                <select
                  name="id_chauffeur"
                  value={formData.id_chauffeur}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.id_chauffeur ? 'border-red-300' : 'border-gray-300'} rounded text-sm bg-white focus:ring-1 focus:ring-blue-500 outline-none`}
                >
                  <option value="">Sélectionner un chauffeur</option>
                  {chauffeurs.map(c => (
                    <option key={c.id_chauffeur} value={c.id_chauffeur}>
                      {c.nom_chauffeur || `${c.nom || ''} ${c.prenom || ''}`}
                    </option>
                  ))}
                </select>
                {errors.id_chauffeur && <p className="mt-1 text-xs text-red-600">{errors.id_chauffeur}</p>}
              </div>

            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
              <Link
                to="/trajets/ListeTrajets"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-3 py-2 text-sm transition-colors"
              >
                <FaArrowLeft className="w-3 h-3" />
                <span>Retour à la liste</span>
              </Link>
              
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-bold shadow-sm disabled:opacity-60 transition-all active:scale-95"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enregistrement...
                  </span>
                ) : (
                  <>
                    <FaSave className="w-3 h-3" />
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

export default AjoutTrajet;