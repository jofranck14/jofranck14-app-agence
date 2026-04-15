import React, { useState, useEffect } from 'react';
import { FaUsers, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaEnvelope, FaPhone, FaUserTie } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { formatPhone } from '../utils/errorHandler';

const ListeSecretaires = () => {
  const [secretaires, setSecretaires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVille, setFilterVille] = useState('Tous'); // Exemple de filtre par ville/agence
  
  const location = useLocation();
  const navigate = useNavigate();

  // Notification après ajout/modification
  useEffect(() => {
    if (location.state?.toast) {
      Swal.fire({ icon: 'success', title: 'Succès', text: location.state.toast, timer: 1500, showConfirmButton: false });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // 1. Charger les utilisateurs et filtrer uniquement les secrétaires
  const fetchSecretaires = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:3000/utilisateurs');
      // On ne garde que ceux qui ont le rôle Secretaire
      const liste = (res.data || []).filter(u => u.role === 'Secretaire' || u.role === 'Secrétaire');
      setSecretaires(liste);
    } catch (err) {
      console.error('Erreur chargement secrétaires:', err);
      setError('Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecretaires();
  }, []);

  // 2. Filtrer selon la recherche (Nom, Prénom, Email, Login)
  const filteredSecretaires = secretaires.filter(s => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      s.nom?.toLowerCase().includes(term) ||
      s.prenom?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.login?.toLowerCase().includes(term);

    // Exemple de filtre par "agence" si vous décidez d'utiliser le filtre ville plus tard
    // Ici on simule que le filtre "Tous" est toujours actif
    return matchesSearch;
  });

  // 3. Supprimer un compte
  const handleDelete = async (id_utilisateur) => {
    const result = await Swal.fire({
      title: 'Confirmation',
      text: 'Supprimer définitivement ce compte secrétaire ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/utilisateurs/${id_utilisateur}`);
      setSecretaires(prev => prev.filter(s => s.id_utilisateur !== id_utilisateur));
      Swal.fire({ icon: 'success', title: 'Supprimé', text: 'Compte supprimé', timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Action impossible' });
    }
  };

  const formatTelephone = (tel) => {
    if (!tel) return 'Non renseigné';
    const formatted = formatPhone(tel);
    return formatted || 'Non renseigné';
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Secrétaires</h1>
            <p className="text-gray-600">Liste des utilisateurs ayant accès au secrétariat</p>
          </div>
          <Link
            to="/utilisateurs/AjoutUtilisateur"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-all shadow-md"
          >
            <FaPlus className="w-4 h-4" />
            <span className="font-medium">Ajouter une secrétaire</span>
          </Link>
        </div>
      </div>
         {/* Statistiques rapides */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <FaUsers className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Secretaire</p>
              <p className="text-2xl font-bold text-gray-800">{secretaire.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <FaUserTag className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Actifs</p>
              <p className="text-2xl font-bold text-gray-800">{filteredSecretaire.length}</p>
            </div>
          </div>
        </div> */}
      {/* Barre de recherche */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou login..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500 w-4 h-4" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={filterVille}
              onChange={(e) => setFilterVille(e.target.value)}
            >
              <option value="Tous">Toutes les agences</option>
              <option value="Yaoundé">Yaoundé</option>
              <option value="Douala">Douala</option>
              <option value="Bafoussam">Bafoussam</option>
            </select>
          </div> */}
        </div>
      </div>
    

      {/* Tableau */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-10 text-center text-gray-500">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nom & Prénom</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Identifiant</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSecretaires.length > 0 ? (
                  filteredSecretaires.map((s) => (
                    <tr key={s.id_utilisateur} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-400">#{s.id_utilisateur}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                            {s.nom.charAt(0)}
                          </div>
                          <div className="font-semibold text-gray-900">{s.nom} {s.prenom}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <FaEnvelope className="text-gray-300 w-3" /> {s.email}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <FaPhone className="text-gray-300 w-3" /> {formatTelephone(s.telephone)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-mono">
                          @{s.login}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/utilisateurs/modifier/${s.id_utilisateur}`}
                            className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                          >
                            <FaEdit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(s.id_utilisateur)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      <FaUsers className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Aucune secrétaire trouvée</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeSecretaires;