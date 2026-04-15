import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-blue-400">VoyageBus Express</h3>
            <p className="text-gray-400 mt-2">
              Votre solution de voyage en autocar de confiance
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400">
              &copy; {currentYear} VoyageBus Express. Tous droits réservés.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Réservation en ligne de billets d'autocar
            </p>
            <div className="flex justify-center md:justify-end space-x-4 mt-3">
              <a href="/conditions" className="text-gray-300 hover:text-white text-sm">
                Conditions d'utilisation
              </a>
              <a href="/confidentialite" className="text-gray-300 hover:text-white text-sm">
                Confidentialité
              </a>
              <a href="/contact" className="text-gray-300 hover:text-white text-sm">
                Contact
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            Système de gestion de réservation de billets d'autocar • Version 1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;