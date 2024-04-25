import React, { useState } from "react";
import {
  Modal,
  Typography,
  Box,
  IconButton,
  Button,
  TextField,
} from "@mui/material";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
const API_URL = import.meta.env.VITE_API_URL;
const SignupModal = ({ open, onClose, navToLogin }) => {
  // Setting up local state for login form input
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  // Action for register form submit
  const handleSignup = async (e) => {
    e.preventDefault();
    // Checking for password match
    let regex = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
    console.log(regex.test(email));
    if (!regex.test(email)) {
      console.log('Invalid');
      toast.warning('Invalid Email address');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Posting register data to save in database
    try {
      const { data } = await axios.post(
        `${API_URL}/user/register`,
        { name: username, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(data);
      // If there is no response data received, throw an error
      if (!data) {
        throw new Error(response.message || "Failed to register.");
      }

      // On successful registration, user should login
      toast.success("Registration successful!");

      navToLogin();
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.message || "Failed to register. Please try again.");
    }

    // console.log(email, password);
  };
  const handleLoginSuccess = async (response) => {
    // console.log('Login success:', response);
    const accessToken = response.credential;
    const userData = jwtDecode(accessToken);
    // dispatch()

    const config = {
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const body = {
      ...userData,
    };
    try {
      const { data } = await axios.post(`${API_URL}/user/google`, body, config);
      console.log(data.data);
      // toast.success("token: ", data);
      toast.success("Login successful");
      try {
        const decoded = jwtDecode(data.token);

        const { name, email, pic, id } = decoded;
        console.log(name, email, pic, id);
        dispatch(updateUser({ name, email, pic, id }));
        dispatch(login());

        localStorage.setItem("token", data.token);
        // console.log(user);
        await onClose();
        // await onClose();
      } catch (err) {
        console.error(err);
      }

      // Navigate to homepage after login success

      // console.log(userData);

      // Send the access token to your backend for verification and user handling
    } catch (err) {
      console.log("err in google login: ", err);
    }
  };

  const handleLoginFailure = (error) => {
    console.error("Login failed:", error);
  };


  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "8vh",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 4,
          maxWidth: "80%",
          width: "auto",
          maxHeight:'85vh'
        }}
      >
        <div style={{ display: "flex" }}>
          <Typography variant="h6" sx={{ textAlign: "center", flexGrow: 1 }}>
            Sign up
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ "&:hover": { backgroundColor: "red" } }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <form onSubmit={handleSignup} style={{ width:'90%',margin:'auto', paddingTop: "8px" }}>
          <TextField
            label="User Name"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter User Name"
            required
            autoComplete="username"
            fullWidth
            inputProps={{ minLength: 3 }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="Enter Email"
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
            autoComplete="new-password"
            fullWidth
            inputProps={{ minLength: 8 }}
            sx={{ mb: 2 }}          
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            autoComplete="new-password"
            fullWidth
            inputProps={{ minLength: 8 }}
          />
          <div style={{display:'flex', justifyContent:'center',  padding:'1vh'}}>

          <Button type="submit" sx={{cursor:'pointer'}} variant="contained" color="primary">
            Sign Up
          </Button>
          </div>
          
          
        </form>
        <hr />
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', paddingTop: '1vh'}}>
          <GoogleOAuthProvider clientId="79886345736-m9qkupb4jaqp34ukqkibtirsjot6u7tc.apps.googleusercontent.com" >
            <GoogleLogin
              buttonText="Login with Google"
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
              scope="profile email"
             
            />
          </GoogleOAuthProvider>
          </div>
          <Typography variant="body1" sx={{ padding: "2vh 6px", textAlign:'center' }}>
            Already have an account?{" "}
            {/* <Link to="/login">
            <strong>Login</strong>
          </Link> */}
            <Typography variant="contained" sx={{cursor:'pointer'}} onClick={navToLogin}>
              <strong>Login</strong>
            </Typography>
          </Typography>

        <ToastContainer position="top-right" autoClose={3000} />
      </Box>
    </Modal>
  );
};

export default SignupModal;
