import React, { useState, useEffect } from 'react';
import { FaPlus, FaSave, FaArrowLeft, FaClock, FaTicketAlt, FaMoneyBillWave, FaRoute } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AjoutVoyage = () => {
  const navigate = useNavigate();
  
  // État pour les données du formulaire selon vos colonnes SQL
  const [formData, setFormData] = useState({
    // Using datetime-local to collect date + time
    heure_depart: '',
    jour: '',
    type: 'Classique', // Valeur par défaut
    prix: '',
    id_trajet: ''
  });

  // États pour la liste des trajets (nécessaire pour lier un voyage à un trajet)
  const [trajets, setTrajets] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les trajets au montage pour remplir le menu déroulant
  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        const res = await axios.get('http://localhost:3000/trajets');
        setTrajets(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erreur de chargement des trajets", err);
      }
    };
    fetchTrajets();
  }, []);

  // Convert local time (input type=time) to TIME string 'HH:MM:SS'
  const localToDb = (local) => {
    if (!local) return null;
    // local like 'HH:MM' or 'HH:MM:SS'
    if (/^\d{2}:\d{2}$/.test(local)) return `${local}:00`;
    if (/^\d{2}:\d{2}:\d{2}$/.test(local)) return local;
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.heure_depart) {
      newErrors.heure_depart = "L'heure de départ est requise";
    }
    
    if (!formData.type) {
      newErrors.type = "Le type de voyage est requis";
    } else if (!['Classique', 'Express', 'VIP'].includes(formData.type)) {
      newErrors.type = "Type de voyage invalide";
    }
    
    if (!formData.prix || isNaN(formData.prix)) {
      newErrors.prix = 'Prix invalide';
    } else if (parseFloat(formData.prix) <= 0 || parseFloat(formData.prix) > 100000) {
      newErrors.prix = 'Le prix doit être entre 1 et 100000';
    }
    
    if (!formData.id_trajet) {
      newErrors.id_trajet = 'Veuillez sélectionner un trajet';
    }
    
    const allowedDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    if (!formData.jour) {
      newErrors.jour = 'Veuillez renseigner le jour du départ';
    } else if (!allowedDays.includes(formData.jour)) {
      newErrors.jour = 'Jour invalide (choisir Lundi → Dimanche)';
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
      heure_depart: localToDb(formData.heure_depart),
      prix: Number(formData.prix),
      id_trajet: Number(formData.id_trajet)
    };

    axios.post('http://localhost:3000/voyages', payload)
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Le voyage a été créé avec succès !',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/voyages/ListeVoyages');
      })
      .catch((err) => {
        console.error('Erreur:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur ' + (err.response?.status || ''),
          text: err.response?.data?.message || err.message || "Impossible de créer le voyage."
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          
          {/* En-tête */}
          <div className="mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FaPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Créer un voyage</h1>
                <p className="text-sm text-gray-500">Planifiez un nouvel horaire de départ</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Heure de Départ */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                  <FaClock className="text-indigo-500" /> Heure de départ
                </label>
                <input
                  type="time"
                  name="heure_depart"
                  value={formData.heure_depart}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.heure_depart ? 'border-red-300' : 'border-gray-300'} rounded text-sm focus:ring-1 focus:ring-indigo-500 outline-none`}
                />
                {errors.heure_depart && <p className="mt-1 text-xs text-red-600">{errors.heure_depart}</p>}
              </div>

              {/* Type de Voyage */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                  <FaTicketAlt className="text-amber-500" /> Type de voyage
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value="Classique">Classique</option>
                  <option value="VIP">VIP</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              {/* Prix */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                  <FaMoneyBillWave className="text-green-500" /> Prix du ticket (FCFA)
                </label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  placeholder="Ex: 5000"
                  className={`w-full px-3 py-2 border ${errors.prix ? 'border-red-300' : 'border-gray-300'} rounded text-sm focus:ring-1 focus:ring-indigo-500 outline-none`}
                />
                {errors.prix && <p className="mt-1 text-xs text-red-600">{errors.prix}</p>}
              </div>

              {/* Trajet Associé */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                  <FaRoute className="text-blue-500" /> Itinéraire / Trajet
                </label>
                <select
                  name="id_trajet"
                  value={formData.id_trajet}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.id_trajet ? 'border-red-300' : 'border-gray-300'} rounded text-sm bg-white focus:ring-1 focus:ring-indigo-500 outline-none`}
                >
                  <option value="">Sélectionner le trajet</option>
                  {trajets.map(t => (
                    <option key={t.id_trajet} value={t.id_trajet}>
                      {t.lieu_depart} → {t.lieu_arrive} ({t.distance} km)
                    </option>
                  ))}
                </select>
                {errors.id_trajet && <p className="mt-1 text-xs text-red-600">{errors.id_trajet}</p>}
              </div>

              {/* Jour */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">Jour</label>
                <select
                  name="jour"
                  value={formData.jour}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.jour ? 'border-red-300' : 'border-gray-300'} rounded text-sm bg-white focus:ring-1 focus:ring-indigo-500 outline-none`}
                >
                  <option value="">Sélectionner le jour</option>
                  <option value="Lundi">Lundi</option>
                  <option value="Mardi">Mardi</option>
                  <option value="Mercredi">Mercredi</option>
                  <option value="Jeudi">Jeudi</option>
                  <option value="Vendredi">Vendredi</option>
                  <option value="Samedi">Samedi</option>
                  <option value="Dimanche">Dimanche</option>
                </select>
                {errors.jour && <p className="mt-1 text-xs text-red-600">{errors.jour}</p>}
              </div>

            </div>

            {/* Actions */}
            <div className="flex justify-between pt-6 border-t border-gray-100">
              <Link
                to="/voyages/ListeVoyages"
                className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm transition-colors"
              >
                <FaArrowLeft className="w-3 h-3" />
                <span>Retour à la liste</span>
              </Link>
              
              <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded text-sm font-bold shadow-sm disabled:opacity-60 transition-all active:scale-95"
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
                    <span>Enregistrer le voyage</span>
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

export default AjoutVoyage;