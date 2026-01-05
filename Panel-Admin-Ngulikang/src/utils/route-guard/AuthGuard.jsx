import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';

// project import
import { useAuth } from 'hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }) => {
    const { isLoggedIn } = useAuth(); // Assume we will create this hook or reading from localStorage directly

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
};

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
