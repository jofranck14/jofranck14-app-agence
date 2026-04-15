import React, { useState, useEffect } from 'react';
import { FaUsers, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaEnvelope, FaPhone, FaUserTag } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { formatPhone } from '../utils/errorHandler';

const ListeClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Charger les utilisateurs et filtrer uniquement les CLIENTS
  const fetchClients = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:3000/utilisateurs');
      // On ne garde que les utilisateurs avec le rôle 'Client'
      const uniquementClients = (res.data || []).filter(u => u.role === 'Client');
      setClients(uniquementClients);
    } catch (err) {
      console.error('Erreur chargement clients:', err);
      setError('Impossible de charger les clients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Notification après ajout/modification
  useEffect(() => {
    if (location.state?.toast) {
      Swal.fire({ icon: 'success', title: 'Succès', text: location.state.toast, timer: 1500, showConfirmButton: false });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // 2. Filtrage intelligent (Nom, Prénom, Email, Login)
  const filteredClients = clients.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      c.nom?.toLowerCase().includes(term) ||
      c.prenom?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.login?.toLowerCase().includes(term)
    );
  });

  // 3. Supprimer un client
  const handleDelete = async (id_utilisateur) => {
    const result = await Swal.fire({
      title: 'Confirmation',
      text: 'Supprimer définitivement ce compte client ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/utilisateurs/${id_utilisateur}`);
      setClients(prev => prev.filter(c => c.id_utilisateur !== id_utilisateur));
      Swal.fire({ icon: 'success', title: 'Supprimé', text: 'Client retiré avec succès', timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Action impossible sur ce client' });
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Clients</h1>
            <p className="text-gray-600">Liste des clients enregistrés dans le système</p>
          </div>
          <Link
            to="/utilisateurs/AjoutUtilisateur"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-all shadow-md"
          >
            <FaPlus className="w-4 h-4" />
            <span className="font-medium">Nouveau Client</span>
          </Link>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <FaUsers className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Clients</p>
              <p className="text-2xl font-bold text-gray-800">{clients.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <FaUserTag className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Actifs</p>
              <p className="text-2xl font-bold text-gray-800">{filteredClients.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou identifiant..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau des clients */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-10 text-center text-gray-400">Chargement des clients...</div>
        ) : error ? (
           <div className="p-10 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Login</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.length > 0 ? (
                  filteredClients.map((c) => (
                    <tr key={c.id_utilisateur} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-400">#{c.id_utilisateur}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                            {c.nom.charAt(0)}{c.prenom.charAt(0)}
                          </div>
                          <div className="font-semibold text-gray-900">{c.nom} {c.prenom}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <FaEnvelope className="text-gray-300 w-3" /> {c.email}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <FaPhone className="text-gray-300 w-3" /> {formatTelephone(c.telephone)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-mono font-bold">
                          @{c.login}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/utilisateurs/modifier/${c.id_utilisateur}`}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <FaEdit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(c.id_utilisateur)}
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
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      <FaUsers className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Aucun client trouvé</p>
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

export default ListeClients;