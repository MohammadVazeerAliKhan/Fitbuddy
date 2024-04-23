import React from "react";
import { useNavigate } from "react-router-dom/dist";
const ComingSoon = () => {
  const navigate = useNavigate();
  const handleNavHome = () => {
    navigate("/");
  };
  return (
    <div
      style={{
        // backgroundColor: "skyblue",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "10vh",
        height: "100vh",
        width: "100vw",
      }}
    >
      <h1 style={{ padding: "2vw 10vw", textAlign: "center" }}>
        We're working on this feature. It will be available soon.{" "}
      </h1>
      <button
        style={{
          color: "black",
          backgroundColor: "inherit",
          padding: "0.1rem 0.4rem",
          borderRadius: "0.7rem",
        }}
        onClick={handleNavHome}
      >
        <strong>Back</strong>{" "}
      </button>
    </div>
  );
};

export default ComingSoon;
