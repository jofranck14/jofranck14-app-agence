import React, { useEffect, useState } from 'react';
import { FaSave, FaArrowLeft, FaRoute, FaMapMarkerAlt, FaRoad, FaBus, FaUserTie } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
// CHANGEMENT ICI : On utilise ton instance api au lieu de axios standard
import api from '../api/axios'; 
import Swal from 'sweetalert2';

const ModifierTrajet = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // CHANGEMENT ICI : Utilisation de api.get et suppression de l'URL en dur
        const [resTrajet, resBus, resChauffeur] = await Promise.all([
          api.get(`/trajets/${id}`),
          api.get('/bus'),
          api.get('/chauffeur')
        ]);

        if (resTrajet.data) {
          setFormData({
            lieu_depart: resTrajet.data.lieu_depart || '',
            lieu_arrive: resTrajet.data.lieu_arrive || '',
            distance: resTrajet.data.distance || '',
            id_bus: resTrajet.data.id_bus || '',
            id_chauffeur: resTrajet.data.id_chauffeur || ''
          });
        }
        
        setBuses(resBus.data || []);
        setChauffeurs(resChauffeur.data || []);
      } catch (err) {
        console.error('Erreur chargement:', err);
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de charger les données du trajet.' });
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
    if (!formData.lieu_depart?.trim()) newErrors.lieu_depart = 'Lieu de départ requis';
    if (!formData.lieu_arrive?.trim()) newErrors.lieu_arrive = "Lieu d'arrivée requis";
    if (!formData.distance || formData.distance <= 0) newErrors.distance = 'Distance invalide';
    if (!formData.id_bus) newErrors.id_bus = 'Veuillez assigner un bus';
    if (!formData.id_chauffeur) newErrors.id_chauffeur = 'Veuillez assigner un chauffeur';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const payload = { ...formData, distance: Number(formData.distance), id_bus: Number(formData.id_bus), id_chauffeur: Number(formData.id_chauffeur) };
    
    // CHANGEMENT ICI : Utilisation de api.put et suppression de l'URL en dur
    api.put(`/trajets/${id}`, payload)
      .then(() => {
        Swal.fire({ 
          icon: 'success', 
          title: 'Mise à jour réussie', 
          text: 'Le trajet a été modifié avec succès.', 
          timer: 1500, 
          showConfirmButton: false 
        }).then(() => navigate('/trajets/ListeTrajets'));
      })
      .catch(err => {
        console.error('Erreur SQL:', err);
        Swal.fire({ 
          icon: 'error', 
          title: 'Échec', 
          text: err.response?.data?.message || 'Erreur lors de la mise à jour.' 
        });
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          
          <div className="mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shadow-inner">
                <FaRoute className="text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Modifier le Trajet</h1>
                <p className="text-sm text-gray-500">Référence du trajet : #{id}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  <FaMapMarkerAlt className="text-green-500" /> Lieu de départ
                </label>
                <input
                  type="text"
                  name="lieu_depart"
                  value={formData.lieu_depart}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.lieu_depart ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                />
                {errors.lieu_depart && <p className="mt-1 text-xs text-red-500">{errors.lieu_depart}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  <FaMapMarkerAlt className="text-red-500" /> Lieu d'arrivée
                </label>
                <input
                  type="text"
                  name="lieu_arrive"
                  value={formData.lieu_arrive}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.lieu_arrive ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                />
                {errors.lieu_arrive && <p className="mt-1 text-xs text-red-500">{errors.lieu_arrive}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  <FaRoad className="text-gray-500" /> Distance (km)
                </label>
                <input
                  type="number"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.distance ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                />
                {errors.distance && <p className="mt-1 text-xs text-red-500">{errors.distance}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  <FaBus className="text-blue-500" /> Bus assigné
                </label>
                <select
                  name="id_bus"
                  value={formData.id_bus}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="">Sélectionner un bus</option>
                  {buses.map(b => (
                    <option key={b.id_bus} value={b.id_bus}>{b.immatriculation} - {b.modele}</option>
                  ))}
                </select>
                {errors.id_bus && <p className="mt-1 text-xs text-red-500">{errors.id_bus}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  <FaUserTie className="text-purple-500" /> Chauffeur assigné
                </label>
                <select
                  name="id_chauffeur"
                  value={formData.id_chauffeur}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="">Sélectionner un chauffeur</option>
                  {chauffeurs.map(c => (
                    <option key={c.id_chauffeur} value={c.id_chauffeur}>{c.nom_chauffeur || `${c.nom || ''} ${c.prenom || ''}`}</option>
                  ))}
                </select>
                {errors.id_chauffeur && <p className="mt-1 text-xs text-red-500">{errors.id_chauffeur}</p>}
              </div>

            </div>

            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
              <Link
                to="/trajets/ListeTrajets"
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium transition-colors"
              >
                <FaArrowLeft className="w-3 h-3" />
                <span>Annuler les modifications</span>
              </Link>
              
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
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
                    <span>Sauvegarder les changements</span>
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

export default ModifierTrajet;