import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaUserShield, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { formatPhone } from '../utils/errorHandler';

const ListeUtilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Tous');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  // Gestion des notifications (Toast) après création/modification
  useEffect(() => {
    const toast = location?.state?.toast;
    if (toast) {
      Swal.fire({ icon: 'success', title: 'Succès', text: toast, timer: 1400, showConfirmButton: false });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location?.state?.toast, navigate, location.pathname]);

  const fetchUtilisateurs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:3000/utilisateurs');
      console.debug('[DEBUG] GET /utilisateurs response:', res.data);
      setUtilisateurs(res.data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      if (!err.response) setError('Serveur injoignable — démarrez le backend');
      else setError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  // Formater le numéro de téléphone pour l'affichage (supporte + et jusqu'à 15 chiffres)
  const formatTelephone = (tel) => {
    if (!tel) return 'Non renseigné';
    const formatted = formatPhone(tel);
    return formatted || 'Non renseigné';
  };

  // Filtrage intelligent
  const filteredUtilisateurs = utilisateurs.filter(user => {
    const term = (searchTerm || '').toLowerCase();
    const termDigits = term.replace(/\D/g, '');
    const phoneDigits = String(user.telephone || '').replace(/\D/g, '');

    const matchesSearch =
      user.nom?.toLowerCase().includes(term) ||
      user.prenom?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.login?.toLowerCase().includes(term) ||
      (termDigits && phoneDigits.includes(termDigits));

    const matchesRole = filterRole === 'Tous' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const handleDelete = async (id_utilisateur) => {
    const result = await Swal.fire({
      title: 'Confirmation',
      text: 'Supprimer cet utilisateur ? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/utilisateurs/${id_utilisateur}`);
      setUtilisateurs((prev) => prev.filter((u) => u.id_utilisateur !== id_utilisateur));
      Swal.fire({ icon: 'success', title: 'Supprimé', text: 'Utilisateur supprimé !', timer: 1400, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de supprimer cet utilisateur' });
    }
  };

  // Styles des badges de rôles
  const getRoleStyle = (role) => {
    switch (role) {
      case 'Administrateur': return 'bg-purple-600 text-white';
      case 'Secretaire': return 'bg-blue-500 text-white';
      case 'Client': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Statistiques
  const stats = {
    total: utilisateurs.length,
    admins: utilisateurs.filter(u => u.role === 'Administrateur').length,
    secretaires: utilisateurs.filter(u => u.role === 'Secretaire').length,
    clients: utilisateurs.filter(u => u.role === 'Client').length,
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Utilisateurs</h1>
            <p className="text-gray-600">Comptes et accès au système</p>
          </div>
          <Link
            to="/utilisateurs/AjoutUtilisateur"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-all shadow-md w-full md:w-auto justify-center"
          >
            <FaUserPlus className="w-4 h-4" />
            <span className="font-medium">Nouvel Utilisateur</span>
          </Link>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
               <FaUser className="w-5 h-5" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administrateurs</p>
              <p className="text-2xl font-bold text-gray-800">{stats.admins}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
               <FaUserShield className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Secrétaires</p>
              <p className="text-2xl font-bold text-gray-800">{stats.secretaires}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
               <FaUser className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clients</p>
              <p className="text-2xl font-bold text-gray-800">{stats.clients}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
               <FaFilter className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Recherche et Filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, login..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500 w-4 h-4" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="Tous">Tous les rôles</option>
              <option value="Administrateur">Administrateur</option>
              <option value="Secretaire">Secrétaire</option>
              <option value="Client">Client</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Identité</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Login</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Rôle</th>
                <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-10">Chargement...</td></tr>
              ) : filteredUtilisateurs.length > 0 ? (
                filteredUtilisateurs.map((user) => (
                  <tr key={user.id_utilisateur} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900">{user.nom} {user.prenom}</div>
                      <div className="text-xs text-gray-400">ID: #{user.id_utilisateur}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaEnvelope className="w-3 h-3 text-gray-400" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaPhone className="w-3 h-3 text-gray-400" /> {formatTelephone(user.telephone)}
                        </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">@{user.login}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex justify-center items-center px-4 py-1.5 rounded-full text-xs font-bold min-w-[100px] shadow-sm ${getRoleStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/utilisateurs/modifier/${user.id_utilisateur}`}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Modifier"
                        > 
                          <FaEdit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id_utilisateur)}
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
                    <FaUser className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                    <p className="text-lg">Aucun utilisateur trouvé</p>
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

export default ListeUtilisateurs;