import React, { useState, useEffect } from 'react';
import { FaRoute, FaEdit, FaTrash, FaPlus, FaSearch, FaMapMarkerAlt, FaRoad, FaBus, FaUserTie } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ListeTrajets = () => {
  const [trajets, setTrajets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrajets();
  }, []);

  // Gestion des notifications (Toast)
  useEffect(() => {
    const toast = location?.state?.toast;
    if (toast) {
      Swal.fire({ icon: 'success', title: 'Succès', text: toast, timer: 1400, showConfirmButton: false });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location?.state?.toast, navigate, location.pathname]);

  const fetchTrajets = async () => {
    setLoading(true);
    setError('');
    try {
      // Note: Pour afficher l'immatriculation et le nom du chauffeur, 
      // votre API doit faire un JOIN dans le SQL.
      const res = await axios.get('http://localhost:3000/trajets');
      setTrajets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Erreur lors de la récupération des trajets:', err);
      setError('Impossible de charger les trajets.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id_trajet) => {
    const result = await Swal.fire({
      title: 'Confirmer la suppression ?',
      text: "Ce trajet sera définitivement retiré de la base de données.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/trajets/${id_trajet}`);
      setTrajets((prev) => prev.filter((t) => t.id_trajet !== id_trajet));
      Swal.fire({ icon: 'success', title: 'Supprimé', text: 'Trajet supprimé !', timer: 1400, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Erreur lors de la suppression' });
    }
  };

  // Filtrage des trajets par lieu de départ ou d'arrivée
  const filteredTrajets = trajets.filter(t => {
    const term = searchTerm.toLowerCase();
    return (
      t.lieu_depart?.toLowerCase().includes(term) ||
      t.lieu_arrive?.toLowerCase().includes(term)
    );
  });

  // Statistiques basées sur vos colonnes
  const stats = {
    total: trajets.length,
    distanceTotale: trajets.reduce((acc, curr) => acc + (Number(curr.distance) || 0), 0),
    distanceMoyenne: trajets.length > 0 
      ? Math.round(trajets.reduce((acc, curr) => acc + (Number(curr.distance) || 0), 0) / trajets.length) 
      : 0
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Trajets</h1>
            <p className="text-gray-600">Liste des itinéraires et distances</p>
          </div>
          <Link
            to="/trajets/AjoutTrajet"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-all shadow-sm w-full md:w-auto justify-center"
          >
            <FaPlus className="w-4 h-4" />
            <span className="font-medium">Ajouter un trajet</span>
          </Link>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <FaRoute className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Trajets</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <FaRoad className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Distance Cumulée</p>
              <p className="text-2xl font-bold text-gray-800">{stats.distanceTotale} km</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <FaMapMarkerAlt className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Distance Moyenne</p>
              <p className="text-2xl font-bold text-gray-800">{stats.distanceMoyenne} km</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par lieu de départ ou arrivée..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Liste des trajets */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Lieu de Départ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Lieu d'Arrivée</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Bus</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Chauffeur</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-10">Chargement des données...</td></tr>
              ) : filteredTrajets.length > 0 ? (
                filteredTrajets.map((t) => (
                  <tr key={t.id_trajet} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-green-500 w-3 h-3" />
                        {t.lieu_depart}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500 w-3 h-3" />
                        {t.lieu_arrive}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaRoad className="text-gray-400" />
                        <span className="font-bold">{t.distance} km</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaBus className="text-gray-400" />
                        {t.immatriculation || `Bus #${t.id_bus}`} {t.bus_modele ? `- ${t.bus_modele}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaUserTie className="text-gray-400" />
                        {t.chauffeur_nom || `Chauffeur #${t.id_chauffeur}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/trajets/modifier/${t.id_trajet}`}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <FaEdit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(t.id_trajet)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <FaRoute className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Aucun trajet trouvé</p>
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

export default ListeTrajets;