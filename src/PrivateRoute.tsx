import React from 'react';
import { Route, useNavigate } from 'react-router-dom';

interface PrivateRouteProps {
    component: React.ComponentType<any>;
    path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem('access_token');
    const navigate = useNavigate();
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return <Component {...rest} />;
};

export default PrivateRoute;
