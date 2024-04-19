// App main component in the website and has routing for website navigation
// Imports
import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar/Navbar.jsx";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import Home from "./screens/home/Home.jsx";
import Profile from "./screens/profile/Profile.jsx";
import CreateGroup from "./screens/creategroup/CreateGroup.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditProfile from "./screens/profile/EditProfile.jsx";
import CreateChallenge from "./screens/createchallenges/CreateChallenge.jsx";
import ShowMembers from "./screens/privategroups/privategropmembernew.jsx";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, updateUser } from "./slices/authSlice.js";
import PublicGroup from "./screens/publicgroups/PublicGroup.jsx";
import PrivateGroup from "./screens/privategroups/PrivateGroup.jsx";
import ComingSoon from "./components/comingsoon/ComingSoon.jsx";
import Loading from "./components/loading/Loading.jsx";
const ProtectedRoutes = ({ childrens, ...rest }) => {
  const auth = useSelector((state) => state.auth);
  // if the user authenticated go to that desired routes
  if (auth.isLoggedIn) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
};

const App = () => {
  const dispatch = useDispatch();
  // const data = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        const userData = jwtDecode(token);
        setUser(userData);
        const { name, email, pic, id } = userData;
        // console.log(name, email, pic, _id);
        dispatch(updateUser({ name, email, pic, id }));
        dispatch(login());
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // console.log(user);
    setLoading(false);
  }, [user, loading]);

  const handleLogout = () => {
    setUser("");
    setLoading(false);
    dispatch(logout());
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Router>
        <Navbar
          /* isLoggedIn={user ? true : false}*/ logoutUser={handleLogout}
        />
        <ToastContainer />
        <video autoPlay muted loop id="bg-video">
          <source
            // src="https://videos.pexels.com/video-files/4325592/4325592-uhd_4096_2160_25fps.mp4"
            // src="https://videos.pexels.com/video-files/5319099/5319099-uhd_3840_2160_25fps.mp4"
            src="https://videos.pexels.com/video-files/4761424/4761424-uhd_4096_2160_25fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        <div className="website-background">
          <Routes>
            {/* {user ? (
                            <> */}
            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/publicgroups" element={<ComingSoon />} />
            <Route path="/profile" element={<ProtectedRoutes />}>
              <Route path="/profile" Component={Profile} />
            </Route>
            {/* </>
                        ) : (
                            <Redirect to="/" />
                        )} */}
            <Route path="/creategroup" element={<CreateGroup />} />{" "}
            <Route
              path="/groups/:id/createchallenge"
              element={<CreateChallenge />}
            />{" "}
            <Route path="/privategroup/:id/members" element={<ShowMembers />} />
            {/* <Route path="/joinpublicgroup/:id" element={<PublicGroup />} /> */}
            <Route path="/privategroup/:id" element={<PrivateGroup />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
