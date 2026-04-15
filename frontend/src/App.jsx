import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import Login from './utilisateurs/Login';
import Inscription from './Inscription';
import PrivateRoutes from './PrivateRoutes';
import RoleProtectedRoute from './RoleProtectedRoute'; // Assure-toi que ce fichier existe

import Menu from './components/Menu';
import Header from './components/Header';
import Dashboard from './Dashboard';
import Acceuil from './Acceuil';
import ListeBus from './bus/ListeBus';
import AjoutBus from './bus/AjoutBus';
import ModifierBus from './bus/ModifierBus';
import ListeClients from './clients/ListeClients';
import AjoutChauffeur from './chauffeurs/AjoutChauffeur';
import ListeChauffeurs from './chauffeurs/ListeChauffeurs';
import ModifierChauffeur from './chauffeurs/ModifierChauffeur';
import AjoutVoyage from './voyages/AjoutVoyage';
import ListeVoyages from './voyages/ListeVoyages';
import ModifierVoyage from './voyages/ModifierVoyage';
import AjoutSecretaire from './secretaires/AjoutSecretaire';
import ListeSecretaires from './secretaires/ListeSecretaires';
import AjoutTrajet from './trajets/AjoutTrajet';
import ListeTrajets from './trajets/ListeTrajets';
import ModifierTrajet from './trajets/ModifierTrajet';
import AjoutUtilisateur from './utilisateurs/AjoutUtilisateur';
import ListeUtilisateurs from './utilisateurs/ListeUtilisateurs';
import ModifierUtilisateur from './utilisateurs/ModifierUtilisateur';
import AjoutReservation from './reservation/AjoutReservation';
import ListeReservations from './reservation/ListeReservations';
import ModifierReservation from './reservation/ModifierReservation';
import Historique from './reservation/Historique';
// import Acceuil from './Acceuil';

function AppLayout() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  // Masquer le menu et header sur les pages d'auth et d'accueil
  const isAuthOrHomePages = ['/', '/acceuil', '/login', '/inscription'].includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {token && !isAuthOrHomePages && <Menu />}
      
      <div className={token && !isAuthOrHomePages ? "flex-1 md:ml-[250px]" : "flex-1"}>
        {token && !isAuthOrHomePages && <Header />}
        
        <main className={token && !isAuthOrHomePages ? "mt-[60px] p-6" : ""}>
          <div className="max-w-7xl mx-auto">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Acceuil />} />
              <Route path="/acceuil" element={<Acceuil />} />
              <Route path="/login" element={<Login />} />
              <Route path="/inscription" element={<Inscription />} />
              
              {/* --- TOUTES LES ROUTES PROTÉGÉES (CONNEXION OBLIGATOIRE) --- */}
              <Route element={<PrivateRoutes />}>
                
               


                {/* --- ZONE 1 : ADMINISTRATEUR UNIQUEMENT --- */}
                <Route element={<RoleProtectedRoute allowedRoles={['Administrateur']} />}>
                  {/* Gestion des utilisateurs */}
                  <Route path="/utilisateurs/ListeUtilisateurs" element={<ListeUtilisateurs />} />
                  <Route path="/utilisateurs/AjoutUtilisateur" element={<AjoutUtilisateur />} />
                  <Route path="/utilisateurs/modifier/:id" element={<ModifierUtilisateur />} />
                  {/* <Route path='/Accueil' element={<Acceuil/>}/> */}

                  {/* Gestion des secrétaires */}
                  <Route path="/secretaires/ListeSecretaires" element={<ListeSecretaires />} />
                  <Route path="/secretaires/AjoutSecretaire" element={<AjoutSecretaire />} />
                  
                  {/* Actions sensibles sur Bus et Chauffeurs */}
                  <Route path="/bus/AjoutBus" element={<AjoutBus />} />
                  <Route path="/bus/modifier/:id" element={<ModifierBus />} />
                  <Route path="/chauffeurs/AjoutChauffeur" element={<AjoutChauffeur />} />
                  <Route path="/chauffeurs/modifier/:id" element={<ModifierChauffeur />} />

                  {/* Trajets */}
                  <Route path="/trajets/AjoutTrajet" element={<AjoutTrajet />} />
                  <Route path="/trajets/modifier/:id" element={<ModifierTrajet />} />

                   {/* Voyages */}
                  <Route path="/voyages/AjoutVoyage" element={<AjoutVoyage />} />
                  <Route path="/voyages/modifier/:id" element={<ModifierVoyage />} />

                </Route>



                {/* --- ZONE 2 : ADMINISTRATEUR & SECRETAIRE --- */}
                <Route element={<RoleProtectedRoute allowedRoles={['Administrateur', 'Secretaire']} />}>
                  <Route path="/bus/ListeBus" element={<ListeBus />} />
                  <Route path="/chauffeurs/ListeChauffeurs" element={<ListeChauffeurs />} />
                  <Route path="/clients/ListeClients" element={<ListeClients />} />
                  
                 {/* Dashboard : Accessible par tout le monde connecté sauf le client */}
                <Route path="/dashboard" element={<Dashboard />} /> 

                  {/* Trajets */}
                  <Route path="/trajets/ListeTrajets" element={<ListeTrajets />} />
                

                  {/* Voyages */}
                  <Route path="/voyages/ListeVoyages" element={<ListeVoyages />} />

                 {/*reservation */}
                  <Route path="/reservations/modifier/:id" element={<ModifierReservation />} />
                  <Route path="/reservations/ListeReservations" element={<ListeReservations />} />
                 
                </Route>

                {/* --- ZONE 3 : TOUS (Administrateur, Secretaire, Client) --- */}
                <Route element={<RoleProtectedRoute allowedRoles={['Administrateur', 'Secretaire', 'Client']} />}>
                  <Route path="/reservations/AjoutReservation" element={<AjoutReservation />} />
                  <Route path="/reservations/Historique" element={<Historique />} />
                  <Route path="/Acceuil" element={<Acceuil />} />

                </Route>

              </Route>

              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;