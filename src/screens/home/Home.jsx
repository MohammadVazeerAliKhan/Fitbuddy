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
      
    >
      {!user.isLoggedIn && (
          <h2 className='homepage-quote'
          >
            Stay healthy and active with your friends and loved ones
          </h2>
      )}
      {user.isLoggedIn && (
        <>
          <h1 className='homepage-quote'>
            Welcome to fitbuddy <em>{user?.name}</em>{" "}
          </h1>

          {loadingGroup ? <Loading /> : (
          <Box
            width="100vw"
            
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={4}
            p={2}
            sx={{ flexWrap: "wrap" }}
          >
            {privateGroups.map((group, index) => (



              <button  
                key={index}    className="groupitem-container" style={{display: 'flex', cursor: 'pointer',     flexDirection: 'column', gap:'5px', border: 'none', borderRadius: '10px', minWidth:'75px', width: '22%', alignItems: 'center',
                }}
                onClick={() => handleNavigatePrivateGroup(group._id)}
              >
                <img src={group.icon} alt="groupIcon" width='50%' style={{borderRadius: '10px 10px 0 0', minWidth: '75px', minHeight: '75px',}} />
          
                <strong style={{fontSize:'0.8rem'}}>{group.name}</strong>
              </button>))}
          </Box>)}
        </>
      )}
      <section
        id="publicprivategroupnav"
        
      >

        <GroupBox />
      </section>
      {/* {!user.isLoggedIn && ( */}
      <section
        id="groups-container"
        style={{ paddingTop: '2vh'}}
      >
        <h2 className="publicgroups-heading" >
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
      <section id='footer' className='footer'>
        {/* <p style={{textAlign:'center', padding:'3vh', fontWeight: 'bold'}}>&copy; 2024 fitbuddy.live All rights reserved.</p> */}
        <p style={{textAlign: 'center', paddingBottom:'3vh'}}><button onClick={() => history('/contactus') } style={{cursor:'pointer'}}>Contact Us</button></p>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default Home;
