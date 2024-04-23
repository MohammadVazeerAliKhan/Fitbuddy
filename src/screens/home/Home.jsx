import React, { useState } from "react";
import "./Home.css";
import { useRef, useEffect } from "react";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import { groups } from "../../slices/groupsSlice";
import { goals } from "../../slices/goalsSlice";
import GroupItem from "../../components/groupitem/GroupItem";
import GoalItem from "../../components/goalItem/GoalItem";
import Footer from "../../components/footer/Footer";
import GroupBox from "../../components/groupbox/GroupBox.jsx";
import axios from "axios";
import TeamSlider from "../../components/ourteam/TeamSlider.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import Loading from "../../components/loading/Loading.jsx";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
const API_URL = import.meta.env.VITE_API_URL;
const ExploreButton = () => {
  const handleExploreClick = () => {
    // Scroll to the target section groups
    const targetSection = document.getElementByid("publicprivategroupnav");
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <IconButton
      aria-label="explore"
      color="primary"
      onClick={handleExploreClick}
      sx={{
        color: "#f542c5",
        border: "2px solid white",
        padding: "0.5rem 1.25rem",
        borderRadius: "1.25rem",
        transition: "box-shadow 0.1s",
        "&:hover": {
          boxShadow: "0px 3px 6px rgba(255, 255, 255, 0.5)",
        },
      }}
    >
      Explore
      <KeyboardArrowDownIcon />
    </IconButton>
  );
};

const Home = () => {
  const groupsList = useSelector(groups);
  const goalsList = useSelector(goals);
  const user = useSelector((state) => state.auth);
  const [privateGroups, setPrivateGroups] = useState([]);
  const [loadingGroup, setLoadingGroup] = useState(false);
  const history = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getPrivateGroups();
  }, []);

  useEffect(() => {
    getPrivateGroups();
  }, [user.isLoggedIn]);

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
      setLoadingGroup(false);
    } catch (err) {
      console.log("error: ", err);
      setLoadingGroup(false);
    }
  };
  // console.log(groupsList);

  const handleNavigatePrivateGroup = (id) => {
    console.log(id);
    if (!id) {
      console.log(" group id required!!");
      return;
    }

    history(`/privategroup/${id}`);
  };

  return (
    <div
      id="homepage-container"
      className="homepage-container"
      style={{ color: "white", paddingTop: "5rem" }}
    >
      {!user.isLoggedIn && (
        <section
          id="aboutus-container"
          style={{
            padding: "1.25rem",
            // minHeight: "40vh",
          }}
        >
          <div
            style={{
              backgroundClip: "text",
              color: "transparent",
              WebkitBackgroundClip: "text",
              marginBottom: "2rem",
              textAlign: "center",
              backgroundImage:
                "linear-gradient(to bottom, #927E13,#70E916,#FFDB17)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                justifyContent: "center",
                gap: "0",
              }}
            >
              <h1
                style={{
                  fontSize: "2.5vw",
                  padding: "0",
                  margin: "0",
                }}
              >
                We at
              </h1>
              <h1
                style={{
                  fontSize: "6vw",
                  padding: "0",
                  margin: "0",
                }}
              >
                FIT
              </h1>
            </div>
            <h1 style={{ fontSize: "10vw" }}>BUDDY</h1>
          </div>
          <h2
            style={{ textAlign: "center", fontSize: "1.8rem", color: "black" }}
          >
            "Create groups, challenges and invite friends to stay consistent
            together in a vibrant community and empower your fitness journey"
          </h2>
        </section>
      )}
      {user.isLoggedIn && (
        <>
          <h1 style={{ textAlign: "center", color: "black" }}>
            Welcome to fitbuddy, <em>{user?.name}</em>{" "}
          </h1>
          {/* <p>{Add some api to fetch fitness quotes to display after user login }</p> */}
          <h2 style={{ textAlign: "center", color: 'black' }}>
            Groups : {privateGroups.length}
          </h2>
          <Box
            width="100vw"
            my={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={4}
            p={2}
            sx={{ flexWrap: "wrap" }}
          >
            {loadingGroup && <Loading />}
            {privateGroups.map((group, index) => (
              <Box
                key={index}
                className="groupitem-container"
                width="20vw"
                minWidth="250px"
                minHeight="250px"
                maxHeight="30vh"
                display="flex"
                alignItems="center"
                gap={4}
                // bgcolor={"white"}
                color={"white"}
                sx={{
                  flexDirection: "column",
                  borderRadius: "20px",
                  justifyContent: "space-between",
                  position: "relative", // Ensure the overlay is positioned relative to the box
                  overflow: "hidden", // Hide overflow to ensure the video is contained within the box
                }}
              >
                {/* Video */}
                <img
                  // src={group.icon}
                  src={group.icon}
                  autoPlay
                  loop
                  muted
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(50%)", // Adjust brightness to 50%
                    zIndex: 1, // Ensure the video is behind the content
                  }}
                ></img>

                {/* Content */}
                <div
                  style={{
                    position: "relative", // Ensure content is positioned relative to the box
                    width: "20vw",
                    minWidth: "250px",
                    minHeight: "250px",
                    maxHeight: "30vh",
                    zIndex: 2, // Ensure content is above the video
                    textAlign: "center",
                    color: "black", // Set text color
                    // color: 'white', // Set text color
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",

                    padding: "8px 4px",
                    height: "100%",
                  }}
                >
                  <h2 style={{color: 'white'}}>{group.name}</h2>
                  <button
                    onClick={() => handleNavigatePrivateGroup(group._id)}
                    style={{
                      padding: "3px 20px",
                      alignSelf: "center",
                      border: "2px solid white",
                      backgroundColor: "black",
                      color: "white",
                      borderRadius: "20px",
                      transition: "box-shadow 0.1s",
                      "&:hover": {
                        boxShadow: "0px 3px 6px rgba(255, 255, 255, 0.5)",
                      },
                    }}
                  >
                    <strong>Explore</strong>
                  </button>
                </div>
              </Box>
            ))}
          </Box>
        </>
      )}
      <section
        id="publicprivategroupnav"
        style={{
          minHeight: "60vh",
          marginTop: "5vh",
          fontFamily: "Roboto",
        }}
      >

        <GroupBox />
      </section>
      {/* {!user.isLoggedIn && ( */}
      <section
        id="groups-container"
        style={{ minHeight: "60vh", paddingTop: "6vh" }}
      >
        <h2 style={{ textAlign: "center", fontSize: "1rem", color: "black", padding: '10px'}}>
          Join our active community of fitness enthusiasts and explore public
          groups!
        </h2>
        <Box
          width="100vw"
          my={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1}
          p={2}
          sx={{ flexWrap: "wrap"}}
        >
          {groupsList.map((group, index) => (
            <GroupItem key={index} group={group} id={index} />
          ))}
        </Box>
      </section>
      {/* )} */}
      <Footer />
    </div>
  );
};

export default Home;
