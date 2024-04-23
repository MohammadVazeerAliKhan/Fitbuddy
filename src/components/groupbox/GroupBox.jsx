import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import "./GroupBox.css";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const GroupBox = () => {
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const handlePrivateGroupClick = () => {
    if (!user.isLoggedIn) {
      toast.warning("Login is required to create or join groups");
      navigate("/");
      return;
    }
    navigate("/creategroup");
  };

  return (
    <div
      className="groupbox-container"
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div className="groupbox" style={{ minWidth: "320px" }}>
        <h1 style={{ fontSize: "1.8rem" }}>Private Group</h1>
        <p style={{ fontSize: "1.3rem", textAlign: "center" }}>
          Create groups with your buddies
        </p>
        <div className="arrow-link">
          <FontAwesomeIcon
            icon={faCircleChevronRight}
            onClick={handlePrivateGroupClick}
          />
        </div>
      </div>
      <div className="groupbox" style={{ minWidth: "320px" }}>
        <h1 style={{ fontSize: "1.8rem" }}>Public Group</h1>
        <p style={{ fontSize: "1.3rem", textAlign: "center" }}>
          Explore open groups to join
        </p>
        <div className="arrow-link">
          <ScrollLink to="groups-container" smooth={true} duration={500}>
            <FontAwesomeIcon icon={faCircleChevronRight} />
          </ScrollLink>
        </div>
      </div>
    </div>
  );
};

export default GroupBox;
