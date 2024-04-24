import React, { useState } from "react";
import {
  Modal,
  Typography,
  Box,
  IconButton,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { login, updateUser } from "../../slices/authSlice";

import { GoogleLogin } from "@react-oauth/google";

const LoginModal = ({ open, onClose, navToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  // console.log(API_URL);

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    // let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    let regex = new RegExp('/^\w+@[a-zA-Z_]+\.(com)$/');
    console.log(regex.test(email))
    if(!regex.test(email)){
    
      return toast.warning('Invalid Email address');
      
    }
    try {
      const { data } = await axios.post(
        `https://halos-backend-test-es6.onrender.com/api/user/login`,
        { email, password },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      // console.log(response);
      // If there is no response data received, throw an error
      if (!data) {
        setErrorMessage("Please enter the registered email");
        throw new Error(errorMessage);
      }
      // Setting in local storage

      localStorage.setItem("token", data.data.token);
      if (rememberMe) {
        localStorage.setItem("email", email);
      }
      console.log(data.data.token);
      try {
        const decoded = jwtDecode(data.data.token);

        const { name, email, pic, id } = decoded;
        // console.log(name, email, pic, id);
        dispatch(updateUser({ name, email, pic, id }));
      } catch (err) {
        console.error(err);
      }

      dispatch(login());

      // Navigate to homepage after login success
      toast.success("Login successful!");

      await onClose();

      // navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error('Failed to login, please try again later.');
    }
  };
  // Function to load saved credentials if "Remember Me" is checked
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }
  };


  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "12vh",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          p: 3,
          borderRadius: 4,
          maxWidth: "80%",
          width: "auto",
        }}
      >
        {" "}
        <div style={{ display: "flex" }}>
          <Typography variant="h6" sx={{ textAlign: "center", flexGrow: 1 }}>
            Login
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ "&:hover": { backgroundColor: "red" } }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <form onSubmit={handleLoginSubmit} style={{ paddingTop: "8px" }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
            autoComplete="email"
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
            sx={{ mb: 2 }}
          />
          {/* Remember me checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => handleRememberMeChange(e)}
              />
            }
            label="Remember me"
            sx={{ mb: 2 }}
          />
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            wrap="wrap"
            marginBottom={2}
            sx={{paddingBottom:'1vh'}}
          >
            {/* Forgot password */}
            <Grid item>
              <Link to="/resetpassword">Forgot Password?</Link>
            </Grid>
            {/* Login Button */}
            <Grid item>
              <Button variant="contained" color="primary" type="submit">
                Login
              </Button>
            </Grid>
          </Grid>
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
          

          {errorMessage && (
            <Typography variant="body2" color="error" gutterBottom>
              {errorMessage}
            </Typography>
          )}
          <Typography variant="body1" gutterBottom sx={{paddingTop:'2vh', textAlign:'center'}}>
            Don't have an account?{" "}
            {/* <Link to="/register">
              <strong>Register</strong>
            </Link> */}
            <Typography variant="contained" onClick={navToSignUp} sx={{cursor: 'pointer'}}>
              <strong>Sign Up</strong>
            </Typography>
          </Typography>
        </form>
      </Box>
    </Modal>
  );
};

export default LoginModal;
