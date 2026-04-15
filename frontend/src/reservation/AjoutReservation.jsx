import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaEnvelope, FaPhone, FaBus, FaCalendarCheck, 
  FaArrowRight, FaArrowLeft, FaCheckCircle, FaSave, FaIdBadge, FaUsers, FaCreditCard 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { normalizePhone, isValidPhone } from '../utils/errorHandler';

// --- AJOUT STRIPE ---
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Remplace par ta clé publique récupérée sur ton tableau de bord Stripe
const stripePromise = loadStripe('pk_test_51SjEyuD3fy62gm9Y7RI73UhGz4KV6Fd0ALLUedpIz0fKcR6KqIlIpOpkp53KmHJLpT9ZW1XWNLATtWcZ3qt2DWeM00tzLWsY1x');

const AjoutReservationContent = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState(1); 
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    date_reservation: new Date().toISOString().split('T')[0],
    statut: 'Confirmée',
    nombres_places: 1,
    id_voyage: ''
  });

  const [voyages, setVoyages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/voyages')
      .then(res => setVoyages(res.data))
      .catch(err => console.error("Erreur chargement voyages", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const castValue = (name === 'nombres_places' || name === 'id_voyage') ? (value === '' ? '' : Number(value)) : value;
    setFormData({ ...formData, [name]: castValue });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.nom.trim()) {
        newErrors.nom = 'Le nom est requis';
      } else if (formData.nom.trim().length < 2 || formData.nom.trim().length > 50) {
        newErrors.nom = 'Le nom doit contenir entre 2 et 50 caractères';
      } else if (!/^[a-zA-ZÀ-ÿ\s'-]{2,50}$/.test(formData.nom)) {
        newErrors.nom = 'Le nom contient des caractères invalides';
      }

      if (!formData.prenom.trim()) {
        newErrors.prenom = 'Le prénom est requis';
      } else if (formData.prenom.trim().length < 2 || formData.prenom.trim().length > 50) {
        newErrors.prenom = 'Le prénom doit contenir entre 2 et 50 caractères';
      } else if (!/^[a-zA-ZÀ-ÿ\s'-]{2,50}$/.test(formData.prenom)) {
        newErrors.prenom = 'Le prénom contient des caractères invalides';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = "L'email est requis";
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Format d'email invalide";
      } else if (formData.email.length > 100) {
        newErrors.email = "L'email est trop long";
      }

      const cleanedPhone = normalizePhone(formData.telephone);
      if (!cleanedPhone) {
        newErrors.telephone = 'Le téléphone est requis';
      } else if (!isValidPhone(cleanedPhone)) {
        newErrors.telephone = 'Format de téléphone invalide (9 chiffres, commence par 6)';
      }
    } else if (step === 2) {
      if (!formData.id_voyage) {
        newErrors.id_voyage = 'Veuillez choisir un voyage';
      }
    } else if (step === 3) {
      if (!formData.nombres_places || isNaN(formData.nombres_places)) {
        newErrors.nombres_places = 'Nombre de places invalide';
      } else if (parseInt(formData.nombres_places) < 1 || parseInt(formData.nombres_places) > 10) {
        newErrors.nombres_places = 'Veuillez réserver entre 1 et 10 places';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (e) => {
    if (e) e.preventDefault(); 
    if (validateStep()) {
      setStep((prev) => prev + 1);
      setErrors({});
    }
  };

  const prevStep = (e) => {
    if (e) e.preventDefault();
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (step < 3) return;
    if (!validateStep()) return;
    if (!stripe || !elements) return; // Stripe doit être chargé

    setIsSubmitting(true);

    try {
      // 1. Calculer le montant total (prix * places)
      const selectedVoyage = voyages.find(v => Number(v.id_voyage) === Number(formData.id_voyage));
      const totalAmount = (selectedVoyage?.prix || 0) * formData.nombres_places;

      // 2. Créer l'intention de paiement sur ton serveur
      // Si cette ligne cause une 404, c'est que la route n'existe pas sur ton serveur Node
      const { data } = await axios.post('http://localhost:3000/create-payment-intent', {
        amount: totalAmount * 100, // Stripe veut des centimes
      });

      // 3. Confirmer le paiement avec la carte saisie
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.nom} ${formData.prenom}`,
            email: formData.email,
          },
        },
      });

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
      }

      // 4. Si paiement réussi, enregistrer la réservation
      if (paymentResult.paymentIntent.status === 'succeeded') {
        const payload = {
          ...formData,
          telephone: normalizePhone(formData.telephone),
          id_voyage: Number(formData.id_voyage),
          nombres_places: Number(formData.nombres_places)
        };
        
        await axios.post('http://localhost:3000/reservations', payload);

        Swal.fire({
          icon: 'success',
          title: 'Paiement réussi !',
          text: `Ticket pour ${formData.prenom} enregistré avec succès.`,
          showConfirmButton: true
        }).then(() => navigate('/reservations/ListeReservations'));
      }
      
    } catch (err) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Échec', 
        text: err.response?.data?.error || err.message || 'Erreur lors du traitement' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ProgressBar = () => (
    <div className="flex items-center justify-between mb-8 px-4">
      {[1, 2, 3].map((num) => (
        <div key={num} className="flex items-center relative">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            step >= num ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
          }`}>
            {step > num ? <FaCheckCircle /> : num}
          </div>
          {num < 3 && (
            <div className={`w-12 md:w-24 h-1 mx-2 ${step > num ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          <div className="bg-indigo-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Nouvelle Réservation</h1>
            <p className="opacity-80">Suivez les étapes pour réserver une place</p>
          </div>

          <div className="p-8">
            <ProgressBar />

            <form onSubmit={handleSubmit}>
              
              {/* ÉTAPE 1 */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-700">
                    <FaIdBadge className="text-indigo-600" /> Informations du passager
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nom</label>
                      <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Dupont" />
                      {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Prénom</label>
                      <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Jean" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="jean@email.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Téléphone</label>
                    <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="+237 6xx xxx xxx" />
                    {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 */}
              {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right duration-500">
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-700">
                    <FaBus className="text-indigo-600" /> Sélection du voyage
                  </h2>
                  <div className="space-y-3">
                    {voyages.map((v) => (
                      <label key={v.id_voyage} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        Number(formData.id_voyage) === Number(v.id_voyage) ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'
                      }`}>
                        <div className="flex items-center gap-4">
                          <input 
                            type="radio" name="id_voyage" value={Number(v.id_voyage)} 
                            checked={Number(formData.id_voyage) === Number(v.id_voyage)}
                            onChange={handleChange}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <div>
                            <p className="font-bold text-gray-800">{v.lieu_depart} → {v.lieu_arrive}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-2">
                              <FaClock /> {v.heure_depart} | <FaUsers className="inline" /> {v.type}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-indigo-600 font-bold">{v.prix} FCFA</p>
                        </div>
                      </label>
                    ))}
                    {errors.id_voyage && <p className="text-red-500 text-xs text-center">{errors.id_voyage}</p>}
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 */}
              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-700">
                    <FaCalendarCheck className="text-indigo-600" /> Finaliser la réservation
                  </h2>
                  
                  <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Voyageur :</span>
                      <span className="font-bold">{formData.nom} {formData.prenom}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date :</span>
                      <span className="font-bold">{formData.date_reservation}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Nombre de places</label>
                    <div className="flex items-center gap-4">
                      <button 
                        type="button" onClick={() => setFormData({...formData, nombres_places: Math.max(1, formData.nombres_places - 1)})}
                        className="w-10 h-10 bg-gray-200 rounded-lg font-bold text-xl"
                      >-</button>
                      <span className="text-2xl font-bold w-12 text-center">{formData.nombres_places}</span>
                      <button 
                        type="button" onClick={() => setFormData({...formData, nombres_places: formData.nombres_places + 1})}
                        className="w-10 h-10 bg-gray-200 rounded-lg font-bold text-xl"
                      >+</button>
                    </div>
                  </div>

                  {/* AJOUT DU CHAMP CARTE STRIPE */}
                  <div className="mt-6 p-4 border-2 border-indigo-100 rounded-xl bg-indigo-50/30">
                    <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
                      <FaCreditCard className="text-indigo-600" /> Informations de paiement
                    </h3>
                    <div className="bg-white p-3 rounded-lg border focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                      <CardElement options={{
                        style: { base: { fontSize: '16px', color: '#374151', '::placeholder': { color: '#9ca3af' } } }
                      }} />
                    </div>
                  </div>

                  <div className="p-4 border-t border-dashed">
                    <div className="flex justify-between items-center text-xl font-bold text-indigo-600">
                      <span>Total à payer</span>
                      <span>{(voyages.find(v => Number(v.id_voyage) === Number(formData.id_voyage))?.prix * formData.nombres_places || 0).toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
              )}

              {/* BOUTONS NAVIGATION */}
              <div className="flex justify-between mt-10">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold transition-all">
                    <FaArrowLeft /> Précédent
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 3 ? (
                  <button 
                    type="button" 
                    onClick={nextStep} 
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg active:scale-95 transition-all"
                  >
                    Suivant <FaArrowRight />
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !stripe} 
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 shadow-lg active:scale-95 transition-all disabled:opacity-50"
                  >
                    <FaSave /> {isSubmitting ? 'Paiement...' : 'Payer & Réserver'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- WRAPPER OBLIGATOIRE POUR UTILISER STRIPE ---
const AjoutReservation = () => (
  <Elements stripe={stripePromise}>
    <AjoutReservationContent />
  </Elements>
);

const FaClock = () => <FaUsers className="inline opacity-50" />;

export default AjoutReservation;