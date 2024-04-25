import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UploadImage from "../../components/UploadImage.jsx"; // Import the UploadImage component
const API_URL = import.meta.env.VITE_API_URL;

const EditProfile = () => {
  const userData = useSelector((state) => state.auth);
  console.log("Starting Edit Profile", userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(userData.name);
  const [age, setAge] = useState(userData.age);
  const [height, setHeight] = useState(userData.height.value);
  const [weight, setWeight] = useState(userData.weight);
  const [pic, setPic] = useState(userData.pic);
  const [fitnessGoals, setFitnessGoals] = useState(userData.fitnessGoals);

  const editProfileHandler = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };

      const updatedUserData = {
        name,
        height: {
          unit: "ft",
          value: height,
        },
        weight,
        age,
        pic,
        bio: fitnessGoals,
      };

      const { data } = await axios.put(
        `${API_URL}/user`,
        updatedUserData,
        config
      );

      dispatch(updateUser({ ...data.data, fitnessGoals: data.data.bio }));
      console.log("Edited Profile", data.data);
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <section
        id="editprofile-container"
        style={{
          minHeight: "80vh",
          padding: "5rem 1.25rem",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Edit Profile</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems:'center',
            padding: "0.5rem 0",
          }}
        >
          <UploadImage picUrl={pic} changePicUrl={setPic} />
        </div>
        <form
          onSubmit={editProfileHandler}
          style={{
            marginTop: "1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.3rem",
          }}
        >
          {/* Render the UploadImage component for profile picture */}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              minHeight: "50vh",
              alignItems: "space-evenly",
            }}
          >
            {/* Rest of the form fields */}
            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                fontSize: "1.25rem",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "3px solid black",
                outline: "none",
                width: "45%",
                minWidth: '300px'
              }}
            />
            {/* Age */}
            <input
              type="number"
              placeholder="Age"
              name="age"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{
                padding: "4px 10px",
                fontSize: "1.25rem",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "3px solid black",
                outline: "none",
                width: "45%",
                minWidth: '300px'
              }}
            />
            {/* Height */}
            <input
              type="number"
              placeholder="Height in ft [5.6]"
              name="height"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              style={{
                padding: "4px 10px",
               
                fontSize: "1.25rem",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "3px solid black",
                outline: "none",
                width: "45%",
                minWidth: '300px'
              }}
            />
            {/* Weight */}
            <input
              type="number"
              placeholder="Weight in kgs [65]"
              name="weight"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={{
                padding: "4px 10px",
                fontSize: "1.25rem",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "3px solid black",
                outline: "none",
                width: "45%",
                
                minWidth: '300px'
              }}
            />
            {/* Fitness Goals */}
            <input
              type="text"
              placeholder="Fitness Goals"
              name="fitnessGoals"
              id="fitnessGoals"
              value={fitnessGoals}
              onChange={(e) => setFitnessGoals(e.target.value)}
              style={{
                padding: "4px 10px",

                fontSize: "1.25rem",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "3px solid black",
                outline: "none",
                width: "90%",
                minWidth: '300px'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "#00647A",
              // backgroundColor: "lightgreen",
              padding: "0.2rem 2rem",
              margin: "auto",
              color: "white",
              fontWeight: "bold",
              borderRadius: "0.5rem",
            }}
          >
            Save Details
          </button>
        </form>
      </section>
    </div>
  );
};

export default EditProfile;
