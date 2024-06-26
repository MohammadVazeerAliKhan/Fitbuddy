import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
// import NavbarLogo from "./NavbarLogo.jsx";
import {NavLink} from 'react-router-dom';

import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/authSlice";
import LoginModal from "../../screens/login/LoginModal";
import SignupModal from "../../screens/register/SignupModal";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
const Navbar = ({ logoutUser }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openLoginModal, setOpenLoginModal] = React.useState(false);
  const [openSignupModal, setOpenSignupModal] = React.useState(false);
  const userData = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isNotHome = location.pathname !== "/";

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenLoginModal = () => {
    setOpenLoginModal(true);
    setOpenSignupModal(false);
  };

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };

  const handleOpenSignupModal = () => {
    setOpenSignupModal(true);
    setOpenLoginModal(false);
  };

  const handleCloseSignupModal = () => {
    setOpenSignupModal(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    logoutUser();
    navigate("/");
  };
  return (
    <>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: 'white' }}
      >
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems:'center' }}>
          <NavLink
      to="/"
    >            <img src='Assets/Images/logo.png' alt='fitbuddylogo'  height="50px"/>

    </NavLink>
          </Typography>

          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: "none", sm: "block" }, flexGrow: 1 }}
          ></Typography>

          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {userData.isLoggedIn ? (
              <>
                <Button onClick={() => {navigate('/profile')} }
                  
                >
                  <strong style={{ color: "black", paddingRight: '30px' }}>PROFILE</strong>
                </Button>
                <Button onClick={handleLogout}>
                  <strong style={{ color: "black" }}>
                    Logout
                  </strong>
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleOpenSignupModal}>
                  <strong style={{ color:"black" }}>
                    Signup
                  </strong>
                </Button>
                <Button onClick={handleOpenLoginModal}>
                  <strong style={{ color: "black" }}>
                    Login
                  </strong>
                </Button>
              </>
            )}
          </Typography>

          <IconButton
            size="large"
            edge="end"
            aria-label="menu"
            sx={{
              color:"black",
              display: { xs: "block", sm: "none" },
            }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {userData.isLoggedIn && (
              <MenuItem onClick={handleMenuClose}>
                <Button
                  sx={{ color: "black", fontSize: "1rem" }}
                  onClick={() => navigate('/profile')}
                >
                  PROFILE
                </Button>
              </MenuItem>
            )}
            <MenuItem onClick={handleMenuClose}>
              {userData.isLoggedIn ? (
                <Button
                  sx={{ color: "black", fontSize: "1rem" }}
                  onClick={handleLogout}
                >
                  LOGOUT
                </Button>
              ) : (
                <Button sx={{ color: "black" }} onClick={handleOpenSignupModal}>
                  SIGNUP
                </Button>
              )}
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              {!userData.isLoggedIn && (
                <Button sx={{ color: "black" }} onClick={handleOpenLoginModal}>
                  Login
                </Button>
              )}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <LoginModal
        open={openLoginModal}
        onClose={handleCloseLoginModal}
        navToSignUp={handleOpenSignupModal}
      />
      <SignupModal
        open={openSignupModal}
        onClose={handleCloseSignupModal}
        navToLogin={handleOpenLoginModal}
      />
    </>
  );
};

export default Navbar;
