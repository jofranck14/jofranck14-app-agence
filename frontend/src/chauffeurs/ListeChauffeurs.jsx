import React, { useState, useEffect, useContext } from 'react'; // Ajout de useContext
import { FaUserTie, FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../api/axios'; // Utilisation de l'instance sécurisée
import { AuthContext } from '../context/AuthContext'; // Import du contexte pour les rôles
import Swal from 'sweetalert2';

const ListeChauffeurs = () => {
  const { user } = useContext(AuthContext); // Récupération de l'utilisateur connecté
  const [chauffeurs, setChauffeurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChauffeurs();
  }, []);

  const fetchChauffeurs = async () => {
    setLoading(true);
    setError('');
    try {
      // Appel via 'api' (gère le token et le port 3000 automatiquement)
      const res = await api.get('/chauffeurs'); 
      let payload = res.data;
      
      if (!Array.isArray(payload)) {
        payload = Array.isArray(payload?.rows) ? payload.rows : [];
      }
      setChauffeurs(payload);
    } catch (err) {
      console.error('Erreur chargement chauffeurs:', err);
      setError('Impossible de charger les chauffeurs. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const filteredChauffeurs = (Array.isArray(chauffeurs) ? chauffeurs : []).filter(chauffeur => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const name = String(chauffeur?.nom_chauffeur || '').toLowerCase();
      const phone = String(chauffeur?.telephone_chauffeur || '');
      return name.includes(term) || phone.includes(searchTerm);
    }
    return true;
  });

  const handleDelete = async (id_chauffeur) => {
    const result = await Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer ce chauffeur ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/chauffeurs/${id_chauffeur}`);
      setChauffeurs(prev => prev.filter(ch => ch.id_chauffeur !== id_chauffeur));
      Swal.fire({ icon: 'success', title: 'Supprimé', text: 'Chauffeur supprimé', timer: 1400, showConfirmButton: false });
    } catch (err) {
      console.error('Erreur suppression:', err);
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Vous n\'avez pas l\'autorisation de supprimer ce chauffeur' });
    }
  };

  const formatTelephone = (tel) => {
    if (!tel) return 'Non renseigné';
    return tel.toString().replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Chauffeurs</h1>
            <p className="text-gray-600">Liste complète des chauffeurs enregistrés</p>
          </div>

          {loading && <div className="mb-4 text-blue-600 animate-pulse">Chargement en cours...</div>}
          {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

          {/* BOUTON AJOUTER : Uniquement pour Administrateur */}
          {user?.role === 'Administrateur' && (
            <Link
              to="/chauffeurs/AjoutChauffeur"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-all shadow-md w-full md:w-auto justify-center"
            >
              <FaPlus className="w-4 h-4" />
              <span className="font-medium">Ajouter un chauffeur</span>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par nom ou téléphone..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Téléphone</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChauffeurs.length > 0 ? (
                filteredChauffeurs.map((chauffeur) => (
                  <tr key={chauffeur.id_chauffeur} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{chauffeur.nom_chauffeur}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{formatTelephone(chauffeur.telephone_chauffeur)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* ACTIONS : Uniquement pour Administrateur */}
                        {user?.role === 'Administrateur' ? (
                          <>
                            <Link
                              to={`/chauffeurs/modifier/${chauffeur.id_chauffeur}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="Modifier"
                            >
                              <FaEdit className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(chauffeur.id_chauffeur)}
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <FaTrash className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Lecture seule</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <FaUserTie className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 text-lg">Aucun chauffeur trouvé</p>
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

export default ListeChauffeurs;