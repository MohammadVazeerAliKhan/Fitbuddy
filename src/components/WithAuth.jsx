import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { login, logout, updateUser } from '../slices/authSlice.js';
import { Navigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const dispatch = useDispatch();
        const auth = useSelector((state) => state.auth);

        useEffect(() => {
            const checkAuthStatus = () => {
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        const userData = jwtDecode(token);
                        const { name, email, pic, id } = userData;
                        dispatch(updateUser({ name, email, pic, id }));
                        dispatch(login());
                    } else {
                        dispatch(logout());
                    }
                } catch (err) {
                    console.log('Error in withAuth:', err);
                    dispatch(logout());
                }
            };

            checkAuthStatus();
        }, [dispatch]);

        // Render the WrappedComponent if user is authenticated, otherwise redirect to login page
        return auth.isLoggedIn ? <WrappedComponent {...props} /> : <Navigate to="/" />;
    };

    return AuthComponent;
};

export default withAuth;
