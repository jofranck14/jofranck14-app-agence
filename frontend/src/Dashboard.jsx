import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBus, 
  FaUsers, 
  FaTicketAlt, 
  FaRoute, 
  FaBuilding, 
  FaUserTie, 
  FaPlaneDeparture,
  FaUserSecret,
  FaSpinner 
} from 'react-icons/fa';
import api from './api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    bus: 0,
    clients: 0,
    reservations: 0,
    trajets: 0,
    utilisateurs: 0,
    chauffeurs: 0,
    voyages: 0,
    secretaires: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les données réelles de la base de données
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer les utilisateurs pour compter clients et secrétaires par rôle
        const utilisateurRes = await api.get('/utilisateurs');
        const utilisateurs = Array.isArray(utilisateurRes.data) ? utilisateurRes.data : [];
        
        const clients = utilisateurs.filter(u => u.role === 'Client').length;
        const secretaires = utilisateurs.filter(u => u.role === 'Secretaire').length;

        const endpoints = [
          { key: 'bus', url: '/bus' },
          { key: 'reservations', url: '/reservations' },
          { key: 'trajets', url: '/trajets' },
          { key: 'utilisateurs', url: '/utilisateurs' },
          { key: 'chauffeurs', url: '/chauffeur' },
          { key: 'voyages', url: '/voyages' }
        ];

        const promises = endpoints.map(async ({ key, url }) => {
          try {
            const response = await api.get(url);
            const count = Array.isArray(response.data) ? response.data.length : 0;
            return { key, count };
          } catch (err) {
            console.error(`Erreur lors du chargement ${key}:`, err);
            return { key, count: 0 };
          }
        });

        const results = await Promise.all(promises);
        const newStats = { ...stats };
        results.forEach(({ key, count }) => {
          newStats[key] = count;
        });

        // Ajouter les valeurs filtrées par rôle
        newStats.clients = clients;
        newStats.secretaires = secretaires;

        setStats(newStats);
      } catch (err) {
        console.error('Erreur générale lors du chargement des statistiques:', err);
        setError('Impossible de charger les statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Mettre à jour les statistiques toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  const statsCards = [
    { 
      title: 'Bus', 
      value: stats.bus, 
      icon: <FaBus className="w-6 h-6" />,
      borderColor: 'border-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      path: '/bus/ListeBus'
    },
    { 
      title: 'Clients', 
      value: stats.clients, 
      icon: <FaUsers className="w-6 h-6" />,
      borderColor: 'border-emerald-500',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      path: '/clients/ListeClients'
    },
    { 
      title: 'Réservations', 
      value: stats.reservations, 
      icon: <FaTicketAlt className="w-6 h-6" />,
      borderColor: 'border-purple-500',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      path: '/reservations/ListeReservations'
    },
    { 
      title: 'Trajets', 
      value: stats.trajets, 
      icon: <FaRoute className="w-6 h-6" />,
      borderColor: 'border-amber-500',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      path: '/trajets/ListeTrajets'
    },
    { 
      title: 'Utilisateurs', 
      value: stats.utilisateurs, 
      icon: <FaUserSecret className="w-6 h-6" />,
      borderColor: 'border-cyan-500',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      path: '/utilisateurs/ListeUtilisateurs'
    },
    { 
      title: 'Chauffeurs', 
      value: stats.chauffeurs, 
      icon: <FaUserTie className="w-6 h-6" />,
      borderColor: 'border-orange-500',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      path: '/chauffeurs/ListeChauffeurs'
    },
    { 
      title: 'Voyages', 
      value: stats.voyages, 
      icon: <FaPlaneDeparture className="w-6 h-6" />,
      borderColor: 'border-sky-500',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      path: '/voyages/ListeVoyages'
    },
    { 
      title: 'Secrétaires', 
      value: stats.secretaires, 
      icon: <FaUserSecret className="w-6 h-6" />,
      borderColor: 'border-violet-500',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      path: '/secretaires/ListeSecretaires'
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Tableau de Bord</h1>
        <p className="text-gray-600">Vue d'ensemble des statistiques en temps réel</p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* État de chargement */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-96">
          <FaSpinner className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Chargement des statistiques...</p>
        </div>
      )}

      {/* Cartes de statistiques */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <Link 
              key={index}
              to={card.path}
              className={`
                bg-white 
                rounded-xl 
                border-t-4 
                ${card.borderColor}
                shadow-lg 
                shadow-gray-200/50
                hover:shadow-xl 
                hover:shadow-gray-300/50
                transition-all 
                duration-300 
                hover:-translate-y-1
                p-5
                relative
                overflow-hidden
                group
                block
                cursor-pointer
              `}
            >
              {/* Effet de bordure décoratif */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${card.borderColor.replace('border-', 'bg-')}`}></div>
              
              {/* Contenu */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{card.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                </div>
                
                {/* Icône */}
                <div className={`
                  ${card.iconBg} 
                  ${card.iconColor}
                  w-12 h-12 
                  rounded-lg 
                  flex items-center justify-center
                  shadow-sm
                  group-hover:scale-110
                  transition-transform duration-300
                `}>
                  {card.icon}
                </div>
              </div>

              {/* Ligne pleine en bas */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 group-hover:h-1.5 transition-all duration-300">
                <div 
                  className={`h-full ${card.borderColor.replace('border-', 'bg-')} rounded-full transition-all duration-700 group-hover:w-full`}
                style={{ width: '100%' }}
              ></div>
            </div>

            {/* Effet de coin décoratif */}
            <div className={`absolute bottom-0 right-0 w-8 h-8 ${card.borderColor.replace('border-', 'bg-')} opacity-10 rounded-tl-full`}></div>
          </Link>
        ))}
      </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">Cliquez sur une carte</span> pour accéder à la section correspondante
        </p>
      </div>
    </div>
  );
};

export default Dashboard;