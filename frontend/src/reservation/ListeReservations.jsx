import React, { useState, useEffect } from 'react';
import { 
  FaTicketAlt, FaEdit, FaTrash, FaSearch, FaFilter, 
  FaCalendarAlt, FaUser, FaRoute, FaCheckCircle, FaClock, FaPlus 
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ListeReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  // Notification après création/modification
  useEffect(() => {
    const toast = location?.state?.toast;
    if (toast) {
      Swal.fire({ icon: 'success', title: 'Succès', text: toast, timer: 1400, showConfirmButton: false });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location?.state?.toast, navigate, location.pathname]);

  const fetchReservations = async () => {
    setLoading(true);
    setError('');
    try {
      // Note: Votre API doit faire des JOIN avec Utilisateur et Voyage/Trajet
      // SELECT r.*, u.nom, u.prenom, v.heure_depart, t.lieu_depart, t.lieu_arrive...
      const res = await axios.get('http://localhost:3000/reservations');
      setReservations(res.data || []);
    } catch (err) {
      console.error('Erreur chargement réservations:', err);
      setError('Impossible de charger les réservations.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id_reservation) => {
    const result = await Swal.fire({
      title: 'Annuler la réservation ?',
      text: "Cette action libérera les places pour ce voyage.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Fermer'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/reservations/${id_reservation}`);
      setReservations(prev => prev.filter(r => r.id_reservation !== id_reservation));
      Swal.fire({ icon: 'success', title: 'Supprimé', text: 'Réservation annulée !', timer: 1400, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de supprimer' });
    }
  };

  // Filtrage intelligent
  const filteredReservations = reservations.filter(res => {
    const term = searchTerm.toLowerCase();
    // Recherche par nom du passager ou ville de destination
    const matchesSearch =
      res.nom?.toLowerCase().includes(term) ||
      res.prenom?.toLowerCase().includes(term) ||
      res.lieu_arrive?.toLowerCase().includes(term);

    const matchesStatut = filterStatut === 'Tous' || res.statut === filterStatut;

    return matchesSearch && matchesStatut;
  });

  // Styles dynamiques pour le statut
  const getStatutStyle = (statut) => {
    switch (statut) {
      case 'Confirmée': return 'bg-green-100 text-green-700 border-green-200';
      case 'En attente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Annulée': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const stats = {
    total: reservations.length,
    confirmees: reservations.filter(r => r.statut === 'Confirmée').length,
    placesVendues: reservations.reduce((acc, curr) => acc + (curr.nombres_places || 0), 0)
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaTicketAlt className="text-indigo-600" /> Gestion des Réservations
          </h1>
          <p className="text-gray-600">Suivi des tickets et occupation des bus</p>
        </div>
        <Link
          to="/reservations/AjoutReservation"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-200 justify-center"
        >
          <FaPlus />
          <span className="font-medium">Nouvelle Réservation</span>
        </Link>
      </div>

      {/* Cartes de Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl">
            <FaTicketAlt />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Réservations</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl">
            <FaCheckCircle />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Confirmées</p>
            <p className="text-2xl font-bold text-gray-800">{stats.confirmees}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl">
            <FaCalendarAlt />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Places Occupées</p>
            <p className="text-2xl font-bold text-gray-800">{stats.placesVendues}</p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un passager ou une destination..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
        >
          <option value="Tous">Tous les statuts</option>
          <option value="Confirmée">Confirmée</option>
          <option value="En attente">En attente</option>
          <option value="Annulée">Annulée</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Passager</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Voyage / Trajet</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Places</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Statut</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-10 text-gray-400 font-medium italic">Chargement des tickets...</td></tr>
              ) : filteredReservations.length > 0 ? (
                filteredReservations.map((r) => (
                  <tr key={r.id_reservation} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                          {r.nom?.charAt(0)}{r.prenom?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{r.nom} {r.prenom}</div>
                          <div className="text-[10px] text-gray-400 font-mono">REF: #RES-{r.id_reservation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                          <FaRoute className="text-xs text-gray-400" /> {r.lieu_depart} → {r.lieu_arrive}
                        </span>
                        <span className="text-xs text-indigo-500 flex items-center gap-1 mt-1">
                          <FaClock className="text-[10px]" /> {r.heure_depart} | {new Date(r.date_reservation).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-sm font-bold text-gray-700">
                        {r.nombres_places}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatutStyle(r.statut)}`}>
                        {r.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/reservations/modifier/${r.id_reservation}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(r.id_reservation)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <FaTicketAlt className="w-12 h-12 mx-auto mb-3 opacity-10" />
                    <p>Aucune réservation trouvée</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListeReservations;