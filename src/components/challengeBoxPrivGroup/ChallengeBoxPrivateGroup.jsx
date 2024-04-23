import React, { useEffect, useState } from 'react';
import DateCalendarServerRequest from '../Calender/DateCalender';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_API_URL;
const ChallengeBoxPrivateGroup = ({ showCalender, id }) => {
    const history = useNavigate();
    const [challenges, setChallenges] = useState([]);
    const [progress, setProgress] = useState({});
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const user = useSelector((state) => state.auth);

    const getChallenges = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.get(`${API_URL}/challenges/${id}`, config);
            data.data.forEach((challenge) => {
                challenge.progress.forEach((userProgress) => {
                    if (userProgress.user._id === user.id) {
                        challenge.joined = true;
                    }

                    if (!challenge.joined) challenge.joined = false;
                });
            });
            setChallenges(data.data);
        } catch (err) {
            toast.error(err.message);
        }
    };
    useEffect(() => {
        getChallenges();
    }, []);

    const handleJoinChallenge = async (challengeId) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        const body = {
            users: [],
        };
        body.users.push(user.id);
        try {
            const { data } = await axios.post(
                `${API_URL}/challenges/${challengeId}/members`,
                body,
                config
            );

            getChallenges();
            toast.success('Now you are a part of this challenge');
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };

    const handleShowProgress = (challengeId, isUpdate = false) => {
        const index = challenges.findIndex((val) => val._id === challengeId);
        const progressData = challenges[index].progress;
        const progressIndex = progressData.findIndex((val) => val.user._id === user.id);
        // console.log('progress!!!!!: ', progressData);
        // console.log('progress2: ', progressData[progressIndex]);
        if (isUpdate) {
            // Get the current date
            const currentDate = new Date();

            // Subtract one day from the current date
            const previousDate = new Date(currentDate);
            previousDate.setDate(currentDate.getDate() - 1);
            let isDateExists = progressData[progressIndex].data.findIndex(
                (val) => val.date.split('T')[0]
            );
            if (isDateExists !== -1) {
                progressData[progressIndex].data.forEach((data) => {
                    if (data.date.split('T')[0] === previousDate.toISOString().split('T')[0]) {
                        if (!data.completed) data.completed = true;
                    }

                    return data;
                });
            } else {
                progressData[progressIndex].data.push({
                    completed: true,
                    date: '2024-04-22T00:00:00.000Z',
                });
            }
        }
        if (progressIndex != -1) {
            setProgress(JSON.parse(JSON.stringify(progressData[progressIndex])));
            setSelectedChallenge(JSON.parse(JSON.stringify(challenges[index])));
        }
    };

    const handleUpdateProgress = async (challengeId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };

            // Get the current date
            const currentDate = new Date();

            // Subtract one day from the current date
            const previousDate = new Date(currentDate);
            previousDate.setDate(currentDate.getDate() - 1);

            // Convert the previous date to ISO string
            const previousDateISOString = previousDate.toISOString();
            const body = {
                date: previousDateISOString.split('T')[0],
                completed: true,
            };

            // Update progress on the server
            const response = await axios.put(
                `${API_URL}/challenges/${challengeId}/progress/`,
                body,
                config
            );

            // console.log('API Call !!', response.data);
            // Re-fetch the updated progress data
            const progressResponse = await axios.get(`${API_URL}/challenges/${id}`, config);
            const updatedProgress = progressResponse.data.data.progress || [];

            // Update the challenges state with the updated progress
            setChallenges(
                challenges.map((challenge) => {
                    if (challenge._id === challengeId) {
                        return {
                            ...challenge,
                            progress: updatedProgress.find(
                                (progress) => progress.user?._id === user.id
                            ),
                        };
                    }
                    return challenge;
                })
            );

            handleShowProgress(challengeId, true);

            toast('Progress Updated..');
        } catch (err) {
            console.error('Failed to Update Progress:', err);
            toast.error('Failed to Update Progress!!');
        }
    };

    const getDateShow = (date) => {
        const currentDate = new Date(date);

        // Subtract one day from the current date
        const previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getDate() + 1);

        // Convert the previous date to ISO string
        const previousDateISOString = previousDate.toISOString();
        return previousDateISOString.split('T')[0];
    };

    return (
        <div
            className="left-side"
            style={{
                width: '42%',
                minWidth: '350px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4vh',
                justifyContent: 'space-around',
                // border: '2px solid white',
                height: '90vh',
                backgroundColor: 'black',
            }}
        >
            <div
                className="box challenges"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    height: '50vh',
                }}
            >
                <h2>
                    Challenges{' '}
                    <button
                        className="add-challenge-btn"
                        style={{
                            borderRadius: '50%',
                            backgroundColor: 'green',
                            padding: '3px',
                            fontWeight: 'bold',
                        }}
                        onClick={() => history(`/groups/${id}/createchallenge`)}
                    >
                        +
                    </button>
                </h2>
                <div style={{ height: '40vh', overflowY: 'auto' }}>
                    {challenges.map((challenge) => (
                        <div
                            key={challenge._id}
                            className="challenge"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                paddingBottom: '8px',
                                borderBottom: '2px solid white',
                                marginBottom: '6px',
                            }}
                        >
                            <h3
                                onClick={() =>
                                    challenge.joined && handleShowProgress(challenge._id)
                                }
                            >
                                Challenge Name: {challenge.name}
                            </h3>
                            <p>
                                {' '}
                                Duration:
                                {getDateShow(challenge.startDate)} -{' '}
                                {getDateShow(challenge.endDate)}
                            </p>

                            {challenge.joined && (
                                <button
                                    className="update-status-btn"
                                    style={{
                                        alignSelf: 'center',
                                        padding: '2px 10px',
                                        backgroundColor: 'green',
                                        borderRadius: '10px',
                                        transition: 'box-shadow 0.3s ease', // Adding transition for smooth effect
                                        boxShadow: 'none', // Initial state without box shadow
                                        ':hover': {
                                            // Pseudo-class for hover effect
                                            boxShadow: '2px 2px 5px white', // Box shadow on hover
                                        },
                                    }}
                                    onClick={() => handleUpdateProgress(challenge._id)}
                                >
                                    Update Status
                                </button>
                            )}
                            {!challenge.joined && (
                                <button
                                    onClick={() => handleJoinChallenge(challenge._id)}
                                    style={{
                                        borderRadius: '10px',
                                        padding: '4px 8px',
                                        backgroundColor: 'green',
                                        color: 'black',
                                    }}
                                >
                                    JOIN
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div
                className="box calendar"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    alignItems: 'center',
                    height: '60%',
                }}
            >
                {selectedChallenge && (
                    <>
                        <h2>{selectedChallenge && selectedChallenge.name}</h2>
                        {/* <h2>Fitness Group Challenge</h2> */}
                        <div
                            style={{
                                flexGrow: 1,
                                border: '2px solid white',
                                background: 'white',
                            }}
                        >
                            <DateCalendarServerRequest
                                progress={progress}
                                challenge={selectedChallenge}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChallengeBoxPrivateGroup;
