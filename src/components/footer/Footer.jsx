import React, { useState } from 'react';
import TeamSlider from '../ourteam/TeamSlider';
import axios from 'axios';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'
const API_URL = import.meta.env.VITE_API_URL;
const Footer = () => {
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const history = useNavigate()

    const contactSubmitHandler = async (e) => {
        e.preventDefault();

        if (!contactEmail || !contactMessage || !contactName)
            return toast.warning('Please enter credentials!!');
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const body = {
            name: contactName,
            email: contactEmail,
            message: contactMessage,
        };
        try {
            const { data } = await axios.post(`${API_URL}/query`, body, config);
            // console.log(data);
            toast.success(data.message);
            return history('/');
        } catch (err) {
            // console.log(err.stack);
            return toast.error('Please try later!!!');
        }
    };
    return (
        <footer style={{ display: 'flex', height: '100vh', width:'100vw', justifyContent:'center', alignItems:'center', backgroundColor:'#f3f3f3' }}>
            <section
                id="contactus-container"
                style={{
                    width: '100%',
                    padding: '0 10vw',
                    backgroundColor: '#f3f3f3',
                
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        flexWrap: 'wrap',
                    }}
                >
                    <form
                        onSubmit={contactSubmitHandler}
                        style={{
                            marginTop: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1em',
                            minWidth: '300px',
                            width: '55%',
                            paddingBottom: '60px',
                        }}
                    >
                        <h2
                            style={{
                                fontSize: '34px',
                            }}
                        >
                            Contact Us
                        </h2>
                        <input
                            type="text"
                            placeholder="Name"
                            name="contactName"
                            id="contactName"
                            value={contactName}
                            required
                            style={{
                                padding: '4px 10px',
                                
                                fontSize: '20px',
                                borderTop: 'none',
                                borderLeft: 'none',
                                borderRight: 'none',
                                borderBottom: '3px solid black',
                                outline: 'none',
                                backgroundColor:'inherit'
                            }}
                            onChange={(e) => setContactName(e.target.value)}
                        />
                        <input
                            type="gmail"
                            placeholder="Email"
                            name="contactEmail"
                            id="contactEmail"
                            value={contactEmail}
                            required
                            style={{
                                padding: '4px 10px',
                                fontSize: '20px',
                                borderTop: 'none',
                                borderLeft: 'none',
                                borderRight: 'none',
                                borderBottom: '3px solid black',
                                outline: 'none',
                                backgroundColor:'inherit'
                            }}
                            onChange={(e) => setContactEmail(e.target.value)}
                        />

                        <textarea
                            name="contactMessage"
                            id="contactMessage"
                            cols="16"
                            rows="5"
                            placeholder="Message"
                            value={contactMessage}
                            required
                            style={{
                                padding: '0.2rem 0.6rem',

                                fontSize: '1.4rem',
                                borderTop: 'none',
                                borderLeft: 'none',
                                borderRight: 'none',
                                borderBottom: '3px solid black',
                                // outline: "none",
                                backgroundColor:'inherit'
                            }}
                            onChange={(e) => setContactMessage(e.target.value)}
                        ></textarea>

                        <button
                            type="submit"
                            style={{
                                padding: '4px 30px',
                                fontWeight: 'bold',
                                justifySelf: 'flex-end',
                                margin: 'auto',
                                border: 'none',
                                borderRadius: '10px',
                                cursor:'pointer'
                            }}
                        >
                            Submit
                        </button>
                    </form>
                    
                </div>
            </section>
        </footer>
    );
};

export default Footer;
