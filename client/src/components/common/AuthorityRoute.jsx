import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AuthorityRoute = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'authority' && user.role !== 'admin') {
        return <Navigate to="/" replace />; // Redirect citizens to their dashboard
    }

    return <Outlet />;
};

export default AuthorityRoute;
