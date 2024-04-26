import React from "react";
import { useNavigate } from "react-router-dom";

const GroupItem = ({ group, id }) => {
  const navigate = useNavigate();
  const handleExploreGroup = (e) => {
    e.preventDefault();
    navigate(`/publicgroups`);
  };

  return (
    <button      className="groupitem-container" style={{display: 'flex',backgroundColor:'white',    flexDirection: 'column', gap:'5px', border: 'none', borderRadius: '10px', minWidth:'75px', width: '27vw', alignItems: 'center',
  }}
              
          // onClick={handleExploreGroup}
        >
          <img src={group.imageUrl} alt="groupIcon" width='50%'  style={{borderRadius: '10px 10px 0 0',cursor:'pointer', minWidth: '75px', minHeight: '75px',}} />
          
        <strong style={{fontSize:'0.8rem', cursor:'pointer',}}>{group.groupName}</strong>
        </button>

  );
};

export default GroupItem;
