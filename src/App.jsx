// App main component in the website and has routing for website navigation
// Imports
import React, { useEffect, useState } from 'react';
import Navbar from './components/navbar/Navbar.jsx';
import { HashRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import ContactUs from './components/footer/Footer.jsx';
import { jwtDecode } from 'jwt-decode';
import Home from './screens/home/Home.jsx';
import Profile from './screens/profile/Profile.jsx';
import CreateGroup from './screens/creategroup/CreateGroup.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditProfile from './screens/profile/EditProfile.jsx';
import CreateChallenge from './screens/createchallenges/CreateChallenge.jsx';
import ShowMembers from './screens/privategroups/privategropmembernew.jsx';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, updateUser } from './slices/authSlice.js';
// import PublicGroup from "./screens/publicgroups/PublicGroup.jsx";
import PrivateGroup from './screens/privategroups/PrivateGroup.jsx';
import ComingSoon from './components/comingsoon/ComingSoon.jsx';
import Loading from './components/loading/Loading.jsx';

const ProtectedRoutes = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const checkAuthStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const userData = jwtDecode(token);
                    const { name, email, pic, id } = userData;
                    dispatch(updateUser({ name, email, pic, id }));
                    dispatch(login());
                    setLoading(false);
                } else {
                    dispatch(logout()); // Logout if no token found
                    setLoading(false);
                }
            } catch (err) {
                console.log('Error in ProtectedRoutes:', err);
                dispatch(logout()); // Logout if decoding fails
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, [dispatch]); // Only run on mount to check auth status

    const auth = useSelector((state) => state.auth);

    if (loading) {
        // You can render a loading indicator here if needed
        return <Loading />;
    }

    // Render children only if user is logged in
    if (auth.isLoggedIn) {
        return <Outlet />;
    } else {
        return <Navigate to="/" />;
    }
};

const App = () => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (token) {
                const userData = jwtDecode(token);
                setUser(userData);
                dispatch(updateUser({ ...userData }));
                dispatch(login());
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setLoading(false);
    }, [user, loading]);

    const handleLogout = () => {
        setUser('');
        setLoading(false);
        dispatch(logout());
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <Router>
                <Navbar /* isLoggedIn={user ? true : false}*/ logoutUser={handleLogout} />
                <ToastContainer position="bottom-center" />

                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/contactus" element={<ContactUs />} />
                        <Route path="/editprofile" element={<EditProfile />} />
                        <Route path="/publicgroups" element={<ComingSoon />} />
                        <Route path="/profile" element={<ProtectedRoutes />}>
                            <Route index element={<Profile />} />
                        </Route>
                        <Route path="/creategroup" element={<CreateGroup />} />
                        <Route path="/groups/:id/createchallenge" element={<CreateChallenge />} />
                        <Route path="/privategroup/:id/members" element={<ShowMembers />} />
                        <Route path="/privategroup/:id" element={<PrivateGroup />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
};

export default App;
