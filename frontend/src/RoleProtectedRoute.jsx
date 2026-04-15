import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const RoleProtectedRoute = ({ allowedRoles }) => {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('token');

    if (!token) return <Navigate to="/login" replace />;

    // Vérifie si le rôle de l'utilisateur (ex: "Administrateur") est dans le tableau
    if (!allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default RoleProtectedRoute;