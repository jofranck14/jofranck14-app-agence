import React, { useState, useEffect } from 'react';
import { FaBus, FaEdit, FaTrash, FaPlus, FaSearch, FaClock, FaTicketAlt, FaMoneyBillWave, FaRoute } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ListeVoyages = () => {
  const [voyages, setVoyages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVoyages();
  }, []);

  // Gestion des notifications (Toast)
  useEffect(() => {
    const toast = location?.state?.toast;
    if (toast) {
      Swal.fire({ icon: 'success', title: 'Succès', text: toast, timer: 1400, showConfirmButton: false });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location?.state?.toast, navigate, location.pathname]);

  const fetchVoyages = async () => {
    setLoading(true);
    setError('');
    try {
      // Note: Pour afficher les villes de départ/arrivée, votre API doit faire 
      // un JOIN avec la table trajet : SELECT voyage.*, trajet.lieu_depart, trajet.lieu_arrive...
      const res = await axios.get('http://localhost:3000/voyages');
      setVoyages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Erreur lors de la récupération des voyages:', err);
      setError('Impossible de charger les voyages.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id_voyage) => {
    const result = await Swal.fire({
      title: 'Confirmer la suppression ?',
      text: "Ce voyage sera définitivement retiré de la base de données.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/voyages/${id_voyage}`);
      setVoyages((prev) => prev.filter((v) => v.id_voyage !== id_voyage));
      Swal.fire({ icon: 'success', title: 'Supprimé', text: 'Voyage supprimé !', timer: 1400, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Erreur lors de la suppression' });
    }
  };

  // Filtrage des voyages par heure, type ou trajet (si disponible)
  const filteredVoyages = voyages.filter(v => {
    const term = searchTerm.toLowerCase();
    return (
      v.heure_depart?.toLowerCase().includes(term) ||
      v.jour?.toLowerCase().includes(term) ||
      v.type?.toLowerCase().includes(term) ||
      v.lieu_depart?.toLowerCase().includes(term) || // Si JOIN fait en SQL
      v.lieu_arrive?.toLowerCase().includes(term)    // Si JOIN fait en SQL
    );
  });

  // Statistiques basées sur les voyages
  const stats = {
    total: voyages.length,
    prixTotal: voyages.reduce((acc, curr) => acc + (Number(curr.prix) || 0), 0),
    vip: voyages.filter(v => v.type?.toLowerCase() === 'vip').length
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Voyages</h1>
            <p className="text-gray-600">Planification des départs et tarifs</p>
          </div>
          <Link
            to="/voyages/AjoutVoyage"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-all shadow-sm w-full md:w-auto justify-center"
          >
            <FaPlus className="w-4 h-4" />
            <span className="font-medium">Créer un voyage</span>
          </Link>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <FaTicketAlt className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Voyages</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <FaMoneyBillWave className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Chiffre d'Affaire Potentiel</p>
              <p className="text-2xl font-bold text-gray-800">{stats.prixTotal.toLocaleString()} FCFA</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <FaBus className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Voyages VIP</p>
              <p className="text-2xl font-bold text-gray-800">{stats.vip}</p>
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
            placeholder="Rechercher par heure, type ou trajet..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Liste des voyages */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Jour</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Heure Départ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Itinéraire (ID)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prix</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-10">Chargement des départs...</td></tr>
              ) : filteredVoyages.length > 0 ? (
                filteredVoyages.map((v) => (
                  <tr key={v.id_voyage} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2 text-indigo-600">
                        {v.jour || <span className="text-gray-400">—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2 text-indigo-600">
                        <FaClock className="w-3 h-3" />
                        {v.heure_depart}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaRoute className="text-gray-400" />
                        {v.lieu_depart && v.lieu_arrive ? (
                          <span className="font-medium">{v.lieu_depart} → {v.lieu_arrive}</span>
                        ) : (
                          <span className="text-gray-400 italic">Trajet #{v.id_trajet}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        v.type?.toLowerCase() === 'vip' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                        {v.type?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {v.prix?.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/voyages/modifier/${v.id_voyage}`}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <FaEdit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(v.id_voyage)}
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
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <FaBus className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Aucun voyage programmé</p>
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

export default ListeVoyages;