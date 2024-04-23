import React, { useState, useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { updateUser } from '../../slices/authSlice.js';
import { groups } from '../../slices/groupsSlice';
import { toast } from 'react-toastify';
const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
    const history = useNavigate();
    const dispatch = useDispatch();
    const groupsList = useSelector(groups);
    const userData = useSelector((state) => state.auth);
    const [privateGroups, setPrivateGroups] = useState([]);
    const [loadingGroup, setLoadingGroup] = useState(false);

    const getPrivateGroups = async () => {
        setLoadingGroup(true);
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
        try {
            const { data } = await axios.get(`${API_URL}/groups/private`, config);
            console.log('data: ', data);
            setPrivateGroups(data.data);
            console.log('received from api data to set to private groups', data.data);
            setLoadingGroup(false);
        } catch (err) {
            console.log('error: ', err);
            setLoadingGroup(false);
        }
    };
    //
    // useEffect(() => {
    //     getPrivateGroups();
    // }, []);

    useEffect(() => {
        getPrivateGroups();
    }, [userData.isLoggedIn]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    };
                    const response = await axios.get(`${API_URL}/user/${userData.id}`, config);
                    dispatch(
                        updateUser({
                            ...response.data.data,
                            fitnessGoals: response.data.data.bio,
                        })
                    );
                    localStorage.setItem('userData', JSON.stringify(response.data.data));
                } else {
                    history.push('/');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            dispatch(updateUser(JSON.parse(storedUserData)));
        }

        fetchUserData();
    }, []);

    const handleDeleteGroup = async (groupAdmin, groupid) => {
        if (userData.id === groupAdmin) {
            try {
                const token = localStorage.getItem('token');
                console.log('Removing the group as admin');
                if (token) {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    };
                    const response = await axios.delete(`${API_URL}/groups/${groupid}`, config);
                    if (response.data.success) {
                        toast.success('Removed the group successfully!');
                        // history.push("/profile");
                        // setPrivateGroups([]);
                        getPrivateGroups();
                    } else {
                        toast.error('Cannot delete group');
                    }
                } else {
                    // Redirect the user to the login page if token is not found
                    history.push('/');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } else {
            try {
                const token = localStorage.getItem('token');
                console.log('Leaving from the group as member');
                if (token) {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    };
                    const response = await axios.put(
                        `${API_URL}/groups/${groupid}/members`,
                        { user: userData.id },
                        config
                    );
                    if (response.data) {
                        toast.success('Left the group successfully!');
                    }
                } else {
                    history.push('/');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };

    const editProfileHandler = () => {
        history('/editprofile');
    };

    const handleNavigatePrivateGroup = (id) => {
        console.log(id);
        if (!id) {
            console.log(' group id required!!');
            return;
        }

        // history(`/joinprivategroup/${id}`);
        history(`/privategroup/${id}`);
    };

    return (
        // Your JSX for Profile component...
        <div
            className="profile-container"
            style={{
                paddingTop: '5rem',
                backgroundColor: 'black',
                color: 'white',
                minHeight: '100vh',
            }}
        >
            <Grid container spacing={4} style={{ color: 'white' }} sx={{ background: 'black' }}>
                <Grid item xs={12}>
                    <Paper sx={{ padding: '10px', backgroundColor: 'black', color: 'white' }}>
                        <h3>User Profile</h3>
                        <br />
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                flexWrap: 'wrap',
                                gap: '10px',
                            }}
                        >
                            <img
                                src={userData?.pic}
                                alt="profilePic"
                                height="100px"
                                style={{ borderRadius: '12px' }}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px',
                                    minWidth: '400px',
                                }}
                            >
                                <h4>{userData?.name}</h4>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flexStart',
                                        alignItems: 'flexStart',
                                    }}
                                >
                                    <p>Age: {userData?.age ? `${userData.age} yo` : 'Add age'} </p>
                                    <p>
                                        Weight:{' '}
                                        {userData?.weight
                                            ? `${userData?.weight} kgs`
                                            : 'Add weight'}{' '}
                                    </p>
                                    <p>
                                        {' '}
                                        Height:
                                        {userData?.height?.value
                                            ? `${userData?.height?.value} ft`
                                            : 'Add height'}
                                    </p>
                                </div>
                                <p>Fitness Goals: {userData?.fitnessGoals}</p>
                                <button
                                    onClick={editProfileHandler}
                                    style={{
                                        color: 'black',
                                        backgroundColor: '#FFD700',
                                        alignSelf: 'flex-start',
                                        padding: '2px 25px',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <strong>Edit</strong>
                                </button>
                            </div>
                        </div>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper
                        sx={{
                            padding: '10px',
                            paddingTop: '0',
                            backgroundColor: 'black',
                            color: 'white',
                        }}
                    >
                        <h3>Groups</h3>

                        <div
                            style={{
                                display: 'flex',
                                padding: '10px',
                                gap: '8px',
                                justifyContent: 'space-around',
                                flexWrap: 'wrap',
                                width: '100%',
                                paddingTop: '2rem',
                            }}
                        >
                            {privateGroups.map((group, index) => (
                                <div
                                    key={index}
                                    style={{
                                        minWidth: '320px',
                                        // minHeight:'120px',
                                        width: '45%',
                                        border: '2px solid gold',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            // justifyContent: "center",
                                            gap: '1rem',
                                            // alignItems: "center",
                                        }}
                                    >
                                        <img
                                            src={group.icon}
                                            alt="groupIconPic"
                                            height="70px"
                                            width="70px"
                                            style={{
                                                borderRadius: '6px',
                                                border: 'solid 1px gold',
                                            }}
                                        />
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                // justifyContent: "space-between",
                                                padding: '0.5rem',
                                                flexGrow: 1,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    flexGrow: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    padding: '0.3rem 0',
                                                }}
                                            >
                                                <h4
                                                    onClick={() =>
                                                        handleNavigatePrivateGroup(group._id)
                                                    }
                                                >
                                                    {group.name}
                                                </h4>
                                                <p
                                                    onClick={() =>
                                                        handleNavigatePrivateGroup(group._id)
                                                    }
                                                >
                                                    {group.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-evenly',
                                            padding: '4px',
                                        }}
                                    >
                                        <span>
                                            Role:
                                            {group.admin === userData.id ? 'Admin' : 'Member'}
                                        </span>

                                        <button
                                            onClick={() =>
                                                handleDeleteGroup(group.admin, group._id)
                                            }
                                            style={{
                                                color: 'black',
                                                backgroundColor: 'red',
                                                padding: '0 14px',
                                                borderRadius: '6px',
                                            }}
                                        >
                                            <strong>
                                                {group.admin === userData.id ? 'Delete' : 'Leave'}
                                            </strong>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default Profile;
