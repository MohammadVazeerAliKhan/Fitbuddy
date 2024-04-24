import React, { useEffect, useState } from "react";
import { Typography, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const CreateChallenge = () => {
  const { id } = useParams();
  const history = useNavigate();
  useEffect(() => {
    if (!id) {
      history("back");
    }

    const handleGetGroupData = async () => {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      axios.get(`${API_URL}/groups/${id}`, config).then(({ data }) => {
        if (data.data && data.data) {
          setGroupData(data.data);
          console.log(data.data);
        }
      });
    };
    handleGetGroupData();
  }, []);

  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [groupData, setGroupData] = useState(null);
  // const [challengeType, setChallengeTyp e] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleStartDateChange = (e) => {
    const date = new Date(e.target.value);
    setStartDate(date);
    // If end date is selected and it is less than start date + 3 days, update end date to start date + 3 days
    if (
      endDate &&
      date &&
      date.getTime() + 3 * 24 * 60 * 60 * 1000 > endDate.getTime()
    ) {
      setEndDate(new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000));
    }
  };

  const handleEndDateChange = (e) => {
    const date = new Date(e.target.value);
    setEndDate(date);
  };

  const createDateFormat = (data) => {
    // Get the current date
    const currentDate = new Date(data);

    // Subtract one day from the current date
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 1);
    return previousDate.toISOString();
  };
  const handleCreateChallenge = () => {
    /*
      "name":"pushups-testing",
    "startDate":"2024-04-02",
    "endDate":"2024-05-24",
    "groupId":"66059b43a0a15d691cbe8e6e", 
    "description":"plank testing"
    */

    // Convert the previous date to ISO string
    const startDateISOString = createDateFormat(startDate);
    const endDateISOString = createDateFormat(endDate);
    if(!challengeTitle || !challengeDescription || !startDate || !endDate){
        return toast.warning('Please fill all the required fields')
    }
    let body = {
      startDate: startDateISOString.split("T")[0],
      endDate: endDateISOString.split("T")[0],
      groupId: id,
      name: challengeTitle,
      description: challengeDescription,
    };
    // console.log(body);

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    // console.log(config);
    axios
      .post(`${API_URL}/challenges`, body, config)
      .then(({ data }) => {
        console.log("response: ", data);
        if (data.success) {
          toast.success("Challenge created successfull...");
          history(-1);
        } else {
          toast.error("Please try later...");
        }
      })
      .catch((err) => {
        toast.error(err);
        console.log("error while create challenge: ", err);
      });
  };

  return (
    <div
      className="createchallenges-container"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        textAlign: "center",
        paddingTop: "10vh",
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
        minWidth: "350px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
          padding: "20px 0",
        }}
      >
        
        <div style={{ textAlign: "left" }}>
          <h1>{groupData && groupData.name}</h1>
          <p>{groupData && groupData.description}</p>

          <p>
            Members: {groupData && groupData.users ? groupData.users.length : 0}
          </p>
        </div>
      </div>

      {/* <img
        src="/Assets/Images/createprivategroup.jpg"
        alt="creategroupbackground"
        style={{ width: "100%", height: "250px", objectFit: "cover" }}
      /> */}
      <Typography variant="h5">
        Create your own challenges and invite friends to be part of your fitness
        journey
      </Typography>
      {/* <Typography>
        Join our vibrant challenges{" "}
        <Link
          to="/joingroup"
          style={{
            textDecoration: "none",
            fontWeight: "bold",
            // backgroundColor: "skyblue",
            cursor: "pointer",
          }}
        >
          here
        </Link>{" "}
        and kickstart your fitness journey with the ultimate motivation.{" "}
      </Typography> */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          // alignItems: 'flex-start',
          gap: "4vh",
          alignItems: "center",
          flexDirection: "column",
          paddingBottom: '30px'
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "90vw",
            justifyContent: "center",
            alignItems:'center'
          }}
        >
          <h2 style={{ alignSelf: "flex-start" }}>Create Challenge</h2>
          <TextField
            label="Challenge Title:"
            type="text"
            value={challengeTitle}
            onChange={(e) => setChallengeTitle(e.target.value)}
            placeholder="Challenge Name"
            required
            sx={{
              mb: 1,
              width: "90%",
              color: "black",
              backgroundColor: "white",
            }}
          />
          <TextField
            label="Challenge Description:"
            type="text"
            value={challengeDescription}
            onChange={(e) => setChallengeDescription(e.target.value)}
            placeholder="Add Challenge Description"
            required
            sx={{
              mb: 1,
              width: "90%",
              backgroundColor: "white",
              color: "black",
            }}
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

          <p style={{ textAlign: "left" }}>
            Challenge Duration{"     "}
            <small> (* Challenge should be of minimum 3days)</small>
          </p>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "30px",
              padding: "10px 0",
            }}
          >
            <div style={{ minWidth: "250px", width: "90%" }}>
              <label htmlFor="startDate">Start Date: </label>

              <input
                label="Start Date"
                type="date"
                id="startDate"
                required
                style={{ marginBottom: 1, fontWeight: "bold" }}
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                onChange={handleStartDateChange}
                min={new Date(Date.now()).toISOString().split("T")[0]} // Set min attribute to today's date
              />
            </div>
            <div style={{ minWidth: "250px", width: "90%" }}>
              <label htmlFor="endDate">End Date: </label>
              <input
                label="End Date"
                type="date"
                id="endDate"
                required
                style={{ mb: 1, fontWeight: "bold" }}
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                onChange={handleEndDateChange}
                min={
                  startDate
                    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    : null
                }
              />
            </div>
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 40px",
              backgroundColor: "#00647A",
              color: "white",
              fontWeight: "bold",
              width: "50%",
                            minWidth: "200px",
              alignSelf: "center",
              borderRadius:'12px'
            }}
            onClick={handleCreateChallenge}
          >
            Add Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChallenge;
