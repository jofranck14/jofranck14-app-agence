import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBus, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaArrowRight, 
  FaCheckCircle, FaStar, FaClock, FaSearch, FaShieldAlt, FaTicketAlt,
  FaUserCircle, FaUserPlus, FaChevronRight, FaCouch, FaHeadset,
  FaAward, FaRoute, FaUsers
} from 'react-icons/fa';

const Acceuil = () => {
  const voyages = [
    { id: 1, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', depart: 'Bafoussam', arrivee: 'Yaoundé', prix: '5 000', agence: 'Bafoussam Premium', horaires: ['08:00','14:00','22:00'], duree: '3h' },
    { id: 2, image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80', depart: 'Yaoundé', arrivee: 'Douala', prix: '5 000', agence: 'Yaoundé Express', horaires: ['07:30','13:00','21:00'], duree: '2h30' },
    { id: 3, image: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=800&q=80', depart: 'Douala', arrivee: 'Bafoussam', prix: '5 000', agence: 'Douala Center', horaires: ['06:00','12:00','19:00'], duree: '3h15' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
      
      {/* NAVBAR STICKY - Version améliorée */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo - Design raffiné */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-100 group-hover:shadow-blue-200 transition-all duration-300">
              <FaBus className="text-white text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900">
                GENERAL<span className="text-blue-600">VOYAGE</span>
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-widest">TRANSPORT PRÉMIUM</span>
            </div>
          </Link>

          {/* Navigation Links & Auth Buttons - Amélioré */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-8">
              <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300 relative group">
                Destinations
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300 relative group">
                Agences
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300 relative group">
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>

            <div className="flex items-center gap-3">
              {/* Bouton Se Connecter - Amélioré */}
              <Link 
                to="/login" 
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 border border-gray-200 hover:border-gray-300"
              >
                <FaUserCircle className="text-gray-400" />
                Connexion
              </Link>

              {/* Bouton S'inscrire - Amélioré */}
              <Link 
                to="/inscription" 
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-100 hover:shadow-blue-200 text-sm font-semibold group"
              >
                <FaUserPlus className="group-hover:scale-110 transition-transform" />
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Amélioré avec gradient */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 h-[600px] flex items-center overflow-hidden">
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Image de fond */}
        <img 
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1920&q=80" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Bus de luxe"
        />
        
        {/* Contenu Hero */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full text-white">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte Hero */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                <FaAward className="text-yellow-300" />
                <span className="text-sm font-semibold">Leader du transport au Cameroun</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                Voyagez avec{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Excellence
                </span>
              </h1>
              
              <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Découvrez le confort premium, la sécurité absolue et la ponctualité garantie 
                pour tous vos déplacements entre les principales villes du Cameroun.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link 
                  to="/inscription" 
                  className="group bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
                >
                  <span>Réserver maintenant</span>
                  <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <a 
                  href="#destinations" 
                  className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
                >
                  <span>Voir les trajets</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* BARRE DE RECHERCHE - Redesign complet */}
            {/* <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Trouvez votre trajet</h2>
              <p className="text-gray-600 mb-6">Réservez en moins de 2 minutes</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Départ</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
                    <input 
                      type="text" 
                      placeholder="Ex: Bafoussam" 
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all "
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Arrivée</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500" />
                    <input 
                      type="text" 
                      placeholder="Ex: Douala" 
                      className="w-full pl-12 pr-4 py-3 text-black bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Date de voyage</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500" />
                    <input 
                      type="date" 
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
                
                <button className="  w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-100 flex items-center justify-center gap-3 group mt-2">
                  <FaSearch />
                  Rechercher un trajet
                  <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* STATISTIQUES - Redesign */}
      <section className="py-12 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Villes desservies', val: '15+', icon: <FaMapMarkerAlt />, color: 'from-blue-500 to-cyan-500' },
              { label: 'Agences partenaires', val: '06', icon: <FaBus />, color: 'from-green-500 to-emerald-500' },
              { label: 'Clients satisfaits', val: '500+', icon: <FaUsers />, color: 'from-purple-500 to-violet-500' },
              { label: 'Sécurité garantie', val: '100%', icon: <FaShieldAlt />, color: 'from-red-500 to-pink-500' },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                  {React.cloneElement(stat.icon, { className: 'text-white text-lg' })}
                </div>
                <div className="text-2xl font-black text-gray-900">{stat.val}</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS POPULAIRES - Section améliorée */}
      <section id="destinations" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* En-tête de section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Nos <span className="text-blue-600">Destinations</span> Populaires
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez nos trajets les plus demandés avec des départs réguliers toute la journée
            </p>
          </div>

          {/* Grille des voyages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {voyages.map((voyage) => (
              <div 
                key={voyage.id} 
                className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image du voyage */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={voyage.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={`Trajet ${voyage.depart} - ${voyage.arrivee}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Badge agence */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-800">
                      {voyage.agence}
                    </span>
                  </div>
                  
                  {/* Prix */}
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                      {voyage.prix} FCFA
                    </span>
                  </div>
                </div>

                {/* Détails du voyage */}
                <div className="p-6">
                  {/* Ligne de départ/arrivée */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1">Départ</div>
                      <div className="text-xl font-bold text-gray-900">{voyage.depart}</div>
                    </div>
                    
                    <div className="relative flex-1 px-4">
                      <div className="h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2">
                        <FaArrowRight className="text-blue-500" />
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1">Arrivée</div>
                      <div className="text-xl font-bold text-gray-900">{voyage.arrivee}</div>
                    </div>
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-blue-500" />
                      <span className="text-sm text-gray-600">
                        Durée: <span className="font-bold">{voyage.duree}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaRoute className="text-green-500" />
                      <span className="text-sm text-gray-600">
                        Trajet direct
                      </span>
                    </div>
                  </div>

                  {/* Horaires */}
                  <div className="space-y-3 mb-6">
                    <div className="text-sm font-semibold text-gray-700">Départs disponibles :</div>
                    <div className="flex flex-wrap gap-2">
                      {voyage.horaires.map((horaire, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold"
                        >
                          {horaire}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bouton réserver */}
                  <Link 
                    to="/inscription" 
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <FaTicketAlt />
                    Réserver maintenant
                    <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Lien voir tout */}
          <div className="text-center mt-12">
            <Link 
              to="/trajets" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg group"
            >
              Voir toutes nos destinations
              <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION AVANTAGES - Redesign */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Pourquoi choisir <span className="text-cyan-300">General Voyage</span> ?
            </h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Nous nous engageons à rendre chaque voyage exceptionnel
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaShieldAlt />,
                title: 'Sécurité Maximale',
                description: 'Bus équipés des dernières technologies de sécurité, chauffeurs certifiés et contrôles réguliers.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: <FaCouch />,
                title: 'Confort Premium',
                description: 'Sièges ergonomiques, climatisation individuelle et espace bagages généreux pour votre confort.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: <FaHeadset />,
                title: 'Support 24h/24',
                description: 'Notre équipe d\'assistance est disponible à tout moment pour répondre à vos besoins.',
                color: 'from-green-500 to-emerald-500'
              }
            ].map((avantage, index) => (
              <div 
                key={index}
                className="group bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-[1.02]"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${avantage.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {React.cloneElement(avantage.icon, { className: 'text-white text-2xl' })}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{avantage.title}</h3>
                <p className="text-blue-200 leading-relaxed">{avantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER - Version améliorée */}
      <footer className="bg-gray-900 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Logo et description */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg">
                  <FaBus className="text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">GENERALVOYAGE</div>
                  <div className="text-xs text-gray-400 font-medium">TRANSPORT PRÉMIUM</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Leader du transport interurbain au Cameroun, nous connectons les villes avec excellence, sécurité et confort.
              </p>
            </div>

            {/* Liens rapides */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Liens rapides</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/trajets" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Tous les trajets
                  </Link>
                </li>
                <li>
                  <Link to="/agences" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Nos agences
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Nos services
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Nous contacter
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Services</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Mon compte
                  </Link>
                </li>
                <li>
                  <Link to="/inscription" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Réservation en ligne
                  </Link>
                </li>
                <li>
                  <Link to="/suivi" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Suivi des bus
                  </Link>
                </li>
                <li>
                  <Link to="/assistance" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Assistance
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <FaPhone className="text-blue-400" />
                  <span>+237 657 457 344</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <FaPhone className="text-blue-400" />
                  <span>+237 233 445 566</span>
                </li>
                <li className="text-gray-400">
                  <div className="font-medium mb-1">Horaires :</div>
                  <div className="text-sm">Lun-Dim: 5h-22h</div>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800">
            <div className="text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} General Voyage S.A. Tous droits réservés.
              <div className="mt-2 text-xs">
                <a href="#" className="hover:text-white transition-colors mx-3">Mentions légales</a>
                <a href="#" className="hover:text-white transition-colors mx-3">Confidentialité</a>
                <a href="#" className="hover:text-white transition-colors mx-3">CGV</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Acceuil;