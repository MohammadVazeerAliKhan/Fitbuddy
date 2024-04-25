import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import UploadImage from '../../components/UploadImage.jsx';
const CreateGroupForm = () => {
    const navigate = useNavigate();
    const [groupIcon, setGroupIcon] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');

    const handleReset = () => {
        setGroupName('');
        setGroupDescription('');
    };

    const handleCreateGroupSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // api request and then set the other values to initial values
            const API_URL = import.meta.env.VITE_API_URL;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };
            const body = {
                name: groupName,
                description: groupDescription,
                icon: groupIcon,
            };

            // if (previewImage) body.icon = previewImage;
            const { data } = await axios.post(`${API_URL}/groups`, body, config);
            if (data.success) {
                console.log('data: ', data);

                const groupId = data.data._id;
                toast.success('Group created!');
                return navigate(`/privategroup/${groupId}`);
            }

            toast.error('Failed to create!!');
            // const groupId = data
            // handleReset();
            // navigate('/createchallenge');
        } catch (err) {
            toast.error('Failed to create group');
            console.log('Error in create Group: ', err);
        }
    };

    return (
        <div
            className="creategroup-container"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100vw',
            }}
        >
            <div
                className="creategroup-form"
                style={{
                    width: '50%',
                    margin: 'auto',
                    minWidth: '350px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        width: '90%',
                        backgroundColor: '#CFDBF8',
                        color: 'black',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <p style={{textAlign:'center'}}>Add Group Icon here</p>
                    <UploadImage picUrl={groupIcon? groupIcon:'/Assets/Images/groupimage.png'} changePicUrl={setGroupIcon} />
                </div>

                <form
                    onSubmit={handleCreateGroupSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '90%',
                        backgroundColor: '#CFDBF8',
                        padding: '0.6rem',
                        marginBottom: '2.4rem',
                    }}
                >
                    <TextField
                        label="Group Name:"
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Group name here..."
                        required
                        sx={{ mb: 1, width: '90%' }}
                    />
                    <TextField
                        label="Group Description:"
                        type="text"
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        placeholder="Group Description here..."
                        required
                        sx={{ mb: 1, width: '90%' }}
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
                            padding: '0.6rem 2.5rem',
                            backgroundColor: '#00647A',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '0.7rem',
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
