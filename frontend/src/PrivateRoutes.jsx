import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoutes = () => {
    const location = useLocation();
    
    // On récupère le token au moment précis où la route change
    const token = localStorage.getItem('token');

    if (!token) {
        // 'replace' empêche l'utilisateur de revenir en arrière avec le bouton du navigateur
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default PrivateRoutes;