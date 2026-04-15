import React, { useState, useContext } from 'react'; // Ajout de useContext
import { Link, useNavigate } from 'react-router-dom'; // Ajout de useNavigate
import { AuthContext } from '../context/AuthContext'; // Importation du contexte
import { FaBars, FaTimes, FaHome, FaBus, FaUserTie, FaUsers } from 'react-icons/fa';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // --- LOGIQUE D'AUTHENTIFICATION ---
  const { user, logout } = useContext(AuthContext); // Récupère l'utilisateur et la fonction logout
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Recherche:', searchQuery);
  };

  const handleLogout = () => {
    logout(); // Appelle la fonction de déconnexion du contexte
    navigate('/login'); // Redirige vers la page de connexion
  };
  // ----------------------------------

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[250px] h-16 bg-white shadow-sm z-40 border-b border-gray-200">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        
        {/* Mobile menu button */}
        <div className="md:hidden mr-2">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
            <FaBars className="w-5 h-5" />
          </button>
        </div>
        
        {/* Barre de recherche */}
        <div className="flex-1 max-w-xl">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Bouton profil / déconnexion */}
        <div className="relative">
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {/* Avatar avec l'initiale dynamique */}
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {user?.nom ? user.nom.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            
            {/* Nom et Rôle dynamiques */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-700 capitalize">
                {user?.nom} {user?.prenom}
              </p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </button>

          {showLogout && (
            <>
              {/* Overlay pour fermer en cliquant ailleurs */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowLogout(false)}
              />
              
              {/* Menu déconnexion */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm font-medium text-gray-800">{user?.nom} {user?.prenom}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || user?.role}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm font-bold">Se déconnecter</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile navigation overlay (Filtré par rôles comme le Menu) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-lg p-4 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                    <FaBus />
                </div>
                <h3 className="text-lg font-bold">General Voyage</h3>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                <FaTimes />
              </button>
            </div>
            
            <nav className="flex flex-col gap-1">
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-3 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"><FaHome/> Tableau de bord</Link>
              
              {/* Liens protégés en mode Mobile aussi */}
              {['Administrateur', 'Secretaire'].includes(user?.role) && (
                <>
                  <Link to="/bus/ListeBus" onClick={() => setMobileOpen(false)} className="px-3 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"><FaBus/> Bus</Link>
                  <Link to="/chauffeurs/ListeChauffeurs" onClick={() => setMobileOpen(false)} className="px-3 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"><FaUserTie/> Chauffeurs</Link>
                  <Link to="/clients/ListeClients" onClick={() => setMobileOpen(false)} className="px-3 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"><FaUsers/> Clients</Link>
                </>
              )}

              {user?.role === 'Administrateur' && (
                <Link to="/utilisateurs/ListeUtilisateurs" onClick={() => setMobileOpen(false)} className="px-3 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors border-t border-gray-100 mt-2"><FaUsers/> Utilisateurs</Link>
              )}
            </nav>
          </div>
          <div className="w-full h-full" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;