import React, { useState } from "react";
import { TextField, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UploadImage from "../../components/UploadImage.jsx";
const CreateGroupForm = () => {
  const navigate = useNavigate();
  const [groupIcon, setGroupIcon] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const handleReset = () => {
    setGroupName("");
    setGroupDescription("");
  };

  const handleCreateGroupSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // api request and then set the other values to initial values
      const API_URL = import.meta.env.VITE_API_URL;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const body = {
        name: groupName,
        description: groupDescription,
        icon: groupIcon,
      };

      // if (previewImage) body.icon = previewImage;

      const { data } = await axios.post(`${API_URL}/groups`, body, config);
      console.log("data: ", data);
      // handleReset();
      navigate("/");
      // navigate('/createchallenge');
    } catch (err) {
      console.log("Error in create Group: ", err);
    }
  };

  return (
    <div className="creategroup-container">
      <div
        className="creategroup-form"
        style={{ width: "50%", margin: "auto" }}
      >
        <div
          style={{ width: "90%", backgroundColor: "#CFDBF8", color: "black" }}
        >
          <small>Add Group Icon here</small>
          <UploadImage picUrl={groupIcon} changePicUrl={setGroupIcon} />
        </div>

        <form
          onSubmit={handleCreateGroupSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            width: "90%",
            backgroundColor: "#CFDBF8",
            padding: "12px",
            marginBottom: "40px",
          }}
        >
          <TextField
            label="Group Name:"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name here..."
            required
            sx={{ mb: 1, width: "90%" }}
          />
          <TextField
            label="Group Description:"
            type="text"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            placeholder="Group Description here..."
            required
            sx={{ mb: 1, width: "90%" }}
          />
          {/* <TextField
            label="Challenge Type:"
            type="text"
            value={challengeType}
            onChange={(e) => setChallengeType(e.target.value)}
            placeholder="Yoga/Dance/Cardio"
            required
            sx={{ mb: 1 }}
          /> */}
          {/* <input
            label="Start Date"
            type="date"
            style={{ mb: 1 }}
            value={startDate ? startDate.toISOString().split("T")[0] : ""}
            onChange={handleStartDateChange}
            max={
              endDate
                ? new Date(endDate.getTime() - 3 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                : null
            }
          />
          <input
            label="End Date"
            type="date"
            style={{ mb: 1 }}
            value={endDate ? endDate.toISOString().split("T")[0] : ""}
            onChange={handleEndDateChange}
            min={
              startDate
                ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                : null
            }
          /> */}
          <button
            type="submit"
            style={{
              padding: "10px 40px",
              backgroundColor: "#00647A",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupForm;