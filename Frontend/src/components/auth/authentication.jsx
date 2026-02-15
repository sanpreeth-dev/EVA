import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// 2. Public Route Wrapper
const PublicRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
};
export { ProtectedRoute, PublicRoute };