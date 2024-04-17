import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateUser } from "../../slices/authSlice.js";
import { groups } from "../../slices/groupsSlice";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const groupsList = useSelector(groups);
  const userData = useSelector((state) => state.auth);
  //   console.log("Profile component", userData);
  // const [data, setData] = useState([]);
  const [privateGroups, setPrivateGroups] = useState([]);
  const [loadingGroup, setLoadingGroup] = useState(false);

  //
  useEffect(() => {
    getPrivateGroups();
  }, []);

  useEffect(() => {
    getPrivateGroups();
  }, [userData.isLoggedIn]);

  const getPrivateGroups = async () => {
    setLoadingGroup(true);
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    };
    try {
      const { data } = await axios.get(`${API_URL}/groups/private`, config);
      console.log("data: ", data);
      setPrivateGroups(data.data);
      console.log("received from api data to set to private groups", data.data);
      setLoadingGroup(false);
    } catch (err) {
      console.log("error: ", err);
      setLoadingGroup(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          };
          const response = await axios.get(
            `${API_URL}/user/${userData.id}`,
            config
          );
          dispatch(
            updateUser({
              ...response.data.data,
              fitnessGoals: response.data.data.bio,
            })
          );
          // Store user data in local storage
          localStorage.setItem("userData", JSON.stringify(response.data.data));
        } else {
          // Redirect the user to the login page if token is not found
          history.push("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Retrieve user data from local storage if available
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      dispatch(updateUser(JSON.parse(storedUserData)));
    }

    fetchUserData();
  }, []);
  const handleDeleteGroup = async (groupAdmin, groupid) => {
    if (userData.id === groupAdmin) {
      try {
        const token = localStorage.getItem("token");
        console.log("Removing the group as admin");
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          };
          const response = await axios.delete(
            `${API_URL}/groups/${groupid}`,
            config
          );
          if (response.data.success) {
            toast.success("Removed the group successfully!");
            // history.push("/profile");
            // setPrivateGroups([]);
            getPrivateGroups();
          } else {
            toast.error("Cannot delete group");
          }
        } else {
          // Redirect the user to the login page if token is not found
          history.push("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      try {
        const token = localStorage.getItem("token");
        console.log("Leaving from the group as member");
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          };
          const response = await axios.put(
            `${API_URL}/groups/${groupid}/members`,
            { user: userData.id },
            config
          );
          if (response.data) {
            toast.success("Left the group successfully!");
          }
        } else {
          // Redirect the user to the login page if token is not found
          history.push("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };
  // setData(data.filter((item, index) => index !== id));
  // };

  //   console.log(userData.fitnessGoals);
  const editProfileHandler = () => {
    history("/editprofile");
  };

  const handleNavigatePrivateGroup = (id) => {
    console.log(id);
    if (!id) {
      console.log(" group id required!!");
      return;
    }

    history(`/joinprivategroup/${id}`);
  };

  return (
    // Your JSX for Profile component...
    <div
      className="profile-container"
      style={{
        padding: "10vh",
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <Grid
        container
        spacing={4}
        style={{ color: "white" }}
        sx={{ background: "black" }}
      >
        <Grid item xs={12}>
          <Paper
            sx={{ padding: "10px", backgroundColor: "black", color: "white" }}
          >
            <h3>User Profile</h3>
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "10px",
              }}
            >
              <img src={userData?.pic} alt="profilePic" height="100px" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <h4>{userData?.name}</h4>
                <p>
                  Age: {userData?.age} | Weight: {userData?.weight}kg | Height:{" "}
                  {userData?.height?.value} ft
                </p>
                <p>Fitness Goals: {userData?.fitnessGoals}</p>
                <button
                  onClick={editProfileHandler}
                  style={{
                    color: "black",
                    backgroundColor: "#FFD700",
                    alignSelf: "flex-start",
                    padding: "2px 25px",
                  }}
                >
                  <strong>Edit</strong>
                </button>
              </div>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            sx={{ padding: "10px", backgroundColor: "black", color: "#FFD700" }}
          >
            <h3 style={{ textAlign: "center" }}>Groups</h3>

            <div
              style={{
                display: "flex",
                padding: "10px",
                gap: "8px",
                justifyContent: "space-between",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              {privateGroups.map((group, index) => (
                <div
                  key={index}
                  style={{
                    minWidth: "30%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={() => handleNavigatePrivateGroup(group._id)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={group.icon}
                      alt="groupIconPic"
                      height="100px"
                      width="100px"
                    />
                    <div>
                      <h4>{group.name}</h4>
                      <p>{group.description}</p>

                      <span>
                        Role: {group.admin === userData.id ? "Admin" : "Member"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGroup(group.admin, group._id)}
                    style={{
                      color: "black",
                      backgroundColor: "red",
                      margin: "auto",
                      padding: "2px 14px",
                      borderRadius: "10px",
                    }}
                  >
                    <strong>
                      {" "}
                      {group.admin === userData.id
                        ? "Delete Group"
                        : "Leave Group"}{" "}
                    </strong>
                  </button>
                </div>
              ))}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
