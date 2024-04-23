import React from "react";
import { useNavigate } from "react-router-dom";

const GroupItem = ({ group, id }) => {
  const navigate = useNavigate();
  const handleExploreGroup = (e) => {
    e.preventDefault();
    navigate(`/publicgroups`);
  };

  return (
    <button      className="groupitem-container" style={{display: 'flex', cursor: 'pointer',     flexDirection: 'column', gap:'5px', border: 'none', borderRadius: '10px', width:'75px', alignItems: 'center',
  }}
              
          onClick={handleExploreGroup}
        >
          <img src={group.imageUrl} alt="groupIcon" height='75px' width='75px' style={{borderRadius: '10px 10px 0 0',}} />
          
        <strong style={{fontSize:'0.8rem'}}>{group.groupName}</strong>
        </button>

  );
};

export default GroupItem;
