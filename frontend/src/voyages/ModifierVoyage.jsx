import React, { useEffect, useState } from 'react';
import { FaSave, FaArrowLeft, FaClock, FaTicketAlt, FaMoneyBillWave, FaRoute } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ModifierVoyage = () => {
  const { id } = useParams(); // Récupère l'id_voyage depuis l'URL
  const navigate = useNavigate();

  // État pour les données du formulaire voyage
  const [formData, setFormData] = useState({
    // use time input: 'HH:MM'
    heure_depart: '',
    jour: '',
    type: '',
    prix: '',
    id_trajet: ''
  });

  // Helpers to convert between DB datetime and input value
  const dbToLocal = (datetime) => {
    if (!datetime) return '';
    // Accept formats like 'YYYY-MM-DD HH:MM:SS' or ISO strings
    let d = datetime;
    // If server returned a Date object, convert to ISO string
    if (d instanceof Date) d = d.toISOString();
    // If server returned a numeric timestamp (seconds or ms), convert to ISO
    if (typeof d === 'number' || /^\d+$/.test(String(d))) {
      const num = Number(d);
      const ms = num > 1e12 ? num : num * 1000; // detect seconds vs ms
      d = new Date(ms).toISOString();
    }
    // If server returned time-only 'HH:MM' or 'HH:MM:SS', return 'HH:MM' for <input type=time>
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(d)) {
      const m = d.match(/^(\d{2}:\d{2})/);
      return m ? m[1] : '';
    }
    if (d.includes(' ')) d = d.replace(' ', 'T');
    // Keep only YYYY-MM-DDTHH:MM
    const m = d.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
    return m ? m[1] : d;
  };

  // Convert local time 'HH:MM' or 'HH:MM:SS' to 'HH:MM:SS'
  const localToDb = (local) => {
    if (!local) return null;
    if (/^\d{2}:\d{2}$/.test(local)) return `${local}:00`;
    if (/^\d{2}:\d{2}:\d{2}$/.test(local)) return local;
    return null;
  };

  // États pour la liste des trajets et la gestion de l'interface
  const [trajets, setTrajets] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les données (Le voyage à modifier + liste des trajets disponibles)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resVoyage, resTrajets] = await Promise.all([
          axios.get(`http://localhost:3000/voyages/${id}`),
          axios.get('http://localhost:3000/trajets')
        ]);

        // Peupler le formulaire avec les données du voyage (convertir datetime)
        if (resVoyage.data) {
          setFormData({
            heure_depart: dbToLocal(resVoyage.data.heure_depart) || '',
            jour: resVoyage.data.jour || '',
            type: resVoyage.data.type || '',
            prix: resVoyage.data.prix || '',
            id_trajet: resVoyage.data.id_trajet || ''
          });
        }
        
        setTrajets(resTrajets.data || []);
      } catch (err) {
        console.error('Erreur chargement:', err);
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de charger les données du voyage.' });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.heure_depart) newErrors.heure_depart = "L'heure de départ est requise";
    else if (!/^\d{2}:\d{2}(:\d{2})?$/.test(formData.heure_depart)) newErrors.heure_depart = "Format heure invalide (HH:MM)";
    if (!formData.type) newErrors.type = "Le type de voyage est requis";
    if (!formData.prix || formData.prix <= 0) newErrors.prix = 'Prix invalide';
    if (!formData.id_trajet) newErrors.id_trajet = 'Veuillez assigner un trajet';
    const allowedDays = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
    if (!formData.jour) newErrors.jour = 'Veuillez renseigner le jour du départ';
    else if (!allowedDays.includes(formData.jour)) newErrors.jour = 'Jour invalide (choisir Lundi → Dimanche)';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Convert heure_depart back to DB TIME format 'HH:MM:SS'
    const payload = { 
      ...formData, 
      heure_depart: localToDb(formData.heure_depart),
      prix: Number(formData.prix), 
      id_trajet: Number(formData.id_trajet) 
    };

    axios.put(`http://localhost:3000/voyages/${id}`, payload)
      .then(() => {
        Swal.fire({ 
          icon: 'success', 
          title: 'Mise à jour réussie', 
          text: 'Le voyage a été modifié avec succès.', 
          timer: 1500, 
          showConfirmButton: false 
        }).then(() => navigate('/voyages/ListeVoyages'));
      })
      .catch(err => {
        console.error('Erreur SQL:', err);
        Swal.fire({ 
          icon: 'error', 
          title: 'Échec', 
          text: err.response?.data?.message || err.message || 'Erreur lors de la mise à jour.' 
        });
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          
          {/* En-tête */}
          <div className="mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shadow-inner">
                <FaTicketAlt className="text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Modifier le Voyage</h1>
                <p className="text-sm text-gray-500">Référence voyage : #{id}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Heure de Départ */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  <FaClock className="text-indigo-500" /> Heure de départ
                </label>
                <input
                  type="time"
                  name="heure_depart"
                  value={formData.heure_depart}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.heure_depart ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                />
                {errors.heure_depart && <p className="mt-1 text-xs text-red-500">{errors.heure_depart}</p>}
              </div>

              {/* Type de Voyage */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  <FaTicketAlt className="text-amber-500" /> Type de voyage
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.type ? 'border-red-400' : 'border-gray-300'} rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                >
                  <option value="">Sélectionner le type</option>
                  <option value="Classique">Classique</option>
                  <option value="VIP">VIP</option>
                  <option value="Premium">Premium</option>
                </select>
                {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
              </div>

              {/* Prix */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  <FaMoneyBillWave className="text-green-500" /> Prix (FCFA)
                </label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.prix ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                />
                {errors.prix && <p className="mt-1 text-xs text-red-500">{errors.prix}</p>}
              </div>

              {/* Trajet Associé */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  <FaRoute className="text-blue-500" /> Itinéraire / Trajet
                </label>
                <select
                  name="id_trajet"
                  value={formData.id_trajet}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.id_trajet ? 'border-red-400' : 'border-gray-300'} rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                >
                  <option value="">Sélectionner le trajet</option>
                  {trajets.map(t => (
                    <option key={t.id_trajet} value={t.id_trajet}>
                      {t.lieu_depart} → {t.lieu_arrive}
                    </option>
                  ))}
                </select>
                {errors.id_trajet && <p className="mt-1 text-xs text-red-500">{errors.id_trajet}</p>}
              </div>

              {/* Jour */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Jour</label>
                <select
                  name="jour"
                  value={formData.jour}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.jour ? 'border-red-400' : 'border-gray-300'} rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
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
                {errors.jour && <p className="mt-1 text-xs text-red-500">{errors.jour}</p>}
              </div>

            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
              <Link
                to="/voyages/ListeVoyages"
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors"
              >
                <FaArrowLeft className="w-3 h-3" />
                <span>Annuler</span>
              </Link>
              
              <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
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
                    <span>Enregistrer les modifications</span>
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

export default ModifierVoyage;