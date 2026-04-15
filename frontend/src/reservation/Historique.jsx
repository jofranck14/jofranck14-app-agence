import React, { useState } from 'react';
import axios from 'axios';
import { 
  FaSearch, FaTicketAlt, FaBus, FaCalendarAlt, 
  FaUser, FaClock, FaArrowLeft, FaExclamationCircle 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Historique = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setSearched(false);
    try {
      // AJUSTEMENT DE L'URL : On utilise bien /reservations/utilisateur/
      // Assure-toi que ton serveur tourne sur le port 3000
      const res = await axios.get(`http://localhost:3000/reservations/utilisateur/${email}`);
      
      setReservations(res.data);
      setSearched(true);
    } catch (err) {
      console.error("Erreur lors de la recherche", err);
      setReservations([]);
      setSearched(true);
      // Si l'erreur 404 persiste, c'est que le fichier routes/reservation.js 
      // ne contient pas la route router.get('/utilisateur/:email', ...)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        
        {/* En-tête avec bouton retour */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-bold transition-all"
          >
            <FaArrowLeft /> Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FaTicketAlt className="text-indigo-600" /> Mon Historique
          </h1>
        </div>

        {/* Formulaire de recherche */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
          <p className="text-gray-500 mb-4 text-sm">Entrez l'adresse email de l'utilisateur pour retrouver ses tickets.</p>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                placeholder="recherche-utilisateur@exemple.com" 
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-indigo-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Recherche...' : 'Rechercher'}
            </button>
          </form>
        </div>

        {/* Résultats de la recherche */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservations.length > 0 ? (
            reservations.map((res) => (
              <div 
                key={res.id_reservation} 
                className="bg-white rounded-2xl shadow-md overflow-hidden border-l-8 border-indigo-600 hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-1 rounded-md uppercase">
                      Ticket: #{res.id_reservation}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <FaCalendarAlt /> {new Date(res.date_reservation).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase">Trajet réservé</p>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      {res.lieu_depart} <FaArrowRight className="text-gray-300 text-xs" /> {res.lieu_arrive}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Utilisateur</p>
                      <p className="font-semibold flex items-center gap-1 italic"><FaUser className="text-[10px]"/> {res.nom} {res.prenom}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Heure Départ</p>
                      <p className="font-semibold flex items-center gap-1"><FaClock className="text-[10px]"/> {res.heure_depart}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-dashed flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Nombre de places</p>
                      <p className="font-bold text-gray-800">{res.nombres_places} Place(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Total payé</p>
                      <p className="text-indigo-600 font-black text-xl">{(res.prix * res.nombres_places).toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : searched && !loading ? (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl shadow-inner border-2 border-dashed border-gray-200">
              <FaExclamationCircle className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Aucune réservation pour cet utilisateur.</p>
              <p className="text-gray-400 text-sm">Vérifiez l'email saisi ou l'historique de l'utilisateur.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const FaArrowRight = ({className}) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
);

export default Historique;