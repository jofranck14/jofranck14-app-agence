import React, { useEffect, useState } from 'react';
import { FaSave, FaArrowLeft, FaTicketAlt, FaCalendarAlt, FaUsers, FaBus, FaInfoCircle, FaRoute } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ModifierReservation = () => {
  const { id } = useParams(); // id_reservation
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date_reservation: '',
    statut: '',
    nombres_places: '',
    id_utilisateur: '',
    id_voyage: ''
  });

  const [voyages, setVoyages] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resRes, resVoy, resUtil] = await Promise.all([
          axios.get(`http://localhost:3000/reservations/${id}`),
          axios.get('http://localhost:3000/voyages'),
          axios.get('http://localhost:3000/utilisateurs')
        ]);

        const reservation = resRes.data;
        setFormData({
          date_reservation: reservation.date_reservation ? new Date(reservation.date_reservation).toISOString().split('T')[0] : '',
          statut: reservation.statut || 'En attente',
          nombres_places: reservation.nombres_places || '',
          id_utilisateur: reservation.id_utilisateur || '',
          id_voyage: reservation.id_voyage || ''
        });

        setVoyages(resVoy.data || []);
        setUtilisateurs(resUtil.data || []);
      } catch (err) {
        console.error('Erreur chargement données:', err);
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de récupérer les détails de la réservation' });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const castValue = (name === 'nombres_places' || name === 'id_voyage' || name === 'id_utilisateur') ? (value === '' ? '' : Number(value)) : value;
    setFormData(prev => ({ ...prev, [name]: castValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // 2. Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.date_reservation) newErrors.date_reservation = 'La date est requise';
    if (!formData.statut) newErrors.statut = 'Le statut est requis';
    if (!formData.nombres_places || formData.nombres_places < 1) newErrors.nombres_places = 'Nombre de places invalide';
    if (!formData.id_utilisateur) newErrors.id_utilisateur = 'Veuillez sélectionner un client';
    if (!formData.id_voyage) newErrors.id_voyage = 'Veuillez sélectionner un voyage';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 3. Soumission
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const payload = {
      ...formData,
      id_voyage: Number(formData.id_voyage),
      id_utilisateur: Number(formData.id_utilisateur),
      nombres_places: Number(formData.nombres_places)
    };
    axios.put(`http://localhost:3000/reservations/${id}`, payload)
      .then(() => {
        // Defer modal to avoid DOM mutation conflicts during commit
        setTimeout(() => {
          Swal.fire({ 
            icon: 'success', 
            title: 'Mise à jour réussie', 
            text: 'La réservation a été modifiée.', 
            timer: 1500, 
            showConfirmButton: false 
          }).then(() => navigate('/reservations/ListeReservations'));
        }, 0);
      })
      .catch(err => {
        const msg = err.response?.data?.error || 'Erreur lors de la modification';
        setTimeout(() => {
          Swal.fire({ icon: 'error', title: 'Erreur', text: msg });
        }, 0);
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
          
          <div className="mb-8 pb-4 border-b border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shadow-inner">
              <FaTicketAlt className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Modifier la Réservation</h1>
              <p className="text-sm text-gray-500">Référence Ticket : #RES-{id}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Client / Utilisateur */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  <FaUsers className="text-indigo-500" /> Client / Passager
                </label>
                <select 
                  name="id_utilisateur" 
                  value={formData.id_utilisateur} 
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.id_utilisateur ? 'border-red-400' : 'border-gray-300'} rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none`}
                >
                  <option value="">-- Sélectionner le passager --</option>
                  {utilisateurs.map(u => (
                    <option key={u.id_utilisateur} value={u.id_utilisateur}>
                      {u.nom} {u.prenom} ({u.telephone})
                    </option>
                  ))}
                </select>
                {errors.id_utilisateur && <p className="mt-1 text-xs text-red-500">{errors.id_utilisateur}</p>}
              </div>

              {/* Voyage */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  <FaBus className="text-indigo-500" /> Voyage assigné
                </label>
                <select 
                  name="id_voyage" 
                  value={formData.id_voyage} 
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.id_voyage ? 'border-red-400' : 'border-gray-300'} rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none`}
                >
                  <option value="">-- Sélectionner l'itinéraire --</option>
                  {voyages.map(v => (
                    <option key={v.id_voyage} value={v.id_voyage}>
                      {v.lieu_depart} → {v.lieu_arrive} | {v.heure_depart} ({v.type})
                    </option>
                  ))}
                </select>
                {errors.id_voyage && <p className="mt-1 text-xs text-red-500">{errors.id_voyage}</p>}
              </div>

              {/* Date Réservation */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  <FaCalendarAlt className="text-indigo-500" /> Date de Réservation
                </label>
                <input 
                  type="date" 
                  name="date_reservation" 
                  value={formData.date_reservation} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>

              {/* Nombre de places */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  <FaUsers className="text-indigo-500" /> Nombre de places
                </label>
                <input 
                  type="number" 
                  name="nombres_places" 
                  value={formData.nombres_places} 
                  onChange={handleChange} 
                  min="1"
                  className={`w-full px-4 py-2.5 border ${errors.nombres_places ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none`} 
                />
              </div>

              {/* Statut */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  <FaInfoCircle className="text-indigo-500" /> État de la réservation
                </label>
                <select 
                  name="statut" 
                  value={formData.statut} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="En attente">En attente</option>
                  <option value="Confirmée">Confirmée</option>
                  <option value="Annulée">Annulée</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
              <Link to="/reservations/ListeReservations" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors">
                <FaArrowLeft /> Annuler
              </Link>
              <button 
                type="submit" 
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all active:scale-95 disabled:opacity-50" 
                disabled={isSubmitting}
              >
                <FaSave /> {isSubmitting ? 'Enregistrement...' : 'Sauvegarder les modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModifierReservation;