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
     
    >
      <div className="groupbox">
        <h1 >Private Group</h1>
        <p >
          Create private groups
        </p>
        <div className="arrow-link">
          <FontAwesomeIcon
            icon={faCircleChevronRight}
            onClick={handlePrivateGroupClick}
          />
        </div>
      </div>
      <div className="groupbox">
        <h1>Public Group</h1>
        <p>
          Explore public groups
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
