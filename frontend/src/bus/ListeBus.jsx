import React, { useState, useEffect } from 'react';
import { FaBus, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListeBus = () => {
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show toast passed via navigation state (e.g., after creation)
  useEffect(() => {
    try {
      const toast = location?.state?.toast;
      if (toast) {
        Swal.fire({ icon: 'success', title: 'Succès', text: toast, timer: 1400, showConfirmButton: false });
        // Clear the toast state so it doesn't show on further navigation
        navigate(location.pathname, { replace: true, state: {} });
      }
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state?.toast]);

  const fetchBuses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:3000/bus');
      setBuses(res.data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des bus:', err);
      setError('Impossible de charger les bus.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les bus selon la recherche et le filtre (calculé à chaque rendu)
  const filteredBuses = buses.filter(bus => {
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        bus.immatriculation.toLowerCase().includes(term) ||
        bus.modele.toLowerCase().includes(term);
      if (!matchesSearch) return false;
    }
    
    // Filtre par statut
    if (filterStatut !== 'Tous' && bus.statut !== filterStatut) {
      return false;
    }
    
    return true;
  });

  // Supprimer un bus (API)
  const handleDelete = async (id_bus) => {
    const result = await Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer ce bus ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/bus/${id_bus}`);
      setBuses((prev) => prev.filter((b) => b.id_bus !== id_bus));
      Swal.fire({ icon: 'success', title: 'Supprimé', text: 'Bus supprimé !', timer: 1400, showConfirmButton: false });
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Erreur lors de la suppression' });
    }
  };

  // Obtenir la couleur selon le statut avec texte blanc et largeur fixe
  const getStatutStyle = (statut) => {
    switch (statut) {
      case 'disponible': return 'bg-green-500 text-white';
      case 'en voyage': return 'bg-blue-500 text-white';
      case 'en maintenance': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Formater le statut pour l'affichage
  const formatStatut = (statut) => {
    switch (statut) {
      case 'disponible': return 'Disponible';
      case 'en voyage': return 'En voyage';
      case 'en maintenance': return 'Maintenance';
      default: return statut;
    }
  };

  // Largeur fixe pour tous les badges de statut
  const statutWidth = "min-w-[100px] w-[100px]";

  // Statistiques basées sur votre table
  const stats = {
    total: buses.length,
    disponible: buses.filter(b => b.statut === 'disponible').length,
    enVoyage: buses.filter(b => b.statut === 'en voyage').length,
    enMaintenance: buses.filter(b => b.statut === 'en maintenance').length,
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Bus</h1>
            <p className="text-gray-600">Liste des bus</p>
          </div>
          <Link
            to="/bus/AjoutBus"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 w-full md:w-auto justify-center md:justify-start"
          >
            <FaPlus className="w-4 h-4" />
            <span className="font-medium">Ajouter un bus</span>
          </Link>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bus</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaBus className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-gray-800">{stats.disponible}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En voyage</p>
                <p className="text-2xl font-bold text-gray-800">{stats.enVoyage}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En maintenance</p>
                <p className="text-2xl font-bold text-gray-800">{stats.enMaintenance}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Barre de recherche et filtres */}
      {loading && (
        <div className="mb-4">Chargement des bus...</div>
      )}
      {error && (
        <div className="mb-4 text-red-600">{error}</div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un bus par immatriculation ou modèle..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>``
          
          {/* Filtre par statut */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500 w-4 h-4" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
            >
              <option value="Tous">Tous les statuts</option>
              <option value="disponible">Disponible</option>
              <option value="en voyage">En voyage</option>
              <option value="en maintenance">En maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des bus */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Immatriculation
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modèle
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacité
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBuses.length > 0 ? (
                filteredBuses.map((bus) => (
                  <tr key={bus.id_bus} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900 text-base">{bus.immatriculation}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-gray-900 text-base">{bus.modele}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900 text-base">{bus.capacite} places</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className={`inline-block ${statutWidth}`}>
                        <span className={`inline-flex justify-center items-center w-full px-3 py-2 rounded text-sm font-medium ${getStatutStyle(bus.statut)}`}>
                          {formatStatut(bus.statut)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <Link
                          to={`/bus/modifier/${bus.id_bus}`}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        > 
                          <FaEdit className="w-5 h-5" />
                        </Link>
                       <button
  onClick={() => handleDelete(bus.id_bus)}
  className="text-red-600 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors duration-200"
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
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FaBus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">Aucun bus trouvé</p>
                      <p className="text-sm mt-1">Essayez de modifier vos critères de recherche</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredBuses.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredBuses.length}</span> sur{' '}
                <span className="font-medium">{filteredBuses.length}</span> bus
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Précédent
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-blue-50 text-blue-600 border-blue-200">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeBus;