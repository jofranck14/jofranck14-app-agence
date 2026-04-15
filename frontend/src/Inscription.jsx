import React, { useState, useContext } from 'react';
import { FaUserPlus, FaSave, FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaLock, FaIdBadge } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from './context/AuthContext';
import { normalizePhone, isValidPhone } from './utils/errorHandler';

const Inscription = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  // État initial : le rôle est fixé à 'Client' par défaut
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    login: '',
    mot_de_passe: '',
    role: 'Client' 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    const cleanedPhone = normalizePhone(formData.telephone);
    if (!cleanedPhone) newErrors.telephone = 'Le téléphone est requis';
    else if (!isValidPhone(cleanedPhone)) newErrors.telephone = 'Format de téléphone invalide (9 chiffres, commence par 6)';
    
    if (!formData.login.trim()) newErrors.login = 'Le login est requis';
    
    if (!formData.mot_de_passe) {
      newErrors.mot_de_passe = 'Le mot de passe est requis';
    } else if (formData.mot_de_passe.length < 6) {
      newErrors.mot_de_passe = 'Le mot de passe doit faire au moins 6 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    const payload = { ...formData, telephone: normalizePhone(formData.telephone) };

    axios.post('http://localhost:3000/utilisateurs', payload)
      .then((res) => {
        // Récupérer les données de l'utilisateur créé
        const newUser = res.data.user || { 
          nom: formData.nom, 
          prenom: formData.prenom, 
          email: formData.email,
          role: formData.role 
        };
        
        // Générer un token pour la nouvelle session
        // Note: Vous devriez retourner un token du backend lors de la création
        // Pour l'instant, on fait une connexion automatique
        axios.post('http://localhost:3000/auth/login', {
          login: formData.login,
          mot_de_passe: formData.mot_de_passe
        })
          .then((loginRes) => {
            // Auto-login avec les données retournées
            login(loginRes.data.user, loginRes.data.token);
            
            Swal.fire({
              icon: 'success',
              title: 'Bienvenue !',
              text: 'Votre compte a été créé et vous êtes maintenant connecté.',
              timer: 2000,
              showConfirmButton: false
            });
            
            // Redirection vers le dashboard
            navigate('/dashboard');
          })
          .catch((loginErr) => {
            // Si la connexion automatique échoue, rediriger vers la page de connexion
            console.error('Erreur de connexion automatique:', loginErr);
            Swal.fire({
              icon: 'success',
              title: 'Inscription réussie',
              text: 'Veuillez vous connecter avec vos identifiants.',
              timer: 2000,
              showConfirmButton: false
            });
            navigate('/login');
          });
      })
      .catch((err) => {
        const msg = err.response?.data?.error || 'Erreur lors de l\'inscription';
        setSubmitError(msg);
        Swal.fire({ icon: 'error', title: 'Erreur', text: msg });
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
          
          {/* Lien Retour */}
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors">
            <FaArrowLeft className="text-sm" />
            <span>Retour à l'accueil</span>
          </Link>

          {/* En-tête */}
          <div className="mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaUserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Créer un compte</h1>
                <p className="text-sm text-gray-500">Rejoignez-nous en remplissant les informations ci-dessous</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {submitError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">{submitError}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nom */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  <FaIdBadge className="text-blue-500" /> Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.nom ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all`}
                />
                {errors.nom && <p className="mt-1 text-xs text-red-600 font-medium">{errors.nom}</p>}
              </div>

              {/* Prénom */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  <FaUser className="text-blue-500" /> Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.prenom ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all`}
                />
                {errors.prenom && <p className="mt-1 text-xs text-red-600 font-medium">{errors.prenom}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  <FaEnvelope className="text-blue-500" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemple@mail.com"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.email ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>}
              </div>

              {/* Téléphone */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  <FaPhone className="text-blue-500" /> Téléphone
                </label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+237 6..."
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.telephone ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all`}
                />
                {errors.telephone && <p className="mt-1 text-xs text-red-600 font-medium">{errors.telephone}</p>}
              </div>

              {/* Login */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  <FaUser className="text-indigo-500" /> Identifiant de connexion
                </label>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Nom d'utilisateur"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.login ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all`}
                />
                {errors.login && <p className="mt-1 text-xs text-red-600 font-medium">{errors.login}</p>}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  <FaLock className="text-indigo-500" /> Mot de passe
                </label>
                <input
                  type="password"
                  name="mot_de_passe"
                  value={formData.mot_de_passe}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.mot_de_passe ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all`}
                />
                {errors.mot_de_passe && <p className="mt-1 text-xs text-red-600 font-medium">{errors.mot_de_passe}</p>}
              </div>

            </div>

            {/* Note sur le rôle (Optionnel - Informative) */}
            <p className="text-[10px] text-gray-400 italic">
              * En vous inscrivant, vous créez un compte avec un profil Client.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
              <Link
                to="/login"
                className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                <FaArrowLeft className="w-3 h-3" />
                <span>Déjà un compte ? Se connecter</span>
              </Link>
              
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-sm font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Inscription...
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>S'inscrire</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inscription;