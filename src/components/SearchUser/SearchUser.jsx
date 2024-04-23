import React, { useEffect, useState } from "react";
import "./SearchUser.css"; // Import CSS file for styling
import { fontWeight } from "@mui/system";
import { toast } from "react-toastify";
import axios from "axios";
const UserList = ({
  users,
  groupMembers,
  setGroupMembers,
  id,
  handleCloseAddMember,
  isLoading,
  setIsLoading,
  // isGroupUpdated,
  // setIsGroupUpdated,
}) => {
  console.log("users: ", users);
  const [usersList, setUsersList] = useState(users);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  console.log("users: ..................", groupMembers);

  useEffect(() => {
    setFilteredUsers(
      usersList.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, usersList]);

  function filterUsersNotInArray(users1, users2) {
    const userMap = {};
    users2.forEach((user) => {
      userMap[user._id] = true;
    });
    return users1.filter((user) => !userMap[user._id]);
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddUsersAPI = async () => {
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
      let userDataToSend = selectedUsers.map((user) => user._id);
      console.log(userDataToSend);
      const body = { users: userDataToSend };

      const { data } = await axios.post(
        `${API_URL}/groups/${id}/members`,
        body,
        config
      );
      console.log("data: dshjebjervhrhr  ", data);
      if (data) {
        console.log("1", selectedUsers, groupMembers);
        setGroupMembers(data.data.users);

        // console.log('2', selectedUsers, groupMembers);
        // // setSelectedUsers([]);

        // console.log('3', selectedUsers, groupMembers);

        toast.success("Added to the group successfully!");
        handleCloseAddMember();
        setIsLoading(true);
      } else {
        toast.error("Something went wrong, please try again later");
      }
      // handleReset();
      // navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddUserToGroup = (user) => {
    // Add the user to the group members and selected users
    console.log(selectedUsers, user);
    setSelectedUsers([...selectedUsers, user]);
    // setGroupMembers([...groupMembers, user]);

    // Update usersList to filter out the selected users
    setUsersList(filterUsersNotInArray(usersList, [...selectedUsers, user]));
  };

  const handleRemoveUserFromGroup = (user) => {
    // Remove the user from the group members and selected users
    setGroupMembers(groupMembers.filter((member) => member._id !== user._id));
    setSelectedUsers(
      selectedUsers.filter((selectedUser) => selectedUser._id !== user._id)
    );

    // Add the removed user back to the usersList
    setUsersList([...usersList, user]);
  };

  const handleClearUsers = () => {
    setFilteredUsers([]);
    setSearchQuery("");
  };

  // if (isGroupUpdated) {
  //   return <p>Loading...</p>;
  // }
  const getRandomColor = () => {
    let r = Math.floor(Math.random() * 151) + 50;
    let g = Math.floor(Math.random() * 151) + 50;
    let b = Math.floor(Math.random() * 151) + 50;
    const color = `rgb(${r}, ${g}, ${b})`;
    return color;
  };

  return (
    <div
      className="user-list-container"
      style={{ width: "90%", height: "100%", overflowY: "hidden", backgroundColor: 'black' }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "space-between",
          margin: "auto",
        }}
      >
        {selectedUsers.map((user) => (
          <h2
            key={user._id}
            style={{
              borderRadius: "20px",
              backgroundColor: getRandomColor(),
              padding: "6px 12px",
            }}
          >
            {user.name}{" "}
            <button
              style={{
                backgroundColor: "red",
                color: "white",
                fontWeight: "bold",
                borderRadius: "50%",
                padding: "4px",
                cursor: "pointer",
              }}
              onClick={() => handleRemoveUserFromGroup(user)}
            >
              x
            </button>
          </h2>
        ))}
        {selectedUsers && (
          <button
            style={{
              backgroundColor: "green",
              borderRadius: "10px",
              padding: "3px 14px",
              alignSelf: "flexEnd",
            }}
            onClick={handleAddUsersAPI}
          >
            <strong>Save</strong>
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ width: "90%" }}
      />
      <input type="button" value={"clear"} onClick={handleClearUsers} />
      <ul
        className="user-list"
        style={{
          overflowY: "scroll",
          // border: "2px solid white",
          height: "80%",
          width: "100%",
        }}
      >
        {filteredUsers.map((user) => (
          <li key={user._id} className="user-item">
            <div className="user-details">
              
              <img src={user.pic} alt={user.name} className="user-picture" />

                <h3>{user.name}</h3>
                <button
                onClick={() => handleAddUserToGroup(user)}
                style={{
                  borderRadius: "50%",
                  padding: "0px 2px",
                  color: "lightgreen",
                  border: "1px solid lightgreen",
                  backgroundColor: "black",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                +
    </button>
              
              
            </div>
          </li>
        ))}
        {searchQuery && filteredUsers.length === 0 && (
          <h2>No User data found...</h2>
        )}
      </ul>
    </div>
  );
};

export default UserList;
