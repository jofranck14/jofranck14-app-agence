import React, { useContext } from 'react'; // Ajout de useContext
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Importation du contexte
import {
  FaBus,
  FaBuilding,
  FaUserTie,
  FaUsers,
  FaRoute,
  FaPlaneDeparture,
  FaTicketAlt,
  FaUserSecret,
  FaHome
} from 'react-icons/fa';

const Menu = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext); // Récupération de l'utilisateur et son rôle
  
  const menuItems = [
    { 
      name: 'Tableau de Bord', 
      path: '/dashboard', 
      icon: <FaHome className="w-5 h-5" />,
      roles: ['Administrateur', 'Secretaire']
    },
    { 
      name: 'Gestion Bus', 
      path: '/bus/ListeBus', 
      icon: <FaBus className="w-5 h-5" />,
      roles: ['Administrateur', 'Secretaire']
    },
    { 
      name: 'historique', 
      path: '/reservations/Historique', 
      icon: <FaBuilding className="w-5 h-5" />,
      roles: ['Administrateur', 'Secretaire', 'Client']
    },
    { 
      name: 'Chauffeurs', 
      path: '/chauffeurs/ListeChauffeurs', 
      icon: <FaUserTie className="w-5 h-5" />,
      roles: ['Administrateur', 'Secretaire']
    },
    { 
      name: 'Clients', 
      path: '/clients/ListeClients', 
      icon: <FaUsers className="w-5 h-5" />,
      roles: ['Administrateur', 'Secretaire']
    },
    { 
      name: 'Trajets', 
      path: '/trajets/ListeTrajets', 
      icon: <FaRoute className="w-5 h-5" />,
      roles: ['Administrateur', 'Secretaire']
    },
    { 
      name: 'Voyages', 
      path: '/voyages/ListeVoyages', 
      icon: <FaPlaneDeparture className="w-5 h-5" />,
      roles: ['Administrateur', 'Secretaire']
    },
    { 
      name: 'Réservations', 
      path: '/reservations/ListeReservations', 
      icon: <FaTicketAlt className="w-5 h-5" />,
      roles: ['Administrateur', 'Secretaire']
    },
        { 
      name: 'Réservations', 
      path: '/reservations/AjoutReservation', 
      icon: <FaTicketAlt className="w-5 h-5" />,
      roles: ['Client']
    },
    { 
      name: 'Secrétaires', 
      path: '/secretaires/ListeSecretaires', 
      icon: <FaUserSecret className="w-5 h-5" />,
      roles: ['Administrateur'] // Admin seulement
    },
    { 
      name: 'Utilisateurs', 
      path: '/utilisateurs/ListeUtilisateurs', 
      icon: <FaUserSecret className="w-5 h-5" />,
      roles: ['Administrateur'] // Admin seulement
    },
  ];

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="hidden md:block fixed left-0 top-0 h-screen w-[250px] bg-gradient-to-b from-blue-800 to-blue-900 shadow-2xl z-50">
      {/* Logo/En-tête */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <FaBus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">General Voyage</h1>
          </div>
        </div>
      </div>
      
      {/* Menu items filtrés par rôle */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems
            .filter(item => item.roles.includes(user?.role)) // FILTRE ICI : On ne garde que ce qui est autorisé
            .map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${isActive(item.path) 
                      ? 'bg-blue-700 text-white shadow-md border-l-4 border-blue-300' 
                      : 'text-blue-100 hover:bg-blue-750 hover:text-white hover:pl-5'
                    }
                  `}
                >
                  <span className={`${isActive(item.path) ? 'text-white' : 'text-blue-300'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                  )}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
};

export default Menu;